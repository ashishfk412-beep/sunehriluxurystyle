-- Insert categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Sarees', 'sarees', 'Elegant traditional sarees for every occasion', '/placeholder.svg?height=400&width=600'),
  ('Kurtis', 'kurtis', 'Comfortable and stylish kurtis for daily wear', '/placeholder.svg?height=400&width=600'),
  ('Gowns', 'gowns', 'Beautiful gowns for special events', '/placeholder.svg?height=400&width=600'),
  ('Party Wear', 'party-wear', 'Stunning outfits for parties and celebrations', '/placeholder.svg?height=400&width=600'),
  ('Casual Wear', 'casual-wear', 'Comfortable casual dresses for everyday style', '/placeholder.svg?height=400&width=600');

-- Get category IDs for reference
DO $$
DECLARE
  sarees_id UUID;
  kurtis_id UUID;
  gowns_id UUID;
  party_id UUID;
  casual_id UUID;
BEGIN
  SELECT id INTO sarees_id FROM categories WHERE slug = 'sarees';
  SELECT id INTO kurtis_id FROM categories WHERE slug = 'kurtis';
  SELECT id INTO gowns_id FROM categories WHERE slug = 'gowns';
  SELECT id INTO party_id FROM categories WHERE slug = 'party-wear';
  SELECT id INTO casual_id FROM categories WHERE slug = 'casual-wear';

  -- Insert products
  -- Sarees
  INSERT INTO products (name, slug, description, price, original_price, category_id, image_url, additional_images, sizes, colors, stock_quantity, is_featured, is_new_arrival, rating, reviews_count) VALUES
    ('Silk Heritage Saree', 'silk-heritage-saree', 'Exquisite pure silk saree with traditional zari work', 5999.00, 7999.00, sarees_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600', '/placeholder.svg?height=800&width=600'], ARRAY['One Size'], ARRAY['Royal Blue', 'Maroon', 'Emerald Green'], 15, true, true, 4.8, 124),
    ('Banarasi Silk Saree', 'banarasi-silk-saree', 'Traditional Banarasi silk saree with intricate patterns', 8999.00, 11999.00, sarees_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['One Size'], ARRAY['Gold', 'Red', 'Purple'], 10, true, false, 4.9, 89),
    ('Cotton Printed Saree', 'cotton-printed-saree', 'Comfortable cotton saree with modern prints', 1499.00, 1999.00, sarees_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['One Size'], ARRAY['Pink', 'Yellow', 'Blue'], 30, false, true, 4.5, 156),
    ('Georgette Party Saree', 'georgette-party-saree', 'Lightweight georgette saree perfect for parties', 3499.00, 4999.00, sarees_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['One Size'], ARRAY['Black', 'Wine', 'Navy'], 20, false, false, 4.6, 92);

  -- Kurtis
  INSERT INTO products (name, slug, description, price, original_price, category_id, image_url, additional_images, sizes, colors, stock_quantity, is_featured, is_new_arrival, rating, reviews_count) VALUES
    ('Anarkali Kurti Set', 'anarkali-kurti-set', 'Elegant Anarkali style kurti with palazzo', 2499.00, 3499.00, kurtis_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['Peach', 'Mint', 'Lavender'], 25, true, true, 4.7, 203),
    ('Printed Straight Kurti', 'printed-straight-kurti', 'Comfortable straight cut kurti with beautiful prints', 999.00, 1499.00, kurtis_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Beige', 'Light Blue'], 40, false, true, 4.4, 178),
    ('Embroidered A-Line Kurti', 'embroidered-aline-kurti', 'Beautiful A-line kurti with delicate embroidery', 1799.00, 2499.00, kurtis_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Coral', 'Turquoise', 'Rose'], 30, false, false, 4.6, 145),
    ('Designer Kurti with Dupatta', 'designer-kurti-dupatta', 'Trendy designer kurti with matching dupatta', 2999.00, 3999.00, kurtis_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Mustard', 'Bottle Green', 'Rust'], 18, true, false, 4.8, 167);

  -- Gowns
  INSERT INTO products (name, slug, description, price, original_price, category_id, image_url, additional_images, sizes, colors, stock_quantity, is_featured, is_new_arrival, rating, reviews_count) VALUES
    ('Velvet Evening Gown', 'velvet-evening-gown', 'Luxurious velvet gown for evening events', 6999.00, 8999.00, gowns_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Burgundy', 'Navy Blue', 'Black'], 12, true, true, 4.9, 87),
    ('Floral Maxi Gown', 'floral-maxi-gown', 'Flowing maxi gown with floral embellishments', 4499.00, 5999.00, gowns_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blush Pink', 'Sky Blue', 'Cream'], 15, true, false, 4.7, 112),
    ('Sequin Party Gown', 'sequin-party-gown', 'Glamorous sequin gown perfect for parties', 5499.00, 7499.00, gowns_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['XS', 'S', 'M', 'L'], ARRAY['Gold', 'Silver', 'Rose Gold'], 10, false, true, 4.8, 95);

  -- Party Wear
  INSERT INTO products (name, slug, description, price, original_price, category_id, image_url, additional_images, sizes, colors, stock_quantity, is_featured, is_new_arrival, rating, reviews_count) VALUES
    ('Cocktail Dress', 'cocktail-dress', 'Chic cocktail dress for evening parties', 3999.00, 5499.00, party_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Red', 'Black', 'Emerald'], 20, true, true, 4.6, 134),
    ('Embellished Lehenga Set', 'embellished-lehenga-set', 'Stunning lehenga set with intricate embellishments', 12999.00, 16999.00, party_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Pink', 'Blue', 'Purple'], 8, true, false, 4.9, 76),
    ('Indo-Western Fusion Dress', 'indo-western-fusion', 'Modern indo-western dress for contemporary look', 4999.00, 6999.00, party_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Teal', 'Magenta', 'Coral'], 15, false, true, 4.7, 98);

  -- Casual Wear
  INSERT INTO products (name, slug, description, price, original_price, category_id, image_url, additional_images, sizes, colors, stock_quantity, is_featured, is_new_arrival, rating, reviews_count) VALUES
    ('Cotton Summer Dress', 'cotton-summer-dress', 'Breezy cotton dress for everyday comfort', 1299.00, 1799.00, casual_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Yellow', 'Mint Green'], 35, false, true, 4.5, 189),
    ('Denim Shirt Dress', 'denim-shirt-dress', 'Trendy denim shirt dress for casual outings', 1999.00, 2799.00, casual_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Light Blue', 'Dark Blue'], 25, true, false, 4.6, 156),
    ('Floral Wrap Dress', 'floral-wrap-dress', 'Elegant wrap dress with floral print', 2299.00, 2999.00, casual_id, '/placeholder.svg?height=800&width=600', ARRAY['/placeholder.svg?height=800&width=600'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Multicolor'], 22, false, false, 4.7, 142);
END $$;
