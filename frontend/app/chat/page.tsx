"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConv, setActiveConv] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Get current user
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));
        else router.push('/auth/login');

        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadMessages = async (conv: any) => {
        setActiveConv(conv);
        try {
            const { data } = await api.get(`/chat/conversations/${conv.id}/messages`);
            setMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv) return;

        try {
            const { data } = await api.post(`/chat/conversations/${activeConv.id}/messages`, {
                content: newMessage
            });
            setMessages([...messages, data]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
            <div className="bg-white rounded-xl shadow border h-full flex overflow-hidden">

                {/* Sidebar */}
                <div className="w-1/3 border-r flex flex-col">
                    <div className="p-4 border-b font-bold text-lg bg-gray-50">Messages</div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(c => {
                            const otherUser = c.buyerId === user?.id ? c.seller : c.buyer;
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => loadMessages(c)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeConv?.id === c.id ? 'bg-red-50' : ''}`}
                                >
                                    <div className="font-bold">{otherUser?.firstName || 'User'}</div>
                                    <div className="text-xs text-gray-500 mb-1">{c.listing?.title}</div>
                                    <div className="text-sm text-gray-600 truncate">Click to read chat</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {activeConv ? (
                        <>
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <div className="font-bold">
                                    {activeConv.buyerId === user?.id ? activeConv.seller?.firstName : activeConv.buyer?.firstName}
                                    <span className="text-gray-400 font-normal text-sm ml-2">re: {activeConv.listing?.title}</span>
                                </div>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                                {messages.map((m) => {
                                    const isMe = m.senderId === user?.id;
                                    return (
                                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-lg ${isMe ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                                {m.content}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t">
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <input
                                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition">
                                        Send
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
