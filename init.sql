-- -- Create landlords table
-- CREATE TABLE landlords (
--   id BIGSERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   addresses TEXT[] DEFAULT '{}',
--   city TEXT NOT NULL,
--   status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
--   is_deleted BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- Create reviews table
-- CREATE TABLE reviews (
--   id BIGSERIAL PRIMARY KEY,
--   landlord_id BIGINT NOT NULL REFERENCES landlords(id) ON DELETE CASCADE,
--   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
--   rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
--   communication INTEGER NOT NULL CHECK (communication >= 1 AND communication <= 5),
--   maintenance INTEGER NOT NULL CHECK (maintenance >= 1 AND maintenance <= 5),
--   respect INTEGER NOT NULL CHECK (respect >= 1 AND respect <= 5),
--   comment TEXT NOT NULL,
--   would_rent_again BOOLEAN DEFAULT FALSE,
--   rent_amount DECIMAL(10, 2),
--   property_address TEXT,
--   verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
--   verification_file_url TEXT,
--   is_deleted BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- Create indexes for better performance
-- CREATE INDEX idx_landlords_city ON landlords(city) WHERE NOT is_deleted;
-- CREATE INDEX idx_landlords_status ON landlords(status) WHERE NOT is_deleted;
-- CREATE INDEX idx_reviews_landlord_id ON reviews(landlord_id) WHERE NOT is_deleted;
-- CREATE INDEX idx_reviews_user_id ON reviews(user_id);
-- CREATE INDEX idx_reviews_verification_status ON reviews(verification_status) WHERE NOT is_deleted;

-- -- Enable Row Level Security
-- ALTER TABLE landlords ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- -- Landlords policies
-- -- EVERYONE (including anonymous users) can view approved landlords
-- CREATE POLICY "Everyone can view approved landlords" ON landlords
--   FOR SELECT USING (NOT is_deleted AND status = 'approved');

-- -- Authenticated users (anyone logged in) can insert landlords (they start as pending)
-- CREATE POLICY "Authenticated users can insert landlords" ON landlords
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- -- Reviews policies
-- -- EVERYONE (including anonymous users) can view active reviews
-- CREATE POLICY "Everyone can view active reviews" ON reviews
--   FOR SELECT USING (NOT is_deleted);

-- -- Authenticated users (anyone logged in) can insert reviews
-- -- CREATE POLICY "Authenticated users can insert reviews" ON reviews
-- --   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- -- Users can ONLY update their own reviews
-- CREATE POLICY "Users can update own reviews" ON reviews
--   FOR UPDATE USING (auth.uid() = user_id);

-- -- Insert sample data
-- INSERT INTO landlords (id, name, addresses, city, status) VALUES
--   (1, 'fake landlord 1', ARRAY['123 Forbes Ave'], 'Pittsburgh', 'approved'),
--   (2, 'fake landlord 2', ARRAY['456 Fifth Ave'], 'Pittsburgh', 'approved'),
--   (4, 'John C.R. Kelly Realty', '{}', 'Pittsburgh', 'approved'),
--   (5, 'Walnut Capital', '{}', 'Pittsburgh', 'approved'),
--   (6, 'Lobos Management', '{}', 'Pittsburgh', 'approved'),
--   (7, 'Bob Eckenrode', '{}', 'Pittsburgh', 'approved'),
--   (8, 'TMK Properties', '{}', 'Pittsburgh', 'approved'),
--   (9, 'Mozart Management', '{}', 'Pittsburgh', 'approved'),
--   (10, 'Palmieri Property Management', '{}', 'Pittsburgh', 'approved');

-- -- Set the sequence to continue from the highest ID
-- SELECT setval('landlords_id_seq', (SELECT MAX(id) FROM landlords));

-- -- Insert sample reviews (converting mock data to match new schema)
-- INSERT INTO reviews (id, landlord_id, rating, communication, maintenance, respect, comment, would_rent_again, rent_amount, property_address, verification_status, created_at, updated_at) VALUES
--   -- fake landlord 1 reviews
--   (5, 1, 2, 2, 1, 2, 'Fake review', false, 1200, '456 S Craig St', 'unverified', '2023-07-10', '2023-07-10'),
--   (6, 1, 3, 3, 3, 3, 'Fake review', true, 1350, NULL, 'verified', '2023-09-22', '2023-09-22'),
--   (7, 1, 1, 1, 2, 1, 'Fake review', false, NULL, '789 Bellefonte St', 'pending', '2023-06-05', '2023-06-05'),
  
--   -- fake landlord 2 reviews
--   (8, 2, 4, 4, 4, 4, 'Fake review', true, 1500, '234 Neville St', 'verified', '2023-08-18', '2023-08-18'),
--   (9, 2, 3, 4, 3, 3, 'Fake review', true, 1400, NULL, 'unverified', '2023-10-01', '2023-10-01'),
--   (10, 2, 5, 5, 5, 4, 'Fake review', true, 1600, NULL, 'verified', '2023-09-15', '2023-09-15');

-- -- Set the sequence to continue from the highest ID
-- SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));