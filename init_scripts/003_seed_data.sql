-- Seed 10 drones with different models and battery levels
INSERT INTO drones (serial_number, model, weight_limit, battery_capacity, state) VALUES
('DRONE001', 'Lightweight', 100.00, 100, 'IDLE'),
('DRONE002', 'Lightweight', 100.00, 85, 'IDLE'),
('DRONE003', 'Lightweight', 100.00, 40, 'IDLE'),
('DRONE004', 'Middleweight', 200.00, 75, 'IDLE'),
('DRONE005', 'Middleweight', 200.00, 50, 'IDLE'),
('DRONE006', 'Middleweight', 200.00, 60, 'IDLE'),
('DRONE007', 'Cruiserweight', 300.00, 90, 'IDLE'),
('DRONE008', 'Cruiserweight', 300.00, 30, 'IDLE'),
('DRONE009', 'Heavyweight', 500.00, 95, 'IDLE'),
('DRONE010', 'Heavyweight', 500.00, 20, 'IDLE')
ON CONFLICT (serial_number) DO NOTHING;

-- Seed sample medications
INSERT INTO medications (name, weight, code, image) VALUES
('Paracetamol_500mg', 5.00, 'PARA_500', 'https://example.com/images/paracetamol.jpg'),
('Ibuprofen_400mg', 7.50, 'IBU_400', 'https://example.com/images/ibuprofen.jpg'),
('Aspirin_100mg', 3.00, 'ASP_100', 'https://example.com/images/aspirin.jpg'),
('Amoxicillin_250mg', 10.00, 'AMOX_250', 'https://example.com/images/amoxicillin.jpg'),
('Ciprofloxacin_500mg', 8.00, 'CIPRO_500', 'https://example.com/images/ciprofloxacin.jpg'),
('Metformin_500mg', 6.50, 'MET_500', 'https://example.com/images/metformin.jpg'),
('Atorvastatin_20mg', 4.00, 'ATOR_20', 'https://example.com/images/atorvastatin.jpg'),
('Omeprazole_20mg', 5.50, 'OME_20', 'https://example.com/images/omeprazole.jpg'),
('Amlodipine_5mg', 3.50, 'AMLO_5', 'https://example.com/images/amlodipine.jpg'),
('Lisinopril_10mg', 4.50, 'LIS_10', 'https://example.com/images/lisinopril.jpg')
ON CONFLICT (code) DO NOTHING;
