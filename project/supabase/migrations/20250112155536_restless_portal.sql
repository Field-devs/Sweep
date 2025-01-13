/*
  # Populate Routes and Waypoints

  1. Data Population
    - Insert mock route stretches
    - Insert corresponding waypoints for each stretch
    - Maintain proper sequence and relationships
  
  2. Data Structure
    - Route stretches with names and initial status
    - Waypoints with real São Paulo coordinates and descriptions
*/

DO $$ 
DECLARE
  stretch_id uuid;
  user_id uuid;
BEGIN
  -- Get the first user from the system (for demo purposes)
  SELECT id INTO user_id FROM auth.users LIMIT 1;
  
  -- Insert first stretch
  INSERT INTO route_stretches (name, status, user_id)
  VALUES ('Trecho 1', 'not_started', user_id)
  RETURNING id INTO stretch_id;

  -- Insert waypoints for first stretch
  INSERT INTO waypoints (stretch_id, latitude, longitude, sequence, description)
  VALUES 
    (stretch_id, -23.5614, -46.6565, 1, 'Av. Paulista, 1578'),
    (stretch_id, -23.5575, -46.6608, 2, 'Rua Augusta, 2026'),
    (stretch_id, -23.5620, -46.6695, 3, 'Rua Oscar Freire, 725'),
    (stretch_id, -23.5868, -46.6847, 4, 'Av. Brigadeiro Faria Lima, 2232'),
    (stretch_id, -23.5656, -46.6907, 5, 'Rua dos Pinheiros, 1037'),
    (stretch_id, -23.5738, -46.6825, 6, 'Av. Rebouças, 3970');

  -- Insert second stretch
  INSERT INTO route_stretches (name, status, user_id)
  VALUES ('Trecho 2', 'not_started', user_id)
  RETURNING id INTO stretch_id;

  -- Insert waypoints for second stretch
  INSERT INTO waypoints (stretch_id, latitude, longitude, sequence, description)
  VALUES 
    (stretch_id, -23.5553, -46.6858, 1, 'Rua Teodoro Sampaio, 1020'),
    (stretch_id, -23.5714, -46.6760, 2, 'Av. Europa, 538'),
    (stretch_id, -23.5849, -46.6800, 3, 'Rua Joaquim Floriano, 466'),
    (stretch_id, -23.5762, -46.6686, 4, 'Av. São Gabriel, 301'),
    (stretch_id, -23.5587, -46.6628, 5, 'Rua Haddock Lobo, 1738'),
    (stretch_id, -23.5676, -46.6567, 6, 'Av. Nove de Julho, 3186');

  -- Insert third stretch
  INSERT INTO route_stretches (name, status, user_id)
  VALUES ('Trecho 3', 'not_started', user_id)
  RETURNING id INTO stretch_id;

  -- Insert waypoints for third stretch
  INSERT INTO waypoints (stretch_id, latitude, longitude, sequence, description)
  VALUES 
    (stretch_id, -23.5563, -46.6622, 1, 'Rua Bela Cintra, 2016'),
    (stretch_id, -23.5912, -46.6668, 2, 'Av. República do Líbano, 1485'),
    (stretch_id, -23.5670, -46.6545, 3, 'Rua Pamplona, 1704'),
    (stretch_id, -23.5774, -46.6660, 4, 'Av. Brasil, 1436'),
    (stretch_id, -23.5530, -46.6623, 5, 'Rua da Consolação, 3068'),
    (stretch_id, -23.5812, -46.6757, 6, 'Av. Cidade Jardim, 350');

  -- Insert fourth stretch
  INSERT INTO route_stretches (name, status, user_id)
  VALUES ('Trecho 4', 'not_started', user_id)
  RETURNING id INTO stretch_id;

  -- Insert waypoints for fourth stretch
  INSERT INTO waypoints (stretch_id, latitude, longitude, sequence, description)
  VALUES 
    (stretch_id, -23.5704, -46.6667, 1, 'Rua Estados Unidos, 1258'),
    (stretch_id, -23.5487, -46.6583, 2, 'Av. Angélica, 2565'),
    (stretch_id, -23.5645, -46.6660, 3, 'Rua Padre João Manuel, 758'),
    (stretch_id, -23.5955, -46.6760, 4, 'Av. Hélio Pellegrino, 200'),
    (stretch_id, -23.5850, -46.6767, 5, 'Rua Tabapuã, 1010'),
    (stretch_id, -23.5912, -46.6800, 6, 'Av. Juscelino Kubitschek, 1830');

END $$;