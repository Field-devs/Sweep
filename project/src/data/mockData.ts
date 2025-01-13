import { Waypoint, RouteStretch } from '../types/routes';

// São Paulo addresses with coordinates
export const SP_ADDRESSES = [
  { lat: -23.5614, lng: -46.6565, description: "Av. Paulista, 1578" },
  { lat: -23.5575, lng: -46.6608, description: "Rua Augusta, 2026" },
  { lat: -23.5620, lng: -46.6695, description: "Rua Oscar Freire, 725" },
  { lat: -23.5868, lng: -46.6847, description: "Av. Brigadeiro Faria Lima, 2232" },
  { lat: -23.5656, lng: -46.6907, description: "Rua dos Pinheiros, 1037" },
  { lat: -23.5738, lng: -46.6825, description: "Av. Rebouças, 3970" },
  { lat: -23.5553, lng: -46.6858, description: "Rua Teodoro Sampaio, 1020" },
  { lat: -23.5714, lng: -46.6760, description: "Av. Europa, 538" },
  { lat: -23.5849, lng: -46.6800, description: "Rua Joaquim Floriano, 466" },
  { lat: -23.5762, lng: -46.6686, description: "Av. São Gabriel, 301" },
  { lat: -23.5587, lng: -46.6628, description: "Rua Haddock Lobo, 1738" },
  { lat: -23.5676, lng: -46.6567, description: "Av. Nove de Julho, 3186" },
  { lat: -23.5563, lng: -46.6622, description: "Rua Bela Cintra, 2016" },
  { lat: -23.5912, lng: -46.6668, description: "Av. República do Líbano, 1485" },
  { lat: -23.5670, lng: -46.6545, description: "Rua Pamplona, 1704" },
  { lat: -23.5774, lng: -46.6660, description: "Av. Brasil, 1436" },
  { lat: -23.5530, lng: -46.6623, description: "Rua da Consolação, 3068" },
  { lat: -23.5812, lng: -46.6757, description: "Av. Cidade Jardim, 350" },
  { lat: -23.5704, lng: -46.6667, description: "Rua Estados Unidos, 1258" },
  { lat: -23.5487, lng: -46.6583, description: "Av. Angélica, 2565" },
  { lat: -23.5645, lng: -46.6660, description: "Rua Padre João Manuel, 758" },
  { lat: -23.5955, lng: -46.6760, description: "Av. Hélio Pellegrino, 200" },
  { lat: -23.5850, lng: -46.6767, description: "Rua Tabapuã, 1010" },
  { lat: -23.5912, lng: -46.6800, description: "Av. Juscelino Kubitschek, 1830" }
];

// Mock data with real São Paulo addresses
export const MOCK_STRETCHES: RouteStretch[] = Array.from({ length: 4 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Route ${i + 1}`,
  sequence: i + 1,
  status: 'not_started',
  waypoints: SP_ADDRESSES.slice(i * 6, (i + 1) * 6).map((addr, j) => ({
    id: `${i * 6 + j + 1}`,
    sequence: j + 1,
    latitude: addr.lat,
    longitude: addr.lng,
    description: addr.description
  }))
}));