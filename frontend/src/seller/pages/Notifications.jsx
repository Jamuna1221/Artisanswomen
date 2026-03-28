import React, { useEffect, useState } from 'react';
import api from '../services/axios';
import './seller.css';

export default function SellerNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/notifications/seller');
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/seller/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/seller/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return '⚠️';
            case 'approval': return '🎉';
            case 'rejection': return '❌';
            default: return 'ℹ️';
        }
    };

    return (
        <div className="seller-page-scroll" style={{ padding: '2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <h2>Your Notifications</h2>
                    <button onClick={markAllAsRead} style={{ padding: '8px 12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mark all as read</button>
                </div>

                {loading ? (
                    <p>Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>You have no notifications yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {notifications.map(n => (
                            <div key={n._id} style={{ display: 'flex', gap: '15px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: n.isRead ? '#fafafa' : '#eef2ff' }}>
                                <div style={{ fontSize: '1.5rem' }}>{getIcon(n.notificationType)}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0, fontWeight: n.isRead ? 'normal' : 'bold' }}>{n.title}</h4>
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ margin: '8px 0', color: '#555' }}>{n.message}</p>
                                    {n.priority === 'urgent' && <span style={{ color: 'red', fontSize: '0.8rem', fontWeight: 'bold' }}>URGENT</span>}
                                </div>
                                {!n.isRead && (
                                    <button onClick={() => markAsRead(n._id)} style={{ alignSelf: 'center', background: 'none', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                        Mark Read
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
