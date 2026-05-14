CREATE TABLE IF NOT EXISTS startups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  founded_at DATE,
  location VARCHAR(255),
  category VARCHAR(100),
  funding_amount NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technologies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  description TEXT,
  adoption_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);