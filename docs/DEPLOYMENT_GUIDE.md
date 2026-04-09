# Deployment Guide

## Production Deployment

### Prerequisites
- MongoDB database (MongoDB Atlas recommended)
- Domain name (optional)
- SSL certificate (Let's Encrypt recommended)

---

## Emergent Platform Deployment

The application is pre-configured for Emergent deployment.

### Environment Variables

**Backend** (`/app/backend/.env`):
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=rental_db
JWT_SECRET_KEY=your-super-secret-key-change-this
CORS_ORIGINS=*
```

**Frontend** (`/app/frontend/.env`):
```env
REACT_APP_BACKEND_URL=https://your-app.preview.emergentagent.com
```

### Deployment Steps

1. **Verify Environment Variables**
   ```bash
   # Backend
   cat /app/backend/.env
   
   # Frontend
   cat /app/frontend/.env
   ```

2. **Check Services**
   ```bash
   sudo supervisorctl status
   ```

3. **Restart Services**
   ```bash
   sudo supervisorctl restart backend frontend
   ```

4. **Verify Deployment**
   ```bash
   curl https://your-app.preview.emergentagent.com/api/properties
   ```

---

## Manual Production Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.10+
sudo apt install -y python3.10 python3.10-venv python3-pip

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx
```

### 2. Application Setup

```bash
# Clone repository
git clone <repository-url> /var/www/rental-app
cd /var/www/rental-app

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install -g yarn
yarn install
yarn build
```

### 3. Configure Systemd Services

**Backend Service** (`/etc/systemd/system/rental-backend.service`):
```ini
[Unit]
Description=RentAI Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/rental-app/backend
Environment="PATH=/var/www/rental-app/backend/venv/bin"
ExecStart=/var/www/rental-app/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable rental-backend
sudo systemctl start rental-backend
```

### 4. Configure Nginx

**Nginx Config** (`/etc/nginx/sites-available/rental-app`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/rental-app/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/rental-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo systemctl reload nginx
```

### 6. MongoDB Security

```bash
# Enable authentication
mongo
use admin
db.createUser({
  user: "adminUser",
  pwd: "strongPassword",
  roles: [{role: "userAdminAnyDatabase", db: "admin"}]
})
exit

# Edit MongoDB config
sudo nano /etc/mongod.conf
# Add:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod

# Update backend .env
MONGO_URL=mongodb://adminUser:strongPassword@localhost:27017/rental_db?authSource=admin
```

### 7. Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 8. Monitoring

```bash
# View backend logs
sudo journalctl -u rental-backend -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check service status
sudo systemctl status rental-backend
sudo systemctl status nginx
sudo systemctl status mongod
```

---

## Docker Deployment (Optional)

### Dockerfile (Backend)
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
```

### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://admin:password@mongodb:27017
      - DB_NAME=rental_db
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

**Run:**
```bash
docker-compose up -d
```

---

## Performance Optimization

1. **Enable Gzip Compression** (Nginx)
2. **Use CDN** for static assets
3. **Enable MongoDB Indexes**
4. **Implement Redis Caching** (optional)
5. **Use PM2** for process management (alternative to systemd)
6. **Enable HTTP/2** in Nginx

---

## Backup Strategy

```bash
# MongoDB backup
mongodump --uri="mongodb://user:pass@localhost:27017/rental_db" --out=/backups/$(date +%Y%m%d)

# Automated daily backup (cron)
0 2 * * * /usr/bin/mongodump --uri="mongodb://user:pass@localhost:27017/rental_db" --out=/backups/$(date +\%Y\%m\%d)
```

---

## Troubleshooting

**Issue**: Backend not starting
```bash
# Check logs
sudo journalctl -u rental-backend -n 50

# Check port
sudo netstat -tlnp | grep 8001
```

**Issue**: Frontend not loading
```bash
# Rebuild
cd /var/www/rental-app/frontend
yarn build
sudo systemctl restart nginx
```

**Issue**: Database connection error
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string in .env
cat /var/www/rental-app/backend/.env
```
