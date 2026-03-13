import { useState, useEffect, useCallback } from 'react';

export const useFlightData = (isDemo, displayQuery) => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlanes = useCallback(async (isLive = false) => {
    setLoading(true);
    const now = new Date().toLocaleTimeString();

    if (isDemo) {
      setPlanes([
        { id: 'f1', callsign: 'DEMO123', lat: 28.6139, lon: 77.2090, alt: '30,000 ft', speed: '800 km/h', dir: 45, lastSeen: new Date() }
      ]);
      setLastUpdated(now);
      setLoading(false);
      return;
    }

    const endpoint = isLive ? '/' : '/cache';
    try {
      const API_BASE_URL= import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/flights${endpoint}`);
      const data = await response.json();
      if (data && data.response) {
        setPlanes(data.response.map(f => ({
          id: f.flight_hex || f.hex || Math.random().toString(),
          callsign: f.flight_icao || f.flight_number || "Unknown",
          lat: f.lat, lon: f.lng,
          alt: f.alt ? `${f.alt} m` : "N/A",
          speed: f.speed ? `${f.speed} km/h` : "0",
          dir: f.dir || 0,
          history: f.history || [],
          lastSeen: f.updated_at
        })));
        setLastUpdated(now);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [isDemo]);

  useEffect(() => {
    if (!displayQuery || displayQuery.trim() === "") {
      setSearchQuery("");
      return; // FIXED: No more return ""
    }
    const handler = setTimeout(() => setSearchQuery(displayQuery), 500);
    return () => clearTimeout(handler);
  }, [displayQuery]);

  useEffect(() => { fetchPlanes(); }, [fetchPlanes]);

  const filteredPlanes = planes.filter(p => {
    if (!searchQuery) return true;
    return (p.callsign || "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  return { filteredPlanes, loading, lastUpdated, fetchPlanes, planes };
};