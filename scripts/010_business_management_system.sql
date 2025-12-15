-- Add discount management tables
CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  applies_to TEXT NOT NULL CHECK (applies_to IN ('category', 'product', 'customer', 'all')),
  target_id UUID, -- category_id, product_id, or customer_id depending on applies_to
  min_quantity INTEGER DEFAULT 1,
  min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tax rates table
CREATE TABLE IF NOT EXISTS tax_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rate DECIMAL(5, 2) NOT NULL, -- Percentage
  applies_to TEXT NOT NULL CHECK (applies_to IN ('all', 'category', 'product')),
  target_id UUID, -- category_id or product_id
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address JSONB NOT NULL,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0, -- For pending orders
  reorder_level INTEGER DEFAULT 10,
  last_restocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, warehouse_id)
);

-- Add customer discounts table (for customer-specific discounts)
CREATE TABLE IF NOT EXISTS customer_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  discount_id UUID REFERENCES discounts(id) ON DELETE CASCADE,
  times_used INTEGER DEFAULT 0,
  max_uses INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, discount_id)
);

-- Add discount_applied field to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_applied JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_applied JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10, 2) DEFAULT 0;

-- Enable RLS
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_discounts ENABLE ROW LEVEL SECURITY;

-- Public read for active discounts and tax rates
CREATE POLICY "Anyone can view active discounts" ON discounts FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active tax rates" ON tax_rates FOR SELECT USING (is_active = true);

-- Public read for warehouses and inventory
CREATE POLICY "Anyone can view warehouses" ON warehouses FOR SELECT USING (true);
CREATE POLICY "Anyone can view inventory" ON inventory FOR SELECT USING (true);

-- Users can view their own customer discounts
CREATE POLICY "Users can view their discounts" ON customer_discounts FOR SELECT USING (auth.uid() = customer_id);

-- Create indexes
CREATE INDEX idx_discounts_applies_to ON discounts(applies_to, target_id);
CREATE INDEX idx_discounts_active ON discounts(is_active);
CREATE INDEX idx_tax_rates_applies_to ON tax_rates(applies_to, target_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);

-- Insert default tax rate (18% GST for India)
INSERT INTO tax_rates (name, rate, applies_to, is_active)
VALUES ('GST (18%)', 18.00, 'all', true)
ON CONFLICT DO NOTHING;

-- Insert default warehouse
INSERT INTO warehouses (name, code, address, phone, email, is_active)
VALUES (
  'Main Warehouse',
  'WH001',
  '{"street": "123 Main St", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'::jsonb,
  '+91-1234567890',
  'warehouse@sunehriluxurystyle.com',
  true
)
ON CONFLICT DO NOTHING;
