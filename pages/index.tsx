import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function App() {
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [mode, setMode] = useState('trending');
  const [markers, setMarkers] = useState({ trending: [], essentials: [], routes: [] });
  const [lang, setLang] = useState('en');

  // 번역 함수 (Google Translate API 예시)
  const translate = async (text) => {
    try {
      const res = await axios.post('https://translation.googleapis.com/language/translate/v2', {
        q: text,
        target: lang,
        format: 'text',
        key: 'YOUR_GOOGLE_TRANSLATE_API_KEY'
      });
      return res.data.data.translations[0].translatedText;
    } catch (err) {
      return text;
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    // 모드별 장소 불러오기 (예시 API 주소)
    const fetchData = async () => {
      const trending = await axios.get('/api/trending');
      const essentials = await axios.get('/api/essentials');
      const routes = await axios.get('/api/routes');
      setMarkers({ trending: trending.data, essentials: essentials.data, routes: routes.data });
    };
    fetchData();

    // 브라우저 언어 자동 감지
    const userLang = navigator.language.split('-')[0];
    setLang(userLang);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-around p-2 shadow bg-white z-10">
        <Button onClick={() => setMode('trending')} variant={mode === 'trending' ? 'default' : 'outline'}>🔥 지금 인기</Button>
        <Button onClick={() => setMode('essentials')} variant={mode === 'essentials' ? 'default' : 'outline'}>🧻 필수 장소</Button>
        <Button onClick={() => setMode('routes')} variant={mode === 'routes' ? 'default' : 'outline'}>🎯 추천 루트</Button>
      </div>
      <MapContainer center={[location.lat, location.lng]} zoom={15} className="flex-1 z-0">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers[mode].map((m, idx) => (
          <Marker key={idx} position={[m.lat, m.lng]}>
            <Popup>
              <strong>{m.name}</strong><br />
              {m.tags && m.tags.map((tag, i) => <span key={i}>{tag} </span>)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <Card className="w-full rounded-none">
        <CardContent className="text-center p-2 text-sm">
          {mode === 'trending' && (lang === 'ko' ? '인스타그램 해시태그 기반 지금 뜨는 장소들!' : 'Trending places based on Instagram!')}
          {mode === 'essentials' && (lang === 'ko' ? '당장 필요한 장소 (화장실, 편의점 등)를 찾을 수 있어요.' : 'Find essentials like toilets and convenience stores.')}
          {mode === 'routes' && (lang === 'ko' ? '여행 루트로 코스 따라가기!' : 'Follow suggested travel routes!')}
        </CardContent>
      </Card>
    </div>
  );
}
