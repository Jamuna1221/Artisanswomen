import React, { useState } from 'react';
import { Send, Mic, Search } from 'lucide-react';
import './MessagesPage.css';

const CONVERSATIONS = [
  { id: 1, buyer: 'Priya Sharma', avatar: 'P', product: 'Madhubani Saree', lastMsg: 'Can you ship it by Thursday?', time: '10:30 AM', unread: 2 },
  { id: 2, buyer: 'Kavya Mehta', avatar: 'K', product: 'Pottery Vase', lastMsg: 'Thank you! It arrived safely.', time: 'Yesterday', unread: 0 },
  { id: 3, buyer: 'Ananya Reddy', avatar: 'A', product: 'Block Print Dupatta', lastMsg: 'Is the dupatta available in blue?', time: 'Mar 26', unread: 1 },
  { id: 4, buyer: 'Rekha Nair', avatar: 'R', product: 'Bamboo Basket', lastMsg: 'Lovely! Will order again 😊', time: 'Mar 24', unread: 0 },
];

const THREAD = {
  1: [
    { from: 'buyer', text: 'Hello! I ordered the Madhubani Saree. Can you confirm the shipping date?', time: '10:00 AM' },
    { from: 'seller', text: 'Hi Priya! Yes, your order is packed. It will be shipped by tomorrow morning.', time: '10:15 AM' },
    { from: 'buyer', text: 'Great! Can you ship it by Thursday?', time: '10:30 AM' },
  ],
  2: [
    { from: 'buyer', text: 'Hi, my pottery vase has arrived!', time: '9:00 AM' },
    { from: 'seller', text: 'Wonderful! Hope you love it 🏺', time: '9:05 AM' },
    { from: 'buyer', text: 'Thank you! It arrived safely.', time: '9:10 AM' },
  ],
  3: [
    { from: 'buyer', text: 'Is the dupatta available in blue?', time: 'Mar 26' },
  ],
  4: [
    { from: 'buyer', text: 'Lovely! Will order again 😊', time: 'Mar 24' },
  ],
};

const MessagesPage = () => {
  const [activeConv, setActiveConv] = useState(1);
  const [message, setMessage] = useState('');
  const [threads, setThreads] = useState(THREAD);
  const [search, setSearch] = useState('');

  const conv = CONVERSATIONS.find(c => c.id === activeConv);
  const currentThread = threads[activeConv] || [];
  const filtered = CONVERSATIONS.filter(c =>
    c.buyer.toLowerCase().includes(search.toLowerCase()) ||
    c.product.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!message.trim()) return;
    setThreads(t => ({
      ...t,
      [activeConv]: [...(t[activeConv] || []), { from: 'seller', text: message.trim(), time: 'Just now' }]
    }));
    setMessage('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="messages-page fade-in">
      <div className="messages-header">
        <h2 className="messages-title">Messages</h2>
        <p className="messages-sub">Chat with your buyers and answer queries</p>
      </div>

      <div className="messages-shell">
        {/* Sidebar: conversations */}
        <div className="messages-list">
          <div className="messages-search">
            <Search size={14} className="messages-search-icon" />
            <input
              type="text"
              className="messages-search-input"
              placeholder="Search buyers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {filtered.map(c => (
            <div
              key={c.id}
              className={`messages-conv-item ${activeConv === c.id ? 'messages-conv-item--active' : ''}`}
              onClick={() => setActiveConv(c.id)}
            >
              <div className="messages-conv-avatar">{c.avatar}</div>
              <div className="messages-conv-body">
                <div className="messages-conv-top">
                  <span className="messages-conv-name">{c.buyer}</span>
                  <span className="messages-conv-time">{c.time}</span>
                </div>
                <div className="messages-conv-product">{c.product}</div>
                <div className="messages-conv-preview">{c.lastMsg}</div>
              </div>
              {c.unread > 0 && <span className="messages-unread">{c.unread}</span>}
            </div>
          ))}
        </div>

        {/* Chat window */}
        <div className="messages-chat">
          <div className="messages-chat-header">
            <div className="messages-conv-avatar">{conv?.avatar}</div>
            <div>
              <div className="messages-chat-name">{conv?.buyer}</div>
              <div className="messages-chat-product">Re: {conv?.product}</div>
            </div>
          </div>

          <div className="messages-chat-body">
            {currentThread.map((msg, i) => (
              <div key={i} className={`messages-bubble-wrap ${msg.from === 'seller' ? 'messages-bubble-wrap--seller' : ''}`}>
                <div className={`messages-bubble ${msg.from === 'seller' ? 'messages-bubble--seller' : 'messages-bubble--buyer'}`}>
                  {msg.text}
                </div>
                <span className="messages-bubble-time">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="messages-chat-input">
            <textarea
              className="messages-textarea"
              placeholder="Type your message… (press Enter to send)"
              rows={1}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="messages-voice-btn" title="Voice Message (coming soon)">
              <Mic size={16} />
            </button>
            <button className="messages-send-btn" onClick={sendMessage}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
