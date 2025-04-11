export default function handler(req, res) {
  res.status(200).json([
    { lat: 37.5721, lng: 126.9768, name: '오전 루트: 경복궁 - 북촌 - 익선동' }
  ]);
}