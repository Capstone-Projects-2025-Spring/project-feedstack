import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ParticipantLogin() {
  const [participantId, setParticipantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // First test API connectivity
  const testApi = async () => {
    try {
      const response = await fetch('https://project-feedstack.onrender.com/api/test/');
      const data = await response.json();
      console.log('Test API response:', data);
    } catch (error) {
      console.error('Test API error:', error);
    }
  };

  // Call the test API on component mount
  React.useEffect(() => {
    testApi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!participantId.trim()) {
      alert('Please enter a Participant ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Direct URL approach
      const response = await fetch('https://project-feedstack.onrender.com/api/participant/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participant_id: participantId })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Even if we can't parse JSON, still try to proceed
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (err) {
        console.log('Could not parse JSON, but continuing');
      }
      
      // Just proceed anyway - we mainly need the participant ID
      navigate('/upload', { state: { participantId, docId: 'temp-doc-id' } });
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="participant-login">
      <div className="login-card">
        <h1>Welcome to Feedstack</h1>
        <p>Enter your Participant ID to get started with AI-powered design feedback.</p>
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
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