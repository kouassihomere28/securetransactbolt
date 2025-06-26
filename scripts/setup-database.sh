#!/bin/bash

# Script de configuration automatique de la base de données PostgreSQL
# pour l'application SecureTransact

echo "🚀 Configuration de PostgreSQL pour SecureTransact..."

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé."
    echo "📖 Consultez le fichier docs/POSTGRESQL_SETUP.md pour les instructions d'installation."
    exit 1
fi

# Vérifier si PostgreSQL est en cours d'exécution
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "❌ PostgreSQL n'est pas en cours d'exécution."
    echo "💡 Démarrez PostgreSQL avec :"
    echo "   - Windows: net start postgresql-x64-15"
    echo "   - macOS: brew services start postgresql@15"
    echo "   - Linux: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL est en cours d'exécution"

# Créer la base de données si elle n'existe pas
echo "📊 Création de la base de données 'securetransact'..."

# Vérifier si la base de données existe déjà
if psql -U postgres -h localhost -lqt | cut -d \| -f 1 | grep -qw securetransact; then
    echo "✅ La base de données 'securetransact' existe déjà"
else
    # Créer la base de données
    if createdb -U postgres -h localhost securetransact; then
        echo "✅ Base de données 'securetransact' créée avec succès"
    else
        echo "❌ Erreur lors de la création de la base de données"
        echo "💡 Vérifiez que l'utilisateur 'postgres' existe et a les bonnes permissions"
        exit 1
    fi
fi

# Tester la connexion à la base de données
echo "🔍 Test de connexion à la base de données..."
if psql -U postgres -h localhost -d securetransact -c "SELECT 1;" &> /dev/null; then
    echo "✅ Connexion à la base de données réussie"
else
    echo "❌ Impossible de se connecter à la base de données"
    echo "💡 Vérifiez le mot de passe de l'utilisateur postgres"
    exit 1
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé à partir de .env.example"
else
    echo "✅ Le fichier .env existe déjà"
fi

echo ""
echo "🎉 Configuration terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Démarrez le serveur backend : npm run server"
echo "2. Dans un autre terminal, démarrez l'app : npm run dev"
echo "3. Testez la création de compte dans l'application"
echo ""
echo "🔧 En cas de problème, consultez docs/POSTGRESQL_SETUP.md"