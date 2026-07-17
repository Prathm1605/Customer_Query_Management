import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext.jsx';

const QueryDetails = () => {
  const { id } = useParams();
  const [query, setQuery] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get(`/queries/${id}`).then(res => setQuery(res.data));
  }, [id]);

  const updateStatus = async (status) => {
    try {
      await api.put(`/queries/${id}`, { status });
      const res = await api.get(`/queries/${id}`);
      setQuery(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (!query) return <div style={{ padding: '2rem' }}>Loading...</div>;

  const isAdmin = user?.role === 'Admin';

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    marginBottom: '24px'
  };

  const labelStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: '0.05em',
    marginBottom: '12px',
    display: 'block'
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9'
  };

  const rowLabelStyle = {
    color: '#475569',
    fontSize: '0.9rem',
    fontWeight: '500'
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '32px', fontFamily: '"Inter", "Roboto", sans-serif' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
          ← Back to Queries
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#0f172a', fontWeight: 'bold' }}>Query Details</h1>
            <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Ticket ref: #{query._id}</p>
          </div>
          {isAdmin && (
            <button style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              ✏️ Edit
            </button>
          )}
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          
          {/* Left Column */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column' }}>
            <div style={cardStyle}>
              <span style={labelStyle}>Customer Context</span>
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                    👤
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Customer Name</div>
                    <div style={{ fontWeight: '500', color: '#0f172a' }}>{query.createdBy?.name || 'Unknown'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                    ✉️
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Email Address</div>
                    <div style={{ fontWeight: '500', color: '#2563eb' }}>{query.createdBy?.email || 'Unknown'}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <span style={labelStyle}>Subject</span>
                <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '600', margin: '8px 0' }}>{query.title}</h2>
              </div>

              <div style={{ marginTop: '32px' }}>
                <span style={labelStyle}>Description</span>
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: '1.6', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
                  {query.description}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
            <div style={cardStyle}>
              <span style={labelStyle}>Ticket Details</span>
              
              <div style={rowStyle}>
                <span style={rowLabelStyle}>Category</span>
                <span style={{ backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', color: '#334155' }}>
                  {query.category || 'General'}
                </span>
              </div>
              
              <div style={rowStyle}>
                <span style={rowLabelStyle}>Priority</span>
                <span style={{ backgroundColor: query.priority === 'High' ? '#fee2e2' : query.priority === 'Medium' ? '#fef3c7' : '#dcfce7', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', color: query.priority === 'High' ? '#991b1b' : query.priority === 'Medium' ? '#92400e' : '#166534' }}>
                  {query.priority}
                </span>
              </div>

              <div style={rowStyle}>
                <span style={rowLabelStyle}>Status</span>
                {isAdmin ? (
                  <select 
                    value={query.status} 
                    onChange={(e) => updateStatus(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer', backgroundColor: '#f8fafc' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                ) : (
                  <span style={{ backgroundColor: query.status === 'Resolved' ? '#dcfce7' : query.status === 'In Progress' ? '#dbeafe' : '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', color: query.status === 'Resolved' ? '#166534' : query.status === 'In Progress' ? '#1e40af' : '#475569' }}>
                    {query.status}
                  </span>
                )}
              </div>

              <div style={rowStyle}>
                <span style={{...rowLabelStyle, display: 'flex', gap: '8px', alignItems: 'center'}}><span style={{fontSize:'1.1rem'}}>📅</span> Created At</span>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  {new Date(query.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{...rowStyle, borderBottom: 'none'}}>
                <span style={{...rowLabelStyle, display: 'flex', gap: '8px', alignItems: 'center'}}><span style={{fontSize:'1.1rem'}}>🕒</span> Last Updated</span>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  {new Date(query.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div style={cardStyle}>
              <span style={labelStyle}>Audit Information</span>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Created By</div>
                <div style={{ fontSize: '0.9rem', color: '#0f172a', fontStyle: 'italic' }}>System generated</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Last Updated By</div>
                <div style={{ fontSize: '0.9rem', color: '#0f172a', fontStyle: 'italic' }}>{isAdmin ? 'Admin' : 'System generated'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QueryDetails;