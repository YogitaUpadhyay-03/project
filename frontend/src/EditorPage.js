import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// 🔒 Backend URL (Windows safe)
const API_BASE = 'http://127.0.0.1:5000';

// 🔒 Paste your document ID here
const DOC_ID = '69803f45d9a94b8504e5b3c4';

// Socket connection
const socket = io(API_BASE, {
  transports: ['websocket'],
  reconnectionAttempts: 5
});

function EditorPage() {
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Join document room
  useEffect(() => {
    socket.emit('join-document', DOC_ID);
  }, []);

  // Fetch branches safely
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/documents/branches/${DOC_ID}`);
        if (!res.ok) throw new Error('Backend not reachable');

        const data = await res.json();
        setBranches(data);

        if (data.length > 0) {
          setCurrentBranch(data[0].name);
          setContent(data[0].content || '');
        }
      } catch (err) {
        console.error(err);
        setError('⚠️ Backend not reachable. Is server running?');
      }
    };

    fetchBranches();
  }, []);

  // Listen for realtime edits
  useEffect(() => {
    socket.on('receive-edit', (newContent) => {
      setContent(newContent);
    });

    return () => socket.off('receive-edit');
  }, []);

  // Handle editor change
  const handleChange = async (e) => {
    const newText = e.target.value;
    setContent(newText);

    // Realtime broadcast
    socket.emit('edit-document', {
      docId: DOC_ID,
      content: newText
    });

    // Save to backend (safe)
    try {
      await fetch(`${API_BASE}/api/documents/update-branch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId: DOC_ID,
          branchName: currentBranch,
          content: newText
        })
      });
    } catch (err) {
      console.warn('Save failed (offline?)');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial' }}>
      
      {/* 🌿 Sidebar */}
      <div style={{
        width: '220px',
        borderRight: '1px solid #ccc',
        padding: '12px'
      }}>
        <h3>Branches</h3>

        {branches.map(branch => (
          <div
            key={branch.name}
            onClick={() => {
              setCurrentBranch(branch.name);
              setContent(branch.content || '');
            }}
            style={{
              padding: '6px',
              marginBottom: '6px',
              cursor: 'pointer',
              background:
                branch.name === currentBranch ? '#e6f0ff' : '#fff'
            }}
          >
            🌿 {branch.name}
          </div>
        ))}

        {error && (
          <div style={{ color: 'red', marginTop: '10px', fontSize: '12px' }}>
            {error}
          </div>
        )}
      </div>

      {/* ✍️ Editor */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>
          Editing branch: <span style={{ color: 'blue' }}>{currentBranch || '—'}</span>
        </h2>

        <textarea
          rows="20"
          cols="100"
          value={content}
          onChange={handleChange}
          placeholder="Start typing..."
          style={{ width: '100%', fontSize: '14px' }}
        />
      </div>
    </div>
  );
}

export default EditorPage;
