# Deployment Guide

## Pre-Deployment Checklist

- [ ] All files present and correct
- [ ] Dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] Server starts without errors
- [ ] Test with sample data (`sample_environmental_data.csv`)
- [ ] Date filtering works
- [ ] All 5 metric categories display correctly
- [ ] Charts render smoothly
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] No console errors in browser DevTools

## Local Testing

### 1. Install & Build
```bash
cd C:/data viz
npm install
npm run build
```

### 2. Run Server
```bash
npm run server
```

You should see:
```
Environmental Analytics Dashboard running on http://localhost:3000
Environment: development
```

### 3. Test in Browser
- Open http://localhost:3000
- Upload `sample_environmental_data.csv`
- Verify metrics display correctly
- Test date filtering
- Switch between metric categories

### 4. Test API Health Endpoint
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-...","environment":"development"}
```

## Production Deployment

### Option 1: Node.js Hosting (Recommended)

**Requirements:**
- Node.js 18+ installed on server
- Port 3000 (or configurable) available
- HTTPS reverse proxy (nginx, Apache)

**Steps:**

1. **Upload files to server**
   ```bash
   scp -r . user@server:/app/environmental-dashboard
   ```

2. **Install dependencies**
   ```bash
   cd /app/environmental-dashboard
   npm install --production
   ```

3. **Build application**
   ```bash
   npm run build
   ```

4. **Create systemd service** (Linux)
   
   Create `/etc/systemd/system/dashboard.service`:
   ```ini
   [Unit]
   Description=Environmental Analytics Dashboard
   After=network.target

   [Service]
   Type=simple
   User=dashboard
   WorkingDirectory=/app/environmental-dashboard
   ExecStart=/usr/bin/node server/index.js
   Restart=on-failure
   RestartSec=10
   Environment="PORT=3000"
   Environment="NODE_ENV=production"

   [Install]
   WantedBy=multi-user.target
   ```

   Enable and start:
   ```bash
   sudo systemctl enable dashboard
   sudo systemctl start dashboard
   ```

5. **Setup Nginx reverse proxy**
   
   Create `/etc/nginx/sites-available/dashboard`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and test:
   ```bash
   sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup HTTPS with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "run", "server"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

Build and run:
```bash
docker-compose up -d
```

### Option 3: Heroku Deployment

1. **Create Procfile**
   ```
   web: npm run server
   ```

2. **Deploy**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

### Option 4: AWS/Azure/GCP Deployment

Each cloud provider has its own deployment process, but generally:

1. **Create a VM instance** (EC2, App Service, Compute Engine)
2. **Install Node.js**
3. **Clone repository or upload files**
4. **Run `npm install && npm run build`**
5. **Start with `npm run server`**
6. **Configure firewall rules** to allow port 3000 (or 80/443 if behind reverse proxy)
7. **Setup domain name** and HTTPS

## Environment Variables

Set these for production:

```bash
export NODE_ENV=production
export PORT=3000
```

Or in `.env` file (create `.env` from `.env.example`):
```
NODE_ENV=production
PORT=3000
```

## Performance Optimization

### Caching
Add HTTP caching headers via Nginx:
```nginx
location ~* \.(js|css|png|jpg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

location / {
    add_header Cache-Control "no-cache, must-revalidate";
}
```

### Compression
Enable gzip in Nginx:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_vary on;
```

## Monitoring

### Monitor Server Health
```bash
# Check if service is running
curl http://localhost:3000/api/health

# Check logs (systemd)
sudo journalctl -u dashboard -f

# Check memory usage
ps aux | grep node
```

### Setup Monitoring
- Use PM2: `npm install -g pm2` then `pm2 start server/index.js`
- Use New Relic or DataDog for APM
- Setup log aggregation (ELK, Splunk, etc.)

## Backup & Updates

### Backup
```bash
# Backup the application directory
tar -czf dashboard-backup-$(date +%Y%m%d).tar.gz /app/environmental-dashboard/
```

### Update Application
```bash
cd /app/environmental-dashboard
git pull origin main
npm install
npm run build
sudo systemctl restart dashboard
```

## Security Checklist

- [ ] Run on HTTPS only
- [ ] Set `NODE_ENV=production`
- [ ] Use strong firewall rules
- [ ] Regular security updates for Node.js
- [ ] Use HTTPS reverse proxy (Nginx/Apache)
- [ ] Monitor logs for errors/attacks
- [ ] Keep dependencies updated (`npm audit fix`)
- [ ] Use environment variables for sensitive config
- [ ] Setup rate limiting (Nginx)

## Troubleshooting

### Application won't start
```bash
# Check logs
npm run server

# Check if port is in use
lsof -i :3000

# Use different port
PORT=4000 npm run server
```

### Low performance
- Check server resources
- Enable gzip compression
- Use CDN for static files
- Monitor chart rendering (limit data points)
- Check database/API response times

### Build errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Support

For production deployment help:
- Check Node.js documentation
- Review Nginx configuration guides
- Consult cloud provider documentation
- Check application logs for specific errors

---

**Ready to deploy?** Run `npm start` locally first to verify everything works!
