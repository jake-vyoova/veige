import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

export default function App() {
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [mode, setMode] = useState('trending');
  const [markers, setMarkers] = useState({ trending: [], essentials: [], routes: [] });
  const [lang, setLang] = useState('en');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    const fetchData = async () => {
      const trending = await axios.get('/api/trending');
      const essentials = await axios.get('/api/essentials');
      const routes = await axios.get('/api/routes');
      setMarkers({ trending: trending.data, essentials: essentials.data, routes: routes.data });
    };
    fetchData();

    const userLang = navigator.language.split('-')[0];
    setLang(userLang);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-around p-2 shadow bg-white z-10">
        <Button onClick={() => setMode('trending')}>🔥 지금 인기</Button>
        <Button onClick={() => setMode('essentials')}>🧻 필수 장소</Button>
        <Button onClick={() => setMode('routes')}>🎯 추천 루트</Button>
      </div>
      <MapContainer center={[location.lat, location.lng]} zoom={15} className="flex-1 z-0">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers[mode].map((m, idx) => (
          <Marker key={idx} position={[m.lat, m.lng]}>
            <Popup><strong>{m.name}</strong></Popup>
          </Marker>
        ))}
      </MapContainer>
      <Card className="w-full rounded-none">
        <CardContent className="text-center p-2 text-sm">
          {mode === 'trending' && (lang === 'ko' ? '지금 뜨는 장소들!' : 'Trending places!')}
          {mode === 'essentials' && (lang === 'ko' ? '화장실, 편의점 등 필수 장소' : 'Essentials like toilets and stores')}
          {mode === 'routes' && (lang === 'ko' ? '추천 여행 루트' : 'Suggested travel routes')}
        </CardContent>
      </Card>
    </div>
  );
}