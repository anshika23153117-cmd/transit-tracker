// src/components/Sidebar.jsx
import React from 'react';

function Sidebar({ 
  displayQuery, 
  setDisplayQuery, 
  isDemo, 
  setIsDemo, 
  planesCount, 
  loading, 
  lastUpdated, 
  fetchPlanes,
  showNoPlanesError 
}) {
  return (
    <div style={{
      position: 'absolute', top: '20px', left: '20px', zIndex: 1000,
      background: 'white', padding: '20px', borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)', minWidth: '200px',
      fontFamily: 'sans-serif'
    }}>
      <input
        type="text"
        placeholder="🔍 Search Flight (e.g. IGO)"
        value={displayQuery}
        onChange={(e) => setDisplayQuery(e.target.value)}
        style={{
          width: '100%', padding: '8px', marginBottom: '15px',
          borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '12px', height: '12px', borderRadius: '50%',
          backgroundColor: isDemo ? '#f1c40f' : '#2ecc71',
          boxShadow: `0 0 8px ${isDemo ? '#f1c40f' : '#2ecc71'}`
        }}></div>
        <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>
          {isDemo ? "Demo Mode" : "Live Tracker"}
        </span>
      </div>

      <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
        Planes found: <b>{planesCount}</b>
      </div>

      {showNoPlanesError && (
        <p style={{
          color: 'red', fontSize: '12px', backgroundColor: '#fdeaea',
          padding: '8px', borderRadius: '4px', marginTop: '10px',
          border: '1px solid #fab1a0'
        }}>
          ⚠️ No live planes found. Check your API key or connection.
        </p>
      )}
      
      {lastUpdated && (
        <div style={{ fontSize: '11px', color: '#bdc3c7', marginTop: '4px' }}>
          Last update: {lastUpdated}
        </div>
      )}

      <hr style={{ border: '0.5px solid #eee', margin: '15px 0' }} />
      
      <button 
        onClick={() => fetchPlanes(false)} 
        disabled={loading}
        style={{ width: '100%', backgroundColor: '#2ecc71', color: 'white', marginBottom: '5px', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
      >
        {loading ? "loading..." : "🔄 Load from DB (Free)"}
      </button>

      <button 
        onClick={() => fetchPlanes(true)} 
        disabled={loading}
        style={{ 
          width: '100%', padding: '10px', cursor: 'pointer',
          backgroundColor: '#3498db', color: 'white', border: 'none',
          borderRadius: '6px', fontWeight: 'bold'
        }}
      >
        {loading ? "⌛ Fetching..." : "📡 Live API Sync (Uses Credit)"}
      </button>

      <button 
        onClick={() => setIsDemo(!isDemo)} 
        style={{ 
          marginTop: '10px', width: '100%', background: 'none', border: '1px solid #ddd',
          padding: '5px', borderRadius: '4px', fontSize: '11px', color: '#95a5a6', cursor: 'pointer'
        }}
      >
        {isDemo ? "Switch to Live (API)" : "Switch to Demo Data"}
      </button>
    </div>
  );
}

export default Sidebar;