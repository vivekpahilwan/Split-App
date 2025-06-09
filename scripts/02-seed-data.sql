-- Insert sample data for testing
INSERT INTO expenses (amount, description, paid_by, category, created_at) VALUES
(600.00, 'Dinner at restaurant', 'Shantanu', 'Food', NOW() - INTERVAL '1 day'),
(450.00, 'Groceries for the week', 'Sanket', 'Food', NOW() - INTERVAL '2 days'),
(300.00, 'Petrol for road trip', 'Om', 'Travel', NOW() - INTERVAL '3 days'),
(500.00, 'Movie tickets', 'Shantanu', 'Entertainment', NOW() - INTERVAL '4 days'),
(280.00, 'Pizza delivery', 'Sanket', 'Food', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;
