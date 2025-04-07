import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ParticipantLogin() {
  const [participantId, setParticipantId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!participantId.trim()) {
      alert('Please enter a Participant ID');
      return;
    }
    
    setLoading(true);
    
    // BYPASS SERVER - Simply navigate to the next page with the participant ID
    console.log('Bypassing server participant creation');
    
    // Add a small delay to simulate API call
    setTimeout(() => {
      navigate('/upload', { 
        state: { 
          participantId, 
          docId: 'temp-doc-id' 
        } 
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="participant-login">
      <div className="login-card">
        <h1>Welcome to Feedstack</h1>
        <p>Enter your Participant ID to get started with AI-powered design feedback.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            placeholder="Enter Participant ID"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Start'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ParticipantLogin;