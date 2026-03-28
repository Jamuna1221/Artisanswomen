import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
  Search, Plus, MoreVertical, Send, Smile, Paperclip,
  Users, Trash2, Edit2, LogOut, X, Check, Mic, MicOff,
  Play, Pause, StopCircle
} from 'lucide-react';
import Picker from 'emoji-picker-react';
import { useAuth } from '../../../seller/context/AuthContext';
import api from '../../services/axios';
import './MessagesPage.css';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/* ─────────────────────────────────────────────────────────────────
   AUDIO PLAYER — used inside voice message bubbles
───────────────────────────────────────────────────────────────── */
const AudioPlayer = ({ src, senderInitial, isMe }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrent] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(p => !p);
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`wx-audio-player ${isMe ? 'wx-audio-me' : 'wx-audio-them'}`}>
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={e => setDuration(e.target.duration)}
        onTimeUpdate={e => {
          setCurrent(e.target.currentTime);
          setProgress((e.target.currentTime / e.target.duration) * 100 || 0);
        }}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0); }}
      />

      {/* Avatar */}
      <div className={`wx-audio-avatar ${isMe ? 'wx-audio-avatar-me' : ''}`}>
        <div className="wx-audio-initial">{senderInitial}</div>
        {playing && <div className="wx-audio-ring" />}
      </div>

      {/* Controls */}
      <div className="wx-audio-controls">
        <button className="wx-audio-play-btn" onClick={togglePlay}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>

        {/* Waveform bars */}
        <div className="wx-audio-waveform">
          {Array.from({ length: 28 }).map((_, i) => {
            const filled = progress > 0 && (i / 28) * 100 <= progress;
            return (
              <div
                key={i}
                className={`wx-wave-bar ${filled ? 'filled' : ''} ${playing ? 'playing' : ''}`}
                style={{ animationDelay: `${i * 0.04}s`, height: `${8 + Math.sin(i * 0.8) * 8}px` }}
              />
            );
          })}
        </div>

        <span className="wx-audio-time">
          {playing ? fmt(currentTime) : fmt(duration || 0)}
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────── */
const MessagesPage = () => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);

  // Core state
  const [activeTab, setActiveTab] = useState('chats');
  const [myGroups, setMyGroups] = useState([]);
  const [browseGroups, setBrowseGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Send lock
  const isSendingRef = useRef(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  // Edit
  const [editingMessage, setEditingMessage] = useState(null);

  // UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Image attachment
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const imageInputRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Voice recording state ──────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);       // finished blob
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null); // for preview
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const micButtonRef = useRef(null);

  // ── Typing Indicator State ─────────────────────────────────────
  const [typingUsers, setTypingUsers] = useState({}); // { groupId: [userName, ...] }
  const typingTimeoutRef = useRef(null);

  const newGroupForm = { name: '', description: '', category: '', privacy: 'public' };
  const [createForm, setCreateForm] = useState(newGroupForm);

  const messagesEndRef = useRef(null);
  const activeGroupRef = useRef(null);

  // ── Socket init ────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    const newSocket = io(SOCKET_URL, { query: { token }, withCredentials: true });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [token]);

  // Initial data
  useEffect(() => {
    fetchMyGroups();
    fetchBrowseGroups();
  }, []);

  // Keep ref in sync
  useEffect(() => {
    activeGroupRef.current = activeGroup;
  }, [activeGroup]);

  // ── Socket listeners (stable — uses ref) ───────────────────────
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_group_message', (message) => {
      const currentGroup = activeGroupRef.current;
      if (currentGroup && String(message.groupId) === String(currentGroup._id)) {
        setMessages(prev => {
          const isFromMe =
            String(message.senderId) === String(user?._id) ||
            String(message.senderId?._id) === String(user?._id);

          if (isFromMe) {
            const withoutOptimistic = prev.filter(m => !m._optimistic);
            if (withoutOptimistic.some(m => String(m._id) === String(message._id))) return prev;
            return [...withoutOptimistic, message];
          } else {
            if (prev.some(m => String(m._id) === String(message._id))) return prev;
            return [...prev, message];
          }
        });
        scrollToBottom();
      }
      setMyGroups(groups => {
        const member = groups.find(g => String(g._id) === String(message.groupId));
        if (!member) return groups;
        return groups
          .map(g => String(g._id) === String(message.groupId)
            ? { ...g, lastMessage: message.content || '🎤 Voice message', lastMessageAt: message.createdAt }
            : g
          )
          .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    });

    socket.on('update_group_message', ({ messageId, content }) =>
      setMessages(prev => prev.map(m => String(m._id) === String(messageId) ? { ...m, content } : m))
    );

    socket.on('delete_group_message', ({ messageId }) =>
      setMessages(prev => prev.filter(m => String(m._id) !== String(messageId)))
    );

    socket.on('member_joined', () => {
      const g = activeGroupRef.current;
      if (g) fetchMessages(g._id);
    });

    socket.on('member_left', () => {
      const g = activeGroupRef.current;
      if (g) fetchMessages(g._id);
    });

    socket.on('display_typing', ({ groupId, userName }) => {
      setTypingUsers(prev => {
        const list = prev[groupId] || [];
        if (list.includes(userName)) return prev;
        return { ...prev, [groupId]: [...list, userName] };
      });
    });

    socket.on('hide_typing', ({ groupId, userName }) => {
      setTypingUsers(prev => {
        const list = prev[groupId] || [];
        return { ...prev, [groupId]: list.filter(u => u !== userName) };
      });
    });

    return () => {
      socket.off('receive_group_message');
      socket.off('update_group_message');
      socket.off('delete_group_message');
      socket.off('member_joined');
      socket.off('member_left');
      socket.off('display_typing');
      socket.off('hide_typing');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user]);

  // Group switch
  useEffect(() => {
    if (activeGroup && socket) {
      fetchMessages(activeGroup._id);
      socket.emit('join_group', activeGroup._id);
      setEditingMessage(null);
      setMessageInput('');
      setSendError('');
      cancelRecording();
      return () => socket.emit('leave_group', activeGroup._id);
    }
  }, [activeGroup, socket]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }));
  }, []);

  // ── Data fetchers ──────────────────────────────────────────────
  const fetchMyGroups = async () => {
    try { const r = await api.get('/community/groups/my'); setMyGroups(r.data); } catch { }
  };
  const fetchBrowseGroups = async (q = '') => {
    try { const r = await api.get(`/community/groups/search?query=${q}`); setBrowseGroups(r.data); } catch { }
  };
  const fetchMessages = async (groupId) => {
    try { const r = await api.get(`/community/groups/${groupId}/messages`); setMessages(r.data); scrollToBottom(); } catch { }
  };

  // ── Send text / image message ──────────────────────────────────
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmed = messageInput.trim();
    if ((!trimmed && !selectedImage) || !activeGroup) return;
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setIsSending(true);
    setSendError('');

    try {
      if (editingMessage) {
        await api.put(`/community/groups/messages/${editingMessage._id}`, { content: trimmed });
        setEditingMessage(null);
        setMessageInput('');
        setShowEmojiPicker(false);
      } else {
        // Optimistic
        const optimisticMsg = {
          _id: `optimistic-${Date.now()}`,
          _optimistic: true,
          groupId: activeGroup._id,
          senderId: user?._id,
          senderName: user?.name || user?.businessName || 'You',
          content: trimmed,
          messageType: selectedImage ? 'image' : 'text',
          attachmentUrl: imagePreview || null,
          createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMsg]);
        scrollToBottom();
        setMessageInput('');
        setSelectedImage(null);
        setImagePreview(null);
        setShowEmojiPicker(false);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        const formData = new FormData();
        formData.append('content', trimmed);
        formData.append('messageType', selectedImage ? 'image' : 'text');
        if (selectedImage) formData.append('image', selectedImage);
        await api.post(`/community/groups/${activeGroup._id}/messages`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    } catch (err) {
      console.error('Send failed:', err);
      setSendError('Message failed to send. Tap to retry.');
      setMessages(prev => prev.filter(m => !m._optimistic));
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
    }
  };

  // ── Send voice message ─────────────────────────────────────────
  const handleSendVoice = async (blob) => {
    if (!blob || !activeGroup) return;
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setIsSending(true);
    setSendError('');

    const localUrl = URL.createObjectURL(blob);

    // Optimistic voice bubble
    const optimisticMsg = {
      _id: `optimistic-${Date.now()}`,
      _optimistic: true,
      groupId: activeGroup._id,
      senderId: user?._id,
      senderName: user?.name || user?.businessName || 'You',
      content: '🎤 Voice message',
      messageType: 'audio',
      attachmentUrl: localUrl,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      const audioFile = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type });
      const formData = new FormData();
      formData.append('content', '🎤 Voice message');
      formData.append('messageType', 'audio');
      formData.append('audio', audioFile);
      await api.post(`/community/groups/${activeGroup._id}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (err) {
      console.error('Voice send failed:', err);
      setSendError('Voice message failed. Tap to retry.');
      setMessages(prev => prev.filter(m => !m._optimistic));
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
      setAudioBlob(null);
      setAudioPreviewUrl(null);
    }
  };

  // ── Voice recording handlers ───────────────────────────────────
  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioPreviewUrl(url);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      console.error('Mic access denied:', err);
      alert('Microphone access is required for voice messages.');
    }
  };

  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
    }
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    audioChunksRef.current = [];
  };

  const fmtRecording = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ── Input helpers ──────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';

    // TYPING INDICATOR EMITS
    if (socket && activeGroup) {
      socket.emit('typing', {
        groupId: activeGroup._id,
        userName: user?.name || user?.businessName || 'Someone'
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', {
          groupId: activeGroup._id,
          userName: user?.name || user?.businessName || 'Someone'
        });
      }, 2000);
    }
  };

  const handleEditInit = (msg) => {
    setEditingMessage(msg);
    let t = msg.content || '';
    if (t.endsWith(' (edited)')) t = t.replace(' (edited)', '');
    setMessageInput(t);
    textareaRef.current?.focus();
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await api.delete(`/community/groups/messages/${msgId}`);
      setMessages(prev => prev.filter(m => String(m._id) !== String(msgId)));
      if (editingMessage && String(editingMessage._id) === String(msgId)) {
        setEditingMessage(null); setMessageInput('');
      }
    } catch { }
  };

  const handleJoinGroup = async (group) => {
    try {
      const res = await api.post(`/community/groups/${group._id}/join`);
      setMyGroups([res.data.group, ...myGroups]);
      setActiveGroup(res.data.group);
      setBrowseGroups(bg => bg.map(b => String(b._id) === String(group._id) ? { ...b, members: [...b.members, user._id] } : b));
    } catch { }
  };

  const handleLeaveGroup = async () => {
    if (!activeGroup) return;
    try {
      await api.post(`/community/groups/${activeGroup._id}/leave`);
      setMyGroups(myGroups.filter(g => String(g._id) !== String(activeGroup._id)));
      setActiveGroup(null);
      setShowGroupInfo(false);
    } catch { }
  };

  const onEmojiClick = (emojiObject) => {
    setMessageInput(prev => prev + emojiObject.emoji);
    textareaRef.current?.focus();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setShowEmojiPicker(false);
    }
  };

  const isMember =
    activeGroup?.members?.some(m => String(m) === String(user?._id)) ||
    myGroups.some(g => String(g._id) === String(activeGroup?._id));

  const isMyMessage = (msg) => {
    if (msg._optimistic) return true;
    return String(msg.senderId) === String(user?._id) ||
      String(msg.senderId?._id) === String(user?._id);
  };

  const showMicBtn = !messageInput.trim() && !selectedImage && !editingMessage;

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="wx-chat-container fade-in">

      {/* ══ LEFT SIDEBAR ══ */}
      <div className="wx-sidebar">
        <div className="wx-sidebar-header">
          <h2>Seller Forums</h2>
          <button className="wx-icon-btn" onClick={() => setShowCreateModal(true)} title="Create Forum Group">
            <Plus size={20} />
          </button>
        </div>

        <div className="wx-search-bar">
          <div className="wx-search-input">
            <Search size={16} />
            <input type="text" placeholder="Search forums..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); fetchBrowseGroups(e.target.value); }} />
          </div>
        </div>

        <div className="wx-tabs">
          <button className={`wx-tab ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>My Forums</button>
          <button className={`wx-tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => { setActiveTab('browse'); fetchBrowseGroups(searchQuery); }}>Browse Forums</button>
        </div>

        <div className="wx-chat-list">
          {activeTab === 'chats' ? (
            myGroups.filter(g =>
              g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              g.category?.toLowerCase().includes(searchQuery.toLowerCase())
            ).length > 0 ? (
              myGroups
                .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.category?.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(group => (
                  <div key={group._id} className={`wx-chat-item ${activeGroup?._id === group._id ? 'active' : ''}`} onClick={() => { setActiveGroup(group); setShowGroupInfo(false); }}>
                    <div className="wx-avatar">{group.image ? <img src={group.image} alt="G" /> : group.name.charAt(0).toUpperCase()}</div>
                    <div className="wx-chat-info">
                      <div className="wx-chat-top">
                        <span className="wx-chat-name">{group.name}</span>
                        <span className="wx-chat-time">{group.lastMessageAt ? new Date(group.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                      <span className={`wx-chat-preview ${typingUsers[group._id]?.length > 0 ? 'wx-is-typing' : ''}`}>
                        {typingUsers[group._id]?.length > 0
                          ? `${typingUsers[group._id].join(', ')} typing...`
                          : group.lastMessage || 'Tap to view messages'}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="wx-no-results">No groups yet. Try Discover tab!</div>
            )
          ) : (
            browseGroups.length > 0 ? browseGroups.map(group => {
              const already = group.members.includes(user?._id) || myGroups.some(g => String(g._id) === String(group._id));
              return (
                <div key={group._id} className={`wx-chat-item wx-browse-item ${activeGroup?._id === group._id ? 'active' : ''}`} onClick={() => setActiveGroup(group)}>
                  <div className="wx-avatar">{group.image ? <img src={group.image} alt="G" /> : group.name.charAt(0).toUpperCase()}</div>
                  <div className="wx-chat-info">
                    <span className="wx-chat-name">{group.name}{group.category ? ` • ${group.category}` : ''}</span>
                    <span className="wx-chat-preview">{group.members.length} members</span>
                  </div>
                  {!already
                    ? <button className="wx-join-btn" onClick={e => { e.stopPropagation(); handleJoinGroup(group); }}>Join</button>
                    : <span className="wx-joined-badge">✓ Joined</span>
                  }
                </div>
              );
            }) : <div className="wx-no-results">No groups found.</div>
          )}
        </div>
      </div>

      {/* ══ MAIN CHAT ══ */}
      <div className="wx-main-chat">
        {activeGroup ? (
          <>
            {/* Header */}
            <div className="wx-chat-header" onClick={() => setShowGroupInfo(true)}>
              <div className="wx-avatar">
                {activeGroup.image ? <img src={activeGroup.image} alt="G" /> : activeGroup.name.charAt(0).toUpperCase()}
              </div>
              <div className="wx-header-info">
                <h3>{activeGroup.name}</h3>
                <span className={typingUsers[activeGroup._id]?.length > 0 ? 'wx-is-typing' : ''}>
                  {typingUsers[activeGroup._id]?.length > 0
                    ? `${typingUsers[activeGroup._id].join(', ')} typing...`
                    : `${activeGroup.members?.length} participants${activeGroup.category ? ` • ${activeGroup.category}` : ''}`
                  }
                </span>
              </div>
              <div className="wx-header-actions" onClick={e => e.stopPropagation()}>
                {!isMember && (
                  <button className="wx-header-join-btn" onClick={() => handleJoinGroup(activeGroup)}>Join Group</button>
                )}
                <button className="wx-icon-btn" onClick={() => setShowGroupInfo(!showGroupInfo)}>
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="wx-chat-body">
              {messages.length === 0 && (
                <div className="wx-sys-msg"><span>Welcome to {activeGroup.name}! Say hi 👋</span></div>
              )}

              {messages.map((msg, index) => {
                const isMe = isMyMessage(msg);
                if (msg.messageType === 'system') {
                  return <div key={msg._id || index} className="wx-sys-msg"><span>{msg.content}</span></div>;
                }

                return (
                  <div key={msg._id || index} className="wx-msg-row wx-msg-them">
                    <div className="wx-msg-avatar" title={msg.senderName}>
                      {msg.senderName?.charAt(0).toUpperCase()}
                    </div>

                    <div className={`wx-msg-bubble wx-bubble-them ${msg._optimistic ? 'wx-optimistic' : ''}`}>
                      <div className="wx-msg-sender">{msg.senderName}</div>

                      {/* Image */}
                      {msg.messageType === 'image' && msg.attachmentUrl && (
                        <div className="wx-msg-image-wrap">
                          <img src={msg.attachmentUrl} alt="attachment" loading="lazy" />
                        </div>
                      )}

                      {/* Voice / Audio */}
                      {msg.messageType === 'audio' && msg.attachmentUrl && (
                        <AudioPlayer
                          src={msg.attachmentUrl}
                          senderInitial={(isMe ? (user?.name || 'Y') : (msg.senderName || '?')).charAt(0).toUpperCase()}
                          isMe={isMe}
                        />
                      )}

                      {/* Text (skip the placeholder for audio) */}
                      {msg.content && msg.messageType !== 'audio' && (
                        <div className="wx-msg-text">{msg.content}</div>
                      )}

                      {/* Timestamp + ticks */}
                      <div className="wx-msg-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg._optimistic && <span className="wx-sending-tick"> ⏳</span>}
                        {isMe && !msg._optimistic && (
                          <span className={`wx-sent-tick ${msg.status === 'seen' ? 'seen' : ''}`}>
                            {msg.status === 'seen' ? ' ✓✓' : ' ✓'}
                          </span>
                        )}
                      </div>

                      {/* Edit/Delete (if you are the sender) */}
                      {isMe && !msg._optimistic && msg.messageType === 'text' && (
                        <div className="wx-msg-actions">
                          <button onClick={() => handleEditInit(msg)} title="Edit"><Edit2 size={12} /></button>
                          <button onClick={() => handleDeleteMessage(msg._id)} title="Delete"><Trash2 size={12} /></button>
                        </div>
                      )}
                      {isMe && !msg._optimistic && (msg.messageType === 'image' || msg.messageType === 'audio') && (
                        <div className="wx-msg-actions">
                          <button onClick={() => handleDeleteMessage(msg._id)} title="Delete"><Trash2 size={12} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Error banner */}
            {sendError && (
              <div className="wx-send-error" onClick={() => { setSendError(''); }}>
                ⚠️ {sendError}
              </div>
            )}

            {/* Image preview tray */}
            {imagePreview && (
              <div className="wx-image-preview-tray">
                <div className="wx-preview-box">
                  <button className="wx-preview-close" onClick={() => { setImagePreview(null); setSelectedImage(null); }}>
                    <X size={14} />
                  </button>
                  <img src={imagePreview} alt="Preview" />
                </div>
              </div>
            )}

            {/* Audio preview tray (before sending) */}
            {audioPreviewUrl && !isRecording && (
              <div className="wx-audio-preview-tray">
                <button className="wx-preview-cancel-btn" onClick={cancelRecording} title="Cancel">
                  <X size={16} />
                </button>
                <AudioPlayer src={audioPreviewUrl} senderInitial={(user?.name || 'Y').charAt(0).toUpperCase()} isMe={true} />
                <button className="wx-audio-send-confirm" onClick={() => handleSendVoice(audioBlob)} disabled={isSending}>
                  <Send size={18} />
                </button>
              </div>
            )}

            {/* Footer */}
            {!isMember ? (
              <div className="wx-locked-footer">
                <button className="wx-btn-primary" onClick={() => handleJoinGroup(activeGroup)}>
                  Join this group to participate
                </button>
              </div>
            ) : (
              <form className="wx-chat-footer" onSubmit={handleSendMessage}>

                {/* Editing indicator */}
                {editingMessage && (
                  <div className="wx-editing-indicator" onClick={() => { setEditingMessage(null); setMessageInput(''); }}>
                    ✏️ Editing… (click to cancel)
                  </div>
                )}

                {/* Recording state */}
                {isRecording ? (
                  <div className="wx-recording-bar">
                    <button type="button" className="wx-cancel-record-btn" onClick={cancelRecording}>
                      <X size={18} />
                    </button>
                    <div className="wx-recording-indicator">
                      <span className="wx-rec-dot" />
                      <span className="wx-rec-timer">{fmtRecording(recordingSeconds)}</span>
                      <span className="wx-rec-label">Recording…</span>
                    </div>
                    <div className="wx-recording-waves">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="wx-rec-wave" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <button type="button" className="wx-stop-record-btn" onClick={stopRecording} title="Stop & Preview">
                      <StopCircle size={30} />
                    </button>
                  </div>
                ) : (
                  <div className="wx-footer-row">
                    {/* Emoji */}
                    <div className="wx-emoji-wrapper">
                      <button type="button" className="wx-icon-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <Smile size={22} style={{ color: showEmojiPicker ? 'var(--teal)' : '#888' }} />
                      </button>
                      {showEmojiPicker && (
                        <div className="wx-emoji-popup">
                          <Picker onEmojiClick={onEmojiClick} searchDisabled skinTonesDisabled width={300} height={350} />
                        </div>
                      )}
                    </div>

                    {/* Attachment */}
                    <button type="button" className="wx-icon-btn" onClick={() => imageInputRef.current.click()} disabled={!!editingMessage}>
                      <Paperclip size={22} />
                    </button>
                    <input type="file" accept="image/png,image/jpeg,image/webp" hidden ref={imageInputRef} onChange={handleImageChange} />

                    {/* Textarea */}
                    <textarea
                      ref={textareaRef}
                      className="wx-msg-input"
                      placeholder="Type a message..."
                      value={messageInput}
                      rows={1}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowEmojiPicker(false)}
                      disabled={isSending}
                    />

                    {/* Send or Mic */}
                    {showMicBtn ? (
                      <button
                        type="button"
                        ref={micButtonRef}
                        className="wx-send-btn wx-mic-btn"
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onTouchStart={e => { e.preventDefault(); startRecording(); }}
                        onTouchEnd={e => { e.preventDefault(); stopRecording(); }}
                        title="Hold to record voice message"
                      >
                        <Mic size={20} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className={`wx-send-btn ${isSending ? 'wx-send-btn-sending' : ''}`}
                        disabled={isSending || (!messageInput.trim() && !selectedImage)}
                        title={editingMessage ? 'Save Edit' : 'Send'}
                      >
                        {editingMessage ? <Check size={20} /> : <Send size={20} />}
                      </button>
                    )}
                  </div>
                )}
              </form>
            )}
          </>
        ) : (
          <div className="wx-empty-state">
            <div className="wx-empty-icon">🎨</div>
            <h2>Handora Artisan Community</h2>
            <p>Join groups, share ideas and craft tips with fellow artisans.</p>
          </div>
        )}

        {/* Group Info Panel */}
        {activeGroup && showGroupInfo && (
          <div className="wx-group-info-panel">
            <div className="wx-info-header">
              <button className="wx-close-btn" onClick={() => setShowGroupInfo(false)}>✕</button>
              <h3>Group Info</h3>
            </div>
            <div className="wx-info-body">
              <div className="wx-info-avatar-large">
                {activeGroup.image
                  ? <img src={activeGroup.image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="g" />
                  : activeGroup.name.charAt(0).toUpperCase()
                }
              </div>
              <h2>{activeGroup.name}</h2>
              {activeGroup.category && <div className="wx-info-tag">{activeGroup.category}</div>}
              <p className="wx-info-desc">{activeGroup.description || 'Welcome to the group!'}</p>
              <div className="wx-info-section">
                <div className="wx-info-row"><Users size={18} /><span>{activeGroup.members?.length} Participants</span></div>
              </div>
              {isMember && (
                activeGroup.admins?.includes(user?._id)
                  ? <div className="wx-info-actions"><button className="wx-action-btn danger"><Trash2 size={16} /> Delete Group</button></div>
                  : <div className="wx-info-actions"><button className="wx-action-btn danger" onClick={handleLeaveGroup}><LogOut size={16} /> Exit Group</button></div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="wx-modal-overlay">
          <div className="wx-modal">
            <h3>Start a new Community Group</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await api.post('/community/groups', createForm);
                setMyGroups([res.data, ...myGroups]);
                setShowCreateModal(false);
                setActiveGroup(res.data);
                setCreateForm(newGroupForm);
              } catch { }
            }}>
              <div className="settings-field" style={{ marginBottom: '1rem' }}>
                <label>Group Name *</label>
                <input required autoFocus type="text" className="seller-input" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Pottery Masters India" />
              </div>
              <div className="settings-field" style={{ marginBottom: '1rem' }}>
                <label>Description</label>
                <textarea rows={2} className="seller-input" value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} placeholder="What is this group about?" />
              </div>
              <div className="settings-field" style={{ marginBottom: '1rem' }}>
                <label>Category</label>
                <input type="text" className="seller-input" value={createForm.category} onChange={e => setCreateForm({ ...createForm, category: e.target.value })} placeholder="e.g. Weaving, Jewellery" />
              </div>
              <div className="settings-field" style={{ marginBottom: '1rem' }}>
                <label>Privacy</label>
                <select className="seller-input" value={createForm.privacy} onChange={e => setCreateForm({ ...createForm, privacy: e.target.value })}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="wx-modal-footer">
                <button type="button" className="wx-btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="wx-btn-primary">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
