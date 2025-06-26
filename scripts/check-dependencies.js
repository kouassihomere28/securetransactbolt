const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Vérification des dépendances pour SecureTransact...\n');

// Vérifier Node.js
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
} catch (error) {
  console.log('❌ Node.js n\'est pas installé');
  process.exit(1);
}

// Vérifier npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm: v${npmVersion}`);
} catch (error) {
  console.log('❌ npm n\'est pas installé');
  process.exit(1);
}

// Vérifier PostgreSQL
try {
  const pgVersion = execSync('psql --version', { encoding: 'utf8' }).trim();
  console.log(`✅ PostgreSQL: ${pgVersion}`);
  
  // Vérifier si PostgreSQL est en cours d'exécution
  try {
    execSync('pg_isready -h localhost -p 5432', { stdio: 'ignore' });
    console.log('✅ PostgreSQL est en cours d\'exécution');
  } catch (error) {
    console.log('⚠️  PostgreSQL est installé mais pas en cours d\'exécution');
    console.log('💡 Démarrez PostgreSQL pour continuer');
  }
} catch (error) {
  console.log('❌ PostgreSQL n\'est pas installé');
  console.log('📖 Consultez docs/POSTGRESQL_SETUP.md pour l\'installation');
}

// Vérifier le fichier .env
if (fs.existsSync('.env')) {
  console.log('✅ Fichier .env trouvé');
} else {
  console.log('⚠️  Fichier .env manquant');
  console.log('💡 Copiez .env.example vers .env');
}

// Vérifier les modules Node.js
if (fs.existsSync('node_modules')) {
  console.log('✅ Modules Node.js installés');
} else {
  console.log('⚠️  Modules Node.js manquants');
  console.log('💡 Exécutez: npm install');
}

console.log('\n🚀 Vérification terminée !');