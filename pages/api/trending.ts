export default function handler(req, res) {
  res.status(200).json([
    { lat: 37.5796, lng: 126.9770, name: '북촌 감성카페', tags: ['#감성카페', '#성수핫플'] },
    { lat: 37.5702, lng: 126.9920, name: '익선동 골목길', tags: ['#한옥스타그램'] }
  ]);
}