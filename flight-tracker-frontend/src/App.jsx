import { useState,useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import our custom logic and components
import { useFlightData } from './hooks/useFlightData';
import Sidebar from './components/Sidebar';
import FlightMarker from './components/FlightMarker';

// Airplane Icon logic
const airplaneIcon = (rotation) => new L.DivIcon({
  html: `<div style="transform: rotate(${(rotation || 0) - 45}deg); font-size: 24px; cursor: pointer;">✈️</div>`,
  className: 'custom-airplane-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Map Controller for smooth following logic
function MapController({ targetPos, setFollowedPlaneId }) {
  const map = useMap();
  
  

  useEffect(() => {
    const stopfollowing = () => setFollowedPlaneId(null);
    map.on('dragstart', stopfollowing);
    return () => map.off('dragstart', stopfollowing);
  }, [map, setFollowedPlaneId]);

  useEffect(() => {
    if (targetPos) {
      map.setView(targetPos, 8, { animate: true });
    }
  }, [targetPos, map]);
  
  return null;
}

function App() {
  const [isDemo, setIsDemo] = useState(false);
  const [displayQuery, setDisplayQuery] = useState(""); 
  const [followedPlaneId, setFollowedPlaneId] = useState(null);

  // All API fetching, caching, and searching logic is now here
  const { filteredPlanes, loading, lastUpdated, fetchPlanes, planes } = useFlightData(isDemo, displayQuery);

  // Find the currently followed plane object
  const followed = planes.find(p => p.id === followedPlaneId);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', fontFamily: 'sans-serif' }}>
      
      <Sidebar 
        displayQuery={displayQuery} 
        setDisplayQuery={setDisplayQuery}
        isDemo={isDemo} 
        setIsDemo={setIsDemo}
        planesCount={filteredPlanes.length}
        loading={loading} 
        lastUpdated={lastUpdated}
        fetchPlanes={fetchPlanes}
        showNoPlanesError={filteredPlanes.length === 0 && !loading && !isDemo && displayQuery.length > 0}
      />

      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Handles auto-centering when following a flight */}
        {followed && (
          <MapController 
            targetPos={[followed.lat, followed.lon]} 
            setFollowedPlaneId={setFollowedPlaneId} 
          />
        )}
        
        {/* Render individual markers using the new FlightMarker component */}
        {filteredPlanes.map((p) => (
          <FlightMarker 
            key={p.id} 
            plane={p} 
            isFollowed={followedPlaneId === p.id}
            setFollowedPlaneId={setFollowedPlaneId}
            airplaneIcon={airplaneIcon}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;