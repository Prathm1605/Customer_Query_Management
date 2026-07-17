import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import QueryModal from '../../shared/QueryModal';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [queries, setQueries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [activeTab, setActiveTab] = useState(user?.role === 'Admin' ? 'dashboard' : 'queries');
  const [queryToEdit, setQueryToEdit] = useState(null);

  const fetchQueries = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (categoryFilter) params.category = categoryFilter;

      const { data } = await api.get('/queries', { params });
      setQueries(data.queries || []);
    } catch (err) { console.error("Fetch error:", err); }
  }, [search, statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchQueries();
    }, 300); // Add a small delay so typing doesn't spam backend
    return () => clearTimeout(delayDebounceFn);
  }, [fetchQueries]);

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
  };

  const openEditModal = (query) => {
    setQueryToEdit(query);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setQueryToEdit(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        await api.patch(`/queries/${id}/delete`);
        fetchQueries(); // refresh list
      } catch (err) {
        console.error('Delete failed:', err);
        alert(err.response?.data?.message || 'Failed to delete query');
      }
    }
  };

  // Badges Styles
  const badgeStyle = (type, value) => {
    const base = { padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'inline-block', textAlign: 'center', minWidth: '80px' };
    
    if (type === 'Status') {
      if (value === 'Resolved') return { ...base, backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
      if (value === 'In Progress') return { ...base, backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fef08a' };
      return { ...base, backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }; // Open
    }
    if (type === 'Priority') {
      if (value === 'Urgent') return { ...base, backgroundColor: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8' };
      if (value === 'High') return { ...base, backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' };
      if (value === 'Medium') return { ...base, backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' };
      return { ...base, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }; // Low
    }
    if (type === 'Category') {
      return { ...base, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
    }
    return base;
  };

  const navItemStyle = (isActive) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive ? '#1e293b' : 'transparent',
    color: isActive ? '#ffffff' : '#94a3b8',
    cursor: 'pointer',
    marginBottom: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  });

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand"><h2> {user?.role}</h2></div>
        <nav className="sidebar-nav" style={{ padding: '0 16px' }}>
          <button 
            style={navItemStyle(activeTab === 'dashboard')} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          
          {user?.role === 'Customer' && (
            <button 
              style={navItemStyle(false)} 
              onClick={() => setIsModalOpen(true)}
            >
              + Create Query
            </button>
          )}
          
          {user?.role === 'Admin' && (
            <button 
              style={navItemStyle(activeTab === 'queries')} 
              onClick={() => setActiveTab('queries')}
            >
              Manage Queries
            </button>
          )}
        </nav>
        <div className="sidebar-footer" style={{ padding: '16px' }}>
          <button onClick={logout} className="logout-btn" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>↪</span> Logout
          </button>
        </div>
      </aside>

      <main className="main-content" style={{ backgroundColor: '#f8fafc', padding: '32px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Admin KPI Dashboard */}
        {activeTab === 'dashboard' && user?.role === 'Admin' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h1 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '1.75rem' }}>Welcome, {user?.name}</h1>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, minWidth: '200px' }}>
                <h3 style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Queries</h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{queries.length}</p>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, minWidth: '200px', borderBottom: '4px solid #ef4444' }}>
                <h3 style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open</h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{queries.filter(q => q.status === 'Open').length}</p>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, minWidth: '200px', borderBottom: '4px solid #eab308' }}>
                <h3 style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{queries.filter(q => q.status === 'In Progress').length}</p>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, minWidth: '200px', borderBottom: '4px solid #22c55e' }}>
                <h3 style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resolved</h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{queries.filter(q => q.status === 'Resolved').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Queries Table View (Always Visible) */}
        <div style={{ animation: 'fadeIn 0.3s ease-in-out', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {user?.role === 'Customer' && <h1 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '1.75rem' }}>Welcome, {user?.name}</h1>}
          
          {/* Filter Bar (Only for Admin to match screenshot) */}
          {user?.role === 'Admin' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search name, email, subject..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px 12px 12px 48px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', backgroundColor: 'white', cursor: 'pointer', minWidth: '140px' }}>
                  <option value="">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', backgroundColor: 'white', cursor: 'pointer', minWidth: '140px' }}>
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', backgroundColor: 'white', cursor: 'pointer', minWidth: '140px' }}>
                  <option value="">All Categories</option>
                  <option value="Billing">Billing</option>
                  <option value="Technical">Technical</option>
                  <option value="General">General</option>
                  <option value="Account">Account</option>
                </select>
                <button onClick={handleReset} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#475569', fontWeight: '500' }}>
                  🔄 Reset
                </button>
              </div>
            </div>
          )}

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '0', flex: 1, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  {user?.role === 'Admin' && <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>CUSTOMER</th>}
                  {user?.role === 'Admin' && <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>EMAIL</th>}
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>SUBJECT</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>CATEGORY</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>PRIORITY</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>STATUS</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>CREATED AT</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q) => (
                  <tr key={q._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {user?.role === 'Admin' && <td style={{ padding: '20px 24px', fontWeight: '600', color: '#0f172a' }}>{q.createdBy?.name || 'Unknown'}</td>}
                    {user?.role === 'Admin' && <td style={{ padding: '20px 24px', color: '#64748b', fontSize: '0.9rem' }}>{q.createdBy?.email || 'Unknown'}</td>}
                    <td style={{ padding: '20px 24px', color: '#334155', fontWeight: '500' }}>{q.title}</td>
                    <td style={{ padding: '20px 24px' }}><span style={badgeStyle('Category', q.category || 'General')}>{q.category || 'General'}</span></td>
                    <td style={{ padding: '20px 24px' }}><span style={badgeStyle('Priority', q.priority)}>{q.priority}</span></td>
                    <td style={{ padding: '20px 24px' }}><span style={badgeStyle('Status', q.status)}>{q.status}</span></td>
                    <td style={{ padding: '20px 24px', color: '#64748b', fontSize: '0.9rem' }}>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/queries/${q._id}`)} 
                        style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="View Query"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        👁️
                      </button>
                      {/* Edit Option for both Customer and Admin */}
                      <button 
                        onClick={() => openEditModal(q)} 
                        style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={user?.role === 'Admin' ? "Update Status" : "Edit Query"}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        ✏️
                      </button>
                      
                      {/* Admin Delete Option */}
                      {user?.role === 'Admin' && (
                        <button 
                          onClick={() => handleDelete(q._id)} 
                          style={{ background: 'transparent', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#ef4444', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete Query"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {queries.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '64px 32px', textAlign: 'center', color: '#94a3b8', fontSize: '1.1rem' }}>No queries found matching your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <QueryModal isOpen={isModalOpen} onClose={handleCloseModal} onQueryCreated={fetchQueries} queryToEdit={queryToEdit} isAdmin={user?.role === 'Admin'} />
    </div>
  );
};

export default Dashboard;