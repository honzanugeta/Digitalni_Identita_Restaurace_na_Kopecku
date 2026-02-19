-- Insert Menu Items
INSERT INTO public.menu_items (name, description, price, image_url, is_visible)
VALUES
  ('Orange Chicken', 'Křupavé kousky kuřete v sladkokyselé pomerančové omáčce, jasmínová rýže.', 269, 'https://media.istockphoto.com/id/492023021/photo/chinese-orange-chicken-with-chopsticks.jpg?s=612x612&w=0&k=20&c=lerAHdsLQh0OghzMt7n_fKER2y2enB1Djnss_Wpaj6s=', true),
  ('Bun Bo Nam Bo', 'Vietnamský nudlový salát s hovězím masem, bylinkami a arašídy.', 289, 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', true),
  ('Pho Bo', 'Tradiční silný hovězí vývar, rýžové nudle, plátky masa, čerstvé bylinky.', 279, 'https://media.istockphoto.com/id/1462352351/photo/pho.jpg?s=612x612&w=0&k=20&c=TaNeUcQyazuboL2g6sC_EMzuF9ZvW9xPvDL6FZgWKVM=', true),
  ('Bun Cha', 'Grilované vepřové s rýžovými nudlemi a čerstvými bylinkami ve sladkokyselé zálivce.', 289, 'https://media.istockphoto.com/id/888740900/photo/bun-cha-or-vietnamese-cold-white-rice-noodles-served-with-grilled-pork-and-a-variety-of-herbs.jpg?s=612x612&w=0&k=20&c=-2lPw2IeUNnNtFSKcg5YVo0GOYMPy4_G7cxj2UrtdGM=', true),
  ('Com Tam', 'Lámaná rýže s marinovanou krkovicí, vaječnou sedlinou a nakládanou zeleninou.', 279, 'https://media.istockphoto.com/id/2049290538/photo/close-up-of-com-tam-or-vietnamese-broken-rice.jpg?s=612x612&w=0&k=20&c=8WEzQLJQI1aMinXEQ7kR-KmxvlLvTZGgcI53eYt2VU0=', true),
  ('Zavitky', 'Mix čerstvých letních a smažených jarních závitků se sladkokyselou omáčkou.', 189, 'https://cdn.administrace.tv/2022/08/07/hd/9ff4384829f45090a8b4d88bd594c984.jpg', true);

-- Insert Default Opening Hours
INSERT INTO public.settings (key, value)
VALUES
  ('opening_hours', '{
    "monday": {"open": null, "close": null},
    "tuesday": {"open": "12:00", "close": "22:00"},
    "wednesday": {"open": "12:00", "close": "22:00"},
    "thursday": {"open": "12:00", "close": "22:00"},
    "friday": {"open": "12:00", "close": "23:00"},
    "saturday": {"open": "12:00", "close": "23:00"},
    "sunday": {"open": "12:00", "close": "20:00"}
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert Default Popup (Inactive)
INSERT INTO public.settings (key, value)
VALUES
  ('popup', '{"active": false, "title": "Novinka", "message": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
