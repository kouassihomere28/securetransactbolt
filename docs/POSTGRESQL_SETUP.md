# Guide d'installation PostgreSQL pour SecureTransact

## Installation selon votre système d'exploitation

### 🪟 Windows

#### Option 1: Installateur officiel (Recommandé)
1. Téléchargez PostgreSQL depuis [postgresql.org](https://www.postgresql.org/download/windows/)
2. Exécutez l'installateur
3. Suivez l'assistant d'installation :
   - Choisissez le répertoire d'installation
   - Sélectionnez les composants (gardez les options par défaut)
   - Choisissez le répertoire des données
   - **Important**: Définissez le mot de passe pour l'utilisateur `postgres` (utilisez `password` pour simplifier)
   - Port par défaut : 5432
   - Locale par défaut

#### Option 2: Via Chocolatey
```bash
# Installer Chocolatey d'abord si pas déjà fait
# Puis installer PostgreSQL
choco install postgresql
```

### 🍎 macOS

#### Option 1: Homebrew (Recommandé)
```bash
# Installer Homebrew si pas déjà fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Créer un utilisateur postgres avec mot de passe
createuser -s postgres
psql -U postgres -c "ALTER USER postgres PASSWORD 'password';"
```

#### Option 2: Postgres.app
1. Téléchargez [Postgres.app](https://postgresapp.com/)
2. Glissez l'application dans le dossier Applications
3. Lancez Postgres.app
4. Cliquez sur "Initialize" pour créer un nouveau serveur

### 🐧 Linux (Ubuntu/Debian)

```bash
# Mettre à jour les paquets
sudo apt update

# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurer l'utilisateur postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

### 🐧 Linux (CentOS/RHEL/Fedora)

```bash
# Pour Fedora
sudo dnf install postgresql postgresql-server postgresql-contrib

# Pour CentOS/RHEL
sudo yum install postgresql postgresql-server postgresql-contrib

# Initialiser la base de données
sudo postgresql-setup initdb

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurer l'utilisateur postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

## Configuration après installation

### 1. Créer la base de données pour l'application

```bash
# Se connecter à PostgreSQL
psql -U postgres -h localhost

# Créer la base de données
CREATE DATABASE securetransact;

# Quitter psql
\q
```

### 2. Vérifier la connexion

```bash
# Tester la connexion
psql -U postgres -h localhost -d securetransact
```

Si la connexion fonctionne, vous verrez quelque chose comme :
```
psql (15.x)
Type "help" for help.

securetransact=#
```

## Configuration des variables d'environnement

Créez un fichier `.env` à la racine de votre projet :

```env
# Configuration de la base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securetransact
DB_USER=postgres
DB_PASSWORD=password

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Configuration du serveur
PORT=5000
NODE_ENV=development
```

## Résolution des problèmes courants

### Erreur "role postgres does not exist"
```bash
# Créer l'utilisateur postgres
createuser -s postgres
```

### Erreur de connexion "ECONNREFUSED"
```bash
# Vérifier que PostgreSQL est démarré
# Windows
net start postgresql-x64-15

# macOS avec Homebrew
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### Erreur d'authentification
Modifiez le fichier `pg_hba.conf` pour permettre l'authentification par mot de passe :

1. Trouvez le fichier `pg_hba.conf` :
   - Windows : `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`
   - macOS : `/usr/local/var/postgres/pg_hba.conf`
   - Linux : `/etc/postgresql/15/main/pg_hba.conf`

2. Changez la ligne :
   ```
   local   all             postgres                                peer
   ```
   en :
   ```
   local   all             postgres                                md5
   ```

3. Redémarrez PostgreSQL

## Vérification de l'installation

Une fois PostgreSQL installé et configuré, testez votre application :

1. Démarrez le serveur backend :
   ```bash
   npm run server
   ```

2. Dans un autre terminal, démarrez l'application :
   ```bash
   npm run dev
   ```

3. Allez sur l'écran d'inscription et vérifiez que le statut indique "Serveur connecté"

## Alternatives sans installation

Si vous ne voulez pas installer PostgreSQL localement, vous pouvez utiliser :

### 1. Docker (Recommandé pour le développement)
```bash
# Lancer PostgreSQL dans un conteneur Docker
docker run --name postgres-securetransact \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=securetransact \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Services cloud gratuits
- **Supabase** : Base de données PostgreSQL gratuite
- **ElephantSQL** : PostgreSQL as a Service
- **Heroku Postgres** : Plan gratuit disponible

Pour utiliser un service cloud, modifiez simplement les variables d'environnement dans votre fichier `.env` avec les informations de connexion fournies par le service.