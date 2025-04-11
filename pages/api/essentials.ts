export default function handler(req, res) {
  res.status(200).json([
    { lat: 37.5660, lng: 126.9784, name: '공공화장실', type: 'toilet' },
    { lat: 37.5655, lng: 126.9775, name: '편의점', type: 'store' }
  ]);
}