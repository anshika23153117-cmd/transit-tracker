// src/components/FlightMarker.jsx
import React from 'react';
import { Marker, Popup, Tooltip ,Polyline} from 'react-leaflet';

function FlightMarker({ plane, isFollowed, setFollowedPlaneId, airplaneIcon }) {
  if (!plane.lat || !plane.lon) return null;
  //helper function to calculate time difference
  const getTimeAgo =(timestamp) =>{
    if(!timestamp)return "unknown";
    const diffInSeconds = Math.floor((new Date() -new Date(timestamp))/1000);

    if(diffInSeconds < 60)return "just now";
    const minutes= Math.floor(diffInSeconds/60);
    return `${minutes} min${minutes >1? 's':''} ago`;
  };
  
    // Extract coordinates from history for the line
  // The history array in your model contains {lat, lng} objects
  const pathPositions = plane.history? plane.history.map(pos =>[pos.lat,pos.lng]) : [];
  // Add current position to the end of the path
  const fullPath = [...pathPositions,[plane.lat,plane.lon]];
  

  return (
  <>
      {/* Draw the tail/history line */}
      {fullPath.length > 1 && (
        <Polyline 
          positions={fullPath} 
          pathOptions={{ 
            color: 'grey', 
            weight: 3,
            opacity: 0.3,
            dashArray: '5, 10' 
          }} 
        />
      )}
    <Marker 
      position={[plane.lat, plane.lon]} 
      icon={airplaneIcon(plane.dir)} 
      eventHandlers={{ click: () => setFollowedPlaneId(plane.id) }}
    >
      <Tooltip sticky><b>{plane.callsign}</b></Tooltip>
      <Popup>
        <div style={{ minWidth: '140px', fontFamily: 'sans-serif' }}>
          <strong style={{ fontSize: '16px', color: '#2980b9' }}>{plane.callsign}</strong>
          <hr style={{ margin: '8px 0', border: '0.5px solid #eee' }} />
            {/* Plane Details*/}
          Altitude: <b>{plane.alt}</b><br />
          Speed: <b>{plane.speed}</b><br />
          Heading: <b>{plane.dir}°</b>

            {/* New Staleness Indicator */}
            <div style={{
                fontSize: '11px', 
                color: '#e67e22', 
                marginTop: '5px',
                fontStyle: 'italic'
            }}>
            🕒 Last seen: {getTimeAgo(plane.lastSeen)} 
            </div>



          
          <button
            onClick={(e) => {
              e.stopPropagation(); //prevent map click events
              setFollowedPlaneId(isFollowed ? null : plane.id);
            }}
            style={{
              marginTop: '10px', width: '100%', padding: '6px', 
              borderRadius: '4px', border: 'none', cursor: 'pointer',
              fontWeight: 'bold', backgroundColor: isFollowed ? '#e74c3c' : '#2ecc71',
              color: 'white'
            }}
          > 
            {isFollowed ? "❌ Unfollow" : "🛰️ Follow Flight"}
          </button>
        </div>
      </Popup>
    </Marker>
    </>
  );
}

export default FlightMarker;