'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '@/lib/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

function TicketDetailPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  const { token } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchTicket = async () => {
    if (!token || !ticketId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/help-tickets/${ticketId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch ticket');
      }

      if (data.data) {
        setTicket(data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ticket');
      console.error('Error fetching ticket:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && ticketId) {
      fetchTicket();
    }
  }, [token, ticketId]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      return;
    }

    setIsSubmittingReply(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/help-tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyMessage.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reply');
      }

      setReplyMessage('');
      fetchTicket(); // Refresh ticket to get new message
    } catch (err) {
      setError(err.message || 'Failed to send reply');
      console.error('Error sending reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'open':
        return '#3b82f6';
      case 'closed':
        return '#6b7280';
      case 'draft':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
          <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex mt-16">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
              <div className="p-6">
                <p style={{ color: 'var(--text-secondary)' }}>Loading ticket...</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div>
        <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
          <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex mt-16">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
              <div className="p-6">
                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  onClick={() => router.push('/help-tickets')}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                >
                  Back to Tickets
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div>
      <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex mt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
            <div className="p-6">
              <div className="mb-4">
                <button
                  onClick={() => router.push('/help-tickets')}
                  className="text-sm mb-4 inline-block"
                  style={{ color: 'var(--primary-color)' }}
                >
                  ← Back to Tickets
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Ticket Header */}
              <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
                      {ticket.subject}
                    </h1>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {ticket.name} {ticket.instance_name ? `• ${ticket.instance_name}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className="px-3 py-1 rounded text-sm font-medium"
                      style={{ backgroundColor: getStateColor(ticket.state) + '20', color: getStateColor(ticket.state) }}
                    >
                      {ticket.state.toUpperCase()}
                    </span>
                    <span
                      className="px-3 py-1 rounded text-sm font-medium"
                      style={{ backgroundColor: getPriorityColor(ticket.priority) + '20', color: getPriorityColor(ticket.priority) }}
                    >
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                {ticket.assigned_to_name && (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Assigned to: {ticket.assigned_to_name}
                  </p>
                )}
              </div>

              {/* Messages */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                  Messages ({ticket.messages?.length || 0})
                </h2>
                <div className="space-y-4">
                  {ticket.messages && ticket.messages.length > 0 ? (
                    ticket.messages.map((message) => (
                      <div
                        key={message.id}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--text-color)' }}>
                              {message.user_name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {new Date(message.create_date).toLocaleString()}
                            </p>
                          </div>
                          {message.is_internal && (
                            <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                              Internal
                            </span>
                          )}
                        </div>
                        <div
                          className="mt-2 whitespace-pre-wrap"
                          style={{ color: 'var(--text-color)' }}
                        >
                          {message.message}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      No messages yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              {ticket.state !== 'closed' && (
                <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    Add Reply
                  </h2>
                  <form onSubmit={handleSubmitReply}>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={6}
                      required
                      className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300 mb-4"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                      }}
                      placeholder="Type your reply here..."
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingReply || !replyMessage.trim()}
                      className="px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                    >
                      {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                    </button>
                  </form>
                </div>
              )}

              {ticket.state === 'closed' && (
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--background-secondary)' }}>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    This ticket is closed. You cannot add new replies.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;

