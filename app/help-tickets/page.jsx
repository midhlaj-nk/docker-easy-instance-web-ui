'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuthStore, useInstancesStore } from '@/lib/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

function HelpTicketsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterState, setFilterState] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total_count: 0, total_pages: 1 });
  
  const { token } = useAuthStore();
  const { instances, selectedInstance } = useInstancesStore();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchTickets = async (page = 1, state = 'all') => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/help-tickets?page=${page}&limit=20&state=${state}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tickets');
      }

      if (data.data) {
        setTickets(data.data.tickets || []);
        setPagination(data.data.pagination || {});
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTickets(1, filterState);
    }
  }, [token, filterState]);

  const handleCreateTicket = () => {
    setShowCreateModal(true);
  };

  const handleViewTicket = (ticketId) => {
    router.push(`/help-tickets/${ticketId}`);
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'open':
        return '#3b82f6'; // blue
      case 'closed':
        return '#6b7280'; // gray
      case 'draft':
        return '#f59e0b'; // amber
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444'; // red
      case 'high':
        return '#f59e0b'; // amber
      case 'medium':
        return '#3b82f6'; // blue
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280';
    }
  };

  return (
    <div>
      <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex mt-16">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 lg:pl-[17rem] lg:h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                  Help Tickets
                </h1>
                <button
                  onClick={handleCreateTicket}
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                >
                  Create Ticket
                </button>
              </div>

              {/* Filters */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setFilterState('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterState === 'all' ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor: filterState === 'all' ? 'var(--primary-color)' : 'var(--background-secondary)',
                    color: filterState === 'all' ? '#ffffff' : 'var(--text-color)',
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterState('open')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterState === 'open' ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor: filterState === 'open' ? '#3b82f6' : 'var(--background-secondary)',
                    color: filterState === 'open' ? '#ffffff' : 'var(--text-color)',
                  }}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilterState('closed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterState === 'closed' ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor: filterState === 'closed' ? '#6b7280' : 'var(--background-secondary)',
                    color: filterState === 'closed' ? '#ffffff' : 'var(--text-color)',
                  }}
                >
                  Closed
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Tickets List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <p style={{ color: 'var(--text-secondary)' }}>Loading tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <p style={{ color: 'var(--text-secondary)' }}>No tickets found. Create your first ticket!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleViewTicket(ticket.id)}
                      className="p-6 rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90"
                      style={{ backgroundColor: 'var(--background-secondary)', boxShadow: 'var(--card-shadow)' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                              {ticket.subject}
                            </h3>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{ backgroundColor: getStateColor(ticket.state) + '20', color: getStateColor(ticket.state) }}
                            >
                              {ticket.state.toUpperCase()}
                            </span>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{ backgroundColor: getPriorityColor(ticket.priority) + '20', color: getPriorityColor(ticket.priority) }}
                            >
                              {ticket.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                            {ticket.name} {ticket.instance_name ? `• ${ticket.instance_name}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                            {ticket.message_count} {ticket.message_count === 1 ? 'message' : 'messages'}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(ticket.create_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => fetchTickets(pagination.page - 1, filterState)}
                    disabled={!pagination.has_prev}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-color)' }}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => fetchTickets(pagination.page + 1, filterState)}
                    disabled={!pagination.has_next}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-color)' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal
          selectedInstance={selectedInstance}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTickets(1, filterState);
          }}
        />
      )}
    </div>
  );
}

function CreateTicketModal({ selectedInstance, onClose, onSuccess }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Subject and description are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/help-tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject.trim(),
          description: description.trim(),
          priority,
          instance_id: selectedInstance?.id || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create ticket');
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
      console.error('Error creating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
          Create Support Ticket
        </h2>

        {error && (
          <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-color)20', color: 'var(--error-color)' }}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
              style={{
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }}
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
              style={{
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }}
              placeholder="Please provide detailed information about your issue..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none transition-colors duration-300"
              style={{
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>


          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300"
              style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HelpTicketsPage;

