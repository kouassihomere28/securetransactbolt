import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la base de données avec des valeurs par défaut pour le développement
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'securetransact',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  // Configuration pour le développement local
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test de connexion au démarrage
pool.on('connect', () => {
  console.log('✅ Connexion à PostgreSQL établie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL:', err);
});

// Fonction pour initialiser la base de données
export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initialisation de la base de données...');
    
    // Créer les tables si elles n'existent pas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(10) CHECK (user_type IN ('buyer', 'seller', 'both')) NOT NULL,
        rating DECIMAL(2,1) DEFAULT 0,
        total_transactions INTEGER DEFAULT 0,
        joined_date DATE DEFAULT CURRENT_DATE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status VARCHAR(30) CHECK (status IN ('pending_acceptance', 'pending_payment', 'payment_secured', 'shipped', 'delivered', 'inspection_period', 'completed', 'disputed', 'cancelled')) NOT NULL,
        buyer_id INTEGER REFERENCES users(id),
        seller_id INTEGER REFERENCES users(id),
        buyer_name VARCHAR(255) NOT NULL,
        seller_name VARCHAR(255) NOT NULL,
        created_date DATE DEFAULT CURRENT_DATE,
        expected_delivery DATE,
        inspection_period INTEGER DEFAULT 3,
        delivery_address TEXT,
        dispute_reason TEXT,
        last_update DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
        sender_id VARCHAR(50) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        type VARCHAR(10) CHECK (type IN ('text', 'image', 'system')) DEFAULT 'text'
      );
    `);

    console.log('✅ Base de données initialisée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    return false;
  }
};

export default pool;