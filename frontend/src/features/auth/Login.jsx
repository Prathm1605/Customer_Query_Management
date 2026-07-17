import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext.jsx";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard'); // Redirect on success
    } catch (err) {
      setError(err.response?.data?.message || (isRegistering ? 'Registration failed' : 'Login failed'));
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-page-container">
      {/* Left Form Area */}
      <div className="login-left">
        <div className="login-form-container">
          <div className="login-header">
            <h2 className="login-title">{isRegistering ? 'Create an Account' : 'System Login'}</h2>
            <p className="login-subtitle">Customer Query Management Portal</p>
          </div>
          
          {error && (
            <div className="error-banner">
              <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="name@company.com"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder={isRegistering ? "Create a password" : "Enter your password"}
                className="form-input"
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
            >
              <span className="button-text">{isRegistering ? 'Sign Up' : 'Sign In'}</span>
            </button>
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={toggleMode} 
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
              >
                {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
            
            <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#334155' }}>Test Credentials (Auto-fill):</p>
              
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: '500', color: '#475569' }}>Customer:</span> test@example.com
                </div>
                <button 
                  type="button"
                  onClick={() => { setEmail('test@example.com'); setPassword('password123'); setIsRegistering(false); }}
                  style={{ background: '#e0e7ff', border: 'none', padding: '4px 8px', borderRadius: '4px', color: '#4338ca', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                >
                  Use
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: '500', color: '#475569' }}>Admin:</span> Adi@gmail.com
                </div>
                <button 
                  type="button"
                  onClick={() => { setEmail('Adi@gmail.com'); setPassword('Adi'); setIsRegistering(false); }}
                  style={{ background: '#fce7f3', border: 'none', padding: '4px 8px', borderRadius: '4px', color: '#be185d', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                >
                  Use
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Hero / Branding Area */}
      <div className="login-right">
        {/* Abstract shapes for tech-themed background */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        
        <div className="login-right-content">
          <h3 className="login-right-title">Resolve Queries Faster</h3>
          <p className="login-right-text">
           Organize, monitor, and manage customer requests from one centralized dashboard to ensure timely resolutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;