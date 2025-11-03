# Deployment Guide - Render.com

H°Ûng d«n chi ti¿t Ã deploy **LCT Node.js Core** lên Render.com.

## =Ë Yêu c§u tr°Ûc khi deploy

- Tài kho£n Render.com (miÅn phí)
- Repository GitHub/GitLab vÛi source code
- PostgreSQL database trên Render (s½ t¡o trong b°Ûc ti¿p theo)

## =Ä B°Ûc 1: T¡o PostgreSQL Database trên Render

1. ng nh­p vào [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** ’ ChÍn **"PostgreSQL"**
3. C¥u hình database:
   - **Name**: `lct-nodejs-db` (ho·c tên khác)
   - **Database**: `lct_nodejs_core`
   - **User**: (Ã m·c Ënh)
   - **Region**: `Singapore`
   - **PostgreSQL Version**: `16` (ho·c latest)
   - **Plan**: `Free`
4. Click **"Create Database"**
5. ãi database khßi t¡o (1-2 phút)
6. Sau khi t¡o xong, vào database detail page và **copy Internal Database URL**
   - URL có d¡ng: `postgresql://username:password@host:5432/database`
   - **L¯U Ý**: Dùng **Internal Database URL**, KHÔNG dùng External URL

## =€ B°Ûc 2: T¡o migrations cho Prisma

**QUAN TRÌNG**: Ph£i t¡o migrations tr°Ûc khi deploy!

```bash
# T¡o migration §u tiên
npx prisma migrate dev --name init

# KiÃm tra migrations ã °ãc t¡o
ls prisma/migrations
```

B¡n s½ th¥y folder mÛi trong `prisma/migrations/` vÛi file `migration.sql`.

## =æ B°Ûc 3: Commit và Push code lên GitHub

```bash
# Add t¥t c£ files
git add .

# Commit vÛi message
git commit -m "feat: prepare for Render deployment"

# Push lên GitHub
git push origin main
```

**L°u ý**: £m b£o file `render.yaml`, `.env.example`, và `prisma/migrations/` ã °ãc commit.

## < B°Ûc 4: C¥u hình Web Service trên Render

### Truy c­p service hiÇn t¡i cça b¡n:
https://dashboard.render.com/web/srv-d445nceuk2gs739qgf2g

### C¥u hình Settings:

1. Vào tab **"Settings"**
2. KiÃm tra các thông tin sau:

**Build & Deploy:**
- **Build Command**:
  ```bash
  npm ci && npx prisma generate && npx prisma migrate deploy
  ```
- **Start Command**:
  ```bash
  npm start
  ```

**Instance:**
- **Region**: `Singapore`
- **Instance Type**: `Free`

## = B°Ûc 5: C¥u hình Environment Variables

Vào tab **"Environment"** cça Web Service, thêm/kiÃm tra các bi¿n sau:

### Required Variables (B¯t buÙc):

```env
NODE_ENV=production
APP_NAME=LCT-NODEJS-CORE
DATABASE_URL=<Internal Database URL të b°Ûc 1>
JWT_SECRET=<generate random string - xem bên d°Ûi>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<generate random string khác>
JWT_REFRESH_EXPIRES_IN=30d
DISABLE_REDIS=true
```

### Generate JWT Secrets (Secure):

**Cách 1 - OpenSSL (Linux/Mac/Git Bash):**
```bash
openssl rand -base64 32
```

**Cách 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Cách 3 - Online:**
- Truy c­p: https://generate-secret.vercel.app/32

Copy 2 strings khác nhau cho `JWT_SECRET` và `JWT_REFRESH_SECRET`.

### Optional Variables (Tùy chÍn):

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# Logging
LOG_LEVEL=info

# Storage
STORAGE_DRIVER=local
UPLOAD_PATH=./uploads
```

## = B°Ûc 6: Deploy

### Cách 1: Auto Deploy (Khuy¿n nghË)
1. Push code lên GitHub:
   ```bash
   git add .
   git commit -m "feat: configure for Render deployment"
   git push origin main
   ```
2. Render s½ tñ Ùng detect và deploy

### Cách 2: Manual Deploy
1. Vào [Service Dashboard](https://dashboard.render.com/web/srv-d445nceuk2gs739qgf2g)
2. Click nút **"Manual Deploy"** ’ **"Deploy latest commit"**
3. Theo dõi logs trong tab **"Logs"**
4. ãi cho ¿n khi th¥y message: **"Your service is live <‰"**

##  B°Ûc 7: KiÃm tra deployment

Sau khi deploy thành công, l¥y URL cça service të Render dashboard và test:

### 1. Health Check:
```bash
curl https://your-app-name.onrender.com/
```

Response mong ãi:
```json
{
  "success": true,
  "message": "LCT Node.js Core API is running",
  "version": "1.0.0",
  "timestamp": "2025-11-03T..."
}
```

### 2. API Health:
```bash
curl https://your-app-name.onrender.com/api/health
```

### 3. API Documentation:
Mß browser: `https://your-app-name.onrender.com/docs`

### 4. Test Register:
```bash
curl -X POST https://your-app-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 5. Test Login:
```bash
curl -X POST https://your-app-name.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## = Troubleshooting - Xí lý l×i th°Ýng g·p

### 1. L×i: "Application Error" / "Loading..."

**Nguyên nhân**:
- Thi¿u `PORT` environment variable
- Start command sai
- App crash khi start

**Gi£i pháp**:
- KiÃm tra logs trong Render Dashboard
- £m b£o `PORT` °ãc l¥y të `process.env.PORT`
- Verify start command: `npm start`

### 2. L×i: "Database connection failed"

**Nguyên nhân**:
- `DATABASE_URL` sai ho·c thi¿u
- Database ch°a °ãc t¡o

**Gi£i pháp**:
- Copy úng **Internal Database URL** (không ph£i External)
- Format: `postgresql://user:password@host:5432/database`
- Test connection trong logs

### 3. L×i: "Prisma Client not generated"

**Nguyên nhân**:
- Build command thi¿u `prisma generate`

**Gi£i pháp**:
- Update build command: `npm ci && npx prisma generate && npx prisma migrate deploy`
- Package.json ã có `postinstall: prisma generate`

### 4. L×i: "Migration failed"

**Nguyên nhân**:
- Ch°a có migrations trong repo
- Migrations bË gitignore

**Gi£i pháp**:
- T¡o migrations locally: `npx prisma migrate dev --name init`
- ã fix .gitignore Ã không ignore migrations
- Commit migrations vào Git
- Push l¡i lên repository

### 5. Free tier sleep after 15 minutes

**L°u ý**:
- Render Free tier s½ sleep sau 15 phút không có traffic
- Request §u tiên sau khi sleep s½ m¥t 30-60 giây Ã wake up
- ây là behavior bình th°Ýng cça free tier

## =Ê Monitoring & Logs

### Xem logs realtime:
1. Vào [Service Dashboard](https://dashboard.render.com/web/srv-d445nceuk2gs739qgf2g)
2. Click tab **"Logs"**
3. Theo dõi logs live

### Xem metrics:
1. Click tab **"Metrics"**
2. Xem CPU, Memory, Request rate

## = Update & Redeploy

### Tñ Ùng deploy:
Render tñ Ùng deploy khi b¡n push code lên branch `main`:

```bash
git add .
git commit -m "feat: update feature"
git push origin main
```

### Manual deploy:
1. Vào [Service Dashboard](https://dashboard.render.com/web/srv-d445nceuk2gs739qgf2g)
2. Click **"Manual Deploy"** ’ **"Deploy latest commit"**

### Rollback:
1. Vào tab **"Events"**
2. Tìm deployment thành công tr°Ûc ó
3. Click **"Rollback to this deploy"**

## =Ý Checklist tr°Ûc khi deploy

- [ ] ã t¡o PostgreSQL database trên Render
- [ ] ã t¡o Prisma migrations: `npx prisma migrate dev --name init`
- [ ] ã commit migrations vào Git
- [ ] File `render.yaml` ã °ãc commit
- [ ] File `.env.example` ã °ãc commit
- [ ] ã c¥u hình DATABASE_URL trong Environment Variables
- [ ] ã generate JWT_SECRET và JWT_REFRESH_SECRET
- [ ] ã set DISABLE_REDIS=true (n¿u không dùng Redis)
- [ ] Build command úng: `npm ci && npx prisma generate && npx prisma migrate deploy`
- [ ] Start command úng: `npm start`
- [ ] ã push code lên GitHub

## <‰ Hoàn thành!

Service URL: https://dashboard.render.com/web/srv-d445nceuk2gs739qgf2g

API cça b¡n s½ live t¡i:
- < **API URL**: `https://lct-nodejs-core-xxxx.onrender.com`
- =Ö **API Docs**: `https://lct-nodejs-core-xxxx.onrender.com/docs`
-  **Health Check**: `https://lct-nodejs-core-xxxx.onrender.com/api/health`

## =Ú Tài liÇu tham kh£o

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
- [Prisma on Render](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
