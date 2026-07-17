import { useState, useEffect } from 'react';
import api from '../utils/api';

const QueryModal = ({ isOpen, onClose, onQueryCreated, queryToEdit, isAdmin }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState('Open');

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setCategory('General');
    setStatus('Open');
  };

  useEffect(() => {
    if (queryToEdit) {
      setTitle(queryToEdit.title || '');
      setDescription(queryToEdit.description || '');
      setPriority(queryToEdit.priority || 'Medium');
      setCategory(queryToEdit.category || 'General');
      setStatus(queryToEdit.status || 'Open');
    } else {
      handleClear();
    }
  }, [queryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (queryToEdit) {
        const payload = isAdmin ? { status } : { title, description, priority, category };
        await api.put(`/queries/${queryToEdit._id}`, payload);
      } else {
        await api.post('/queries', { title, description, priority, category });
      }
      onQueryCreated();
      onClose();
      handleClear();
    } catch (err) {
      console.error('Failed to save query', err);
      alert(err.response?.data?.message || 'Failed to save query');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '2rem', borderRadius: '12px',
        width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', marginTop: 0 }}>
          {queryToEdit ? (isAdmin ? 'Update Status' : 'Edit Query') : 'Create New Query'}
        </h2>
        <form onSubmit={handleSubmit}>
          
          {isAdmin ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1rem' }}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Subject</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1rem' }} 
                  placeholder="Brief summary of your issue"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1rem' }} 
                  rows={4} 
                  placeholder="Detailed description of your issue..."
                />
              </div>
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1rem' }}
                  >
                    <option value="Billing">Billing</option>
                    <option value="Technical">Technical</option>
                    <option value="General">General</option>
                    <option value="Account">Account</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Priority</label>
                  <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1rem' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            {!queryToEdit && (
              <button 
                type="button" 
                onClick={handleClear} 
                style={{ padding: '0.6rem 1.2rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              >
                Clear Form
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="primary-btn"
            >
              {queryToEdit ? 'Save Changes' : 'Submit Query'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QueryModal;
