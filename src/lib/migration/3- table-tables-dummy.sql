INSERT INTO public.tables (name, description, capacity, status, created_at, updated_at) VALUES
    -- Lantai 1
    ('G1-001', 'Lantai 1, dekat jendela', 4, 'available', now(), now()),
    ('G1-002', 'Lantai 1, dekat pintu masuk', 4, 'unavailable', now(), now()),
    ('G1-003', 'Lantai 1, tengah ruangan', 2, 'available', now(), now()),
    ('G1-004', 'Lantai 1, dekat kasir', 6, 'reserve', now(), now()),
    ('G1-005', 'Lantai 1, pojok kanan', 4, 'available', now(), now()),
    ('G1-006', 'Lantai 1, pojok kiri', 2, 'reserve', now(), now()),
    ('G1-007', 'Lantai 1, dekat dapur', 6, 'unavailable', now(), now()),
    ('G1-008', 'Lantai 1, tengah ruangan', 4, 'available', now(), now()),
    -- Lantai 2
    ('G2-001', 'Lantai 2, dekat balkon', 4, 'available', now(), now()),
    ('G2-002', 'Lantai 2, dekat tangga', 2, 'unavailable', now(), now()),
    ('G2-003', 'Lantai 2, tengah ruangan', 4, 'reserve', now(), now()),
    ('G2-004', 'Lantai 2, pojok kanan', 6, 'available', now(), now()),
    ('G2-005', 'Lantai 2, pojok kiri', 2, 'available', now(), now()),
    ('G2-006', 'Lantai 2, dekat toilet', 4, 'reserve', now(), now()),
    ('G2-007', 'Lantai 2, dekat bar', 6, 'unavailable', now(), now()),
    ('G2-008', 'Lantai 2, tengah ruangan', 4, 'available', now(), now());