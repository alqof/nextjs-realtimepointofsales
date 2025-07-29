INSERT INTO public.menus (name, description, price, discount, image_url, category, is_available)
VALUES
  -- Coffee
  ('Espresso', 'Single shot of espresso, rich and bold flavor.', 20000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-c-1.jpg', 'Coffee', true),
  ('Cappuccino', 'Espresso with steamed milk and milk foam.', 28000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-c-2.jpg', 'Coffee', true),
  ('Americano', 'Espresso with added hot water.', 23000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-c-3.jpg', 'Coffee', true),
  ('Latte', 'Espresso with steamed milk, smooth and creamy.', 30000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-c-4.jpg', 'Coffee', true),
  ('Manual Brew V60', 'V60 pourover single origin, fruity and clean taste.', 35000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-c-5.jpg', 'Coffee', true),
  -- Non-Coffee
  ('Matcha Latte', 'Premium matcha with fresh milk.', 32000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-nc-1.jpg', 'Non-Coffee', true),
  ('Chocolate', 'Hot chocolate, creamy and sweet.', 25000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-nc-2.jpg', 'Non-Coffee', true),
  ('Iced Lemon Tea', 'Fresh lemon tea with ice.', 18000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-nc-3.jpg', 'Non-Coffee', true),
  ('Red Velvet Latte', 'Red velvet drink with milk.', 27000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-nc-4.jpg', 'Non-Coffee', true),
  -- Food / Snack
  ('Croissant', 'Buttery and flaky croissant.', 20000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-f-1.jpg', 'Food', true),
  ('Banana Bread', 'Homemade banana bread slice.', 18000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-f-2.jpg', 'Food', true),
  ('French Fries', 'Crispy fries with dipping sauce.', 22000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-s-1.jpg', 'Snack', true),
  ('Chicken Popcorn', 'Crispy bite-sized chicken.', 25000, 0, 'https://pknnjvbehmdpfuxtirjg.supabase.co/storage/v1/object/public/images/menus/m-s-2.jpg', 'Snack', true);