# 🛠️ Frontier Xchange Setup Guide

## Quick Start (5 minutes)

### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/yourusername/frontier-xchange.git
cd frontier-xchange

# Install frontend dependencies
cd frontier-xchange
npm install

# Install backend dependencies (optional)
cd ../backend
pip install fastapi uvicorn pydantic python-dotenv
```

### 2. Configure Environment
Create `frontier-xchange/.env`:
```env
# Supabase Configuration (Optional - uses demo backend if not provided)
VITE_SUPABASE_URL=https://oipoihniimisvdzqvkem.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run the Application
```bash
# Terminal 1: Start backend (optional)
cd backend
python enhanced_demo_app.py

# Terminal 2: Start frontend
cd frontier-xchange
npm run dev
```

Visit `http://localhost:5173` 🎉

## Detailed Setup Instructions

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Node.js | 18.0.0 | 20.0.0+ |
| Python | 3.10 | 3.12+ |
| npm | 8.0.0 | 10.0.0+ |
| RAM | 4GB | 8GB+ |
| Disk Space | 500MB | 1GB+ |

### Step 1: Environment Setup

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Python
brew install node python@3.12

# Verify installations
node --version  # Should show v18.0.0 or higher
python3 --version  # Should show 3.10 or higher
```

#### Windows
```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install Node.js and Python
choco install nodejs python

# Verify installations
node --version
python --version
```

#### Linux (Ubuntu/Debian)
```bash
# Update package manager
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt install python3.12 python3-pip

# Verify installations
node --version
python3 --version
```

### Step 2: Supabase Setup (Optional)

If you want to use Supabase instead of the demo backend:

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Database**
   ```sql
   -- Create jobs table
   CREATE TABLE jobs (
     id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     category TEXT NOT NULL,
     description TEXT,
     budget_usd DECIMAL(10,2),
     currency TEXT DEFAULT 'USD',
     deadline_iso TIMESTAMP,
     status TEXT DEFAULT 'OPEN',
     payment_type TEXT DEFAULT 'MONETARY',
     in_kind_description TEXT,
     posted_by_id TEXT NOT NULL,
     posted_by_email TEXT,
     claimed_by_id TEXT,
     claimed_at_iso TIMESTAMP,
     completed_at_iso TIMESTAMP,
     deliverable_url TEXT,
     service_type TEXT,
     is_standard_rate BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Create job_offers table
   CREATE TABLE job_offers (
     id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
     job_id TEXT REFERENCES jobs(id) ON DELETE CASCADE,
     offered_by_id TEXT NOT NULL,
     offered_by_email TEXT,
     offer_amount_usd DECIMAL(10,2),
     offer_payment_type TEXT DEFAULT 'MONETARY',
     offer_in_kind_description TEXT,
     message TEXT,
     status TEXT DEFAULT 'PENDING',
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Create profiles table
   CREATE TABLE profiles (
     id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id TEXT UNIQUE NOT NULL,
     email TEXT,
     full_name TEXT,
     avatar_url TEXT,
     role TEXT DEFAULT 'member',
     bio TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Enable Row Level Security**
   ```sql
   -- Enable RLS
   ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Jobs are viewable by everyone" 
     ON jobs FOR SELECT 
     USING (true);

   CREATE POLICY "Users can create jobs" 
     ON jobs FOR INSERT 
     WITH CHECK (auth.uid()::text = posted_by_id);

   CREATE POLICY "Users can update their own jobs" 
     ON jobs FOR UPDATE 
     USING (auth.uid()::text = posted_by_id);
   ```

4. **Configure Authentication**
   - Go to Authentication → Providers
   - Enable Google OAuth
   - Add your OAuth credentials

### Step 3: Frontend Configuration

#### Development Settings
```javascript
// vite.config.ts
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

#### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Step 4: Backend Configuration

#### Demo Backend Settings
```python
# backend/enhanced_demo_app.py
app = FastAPI(
    title="Frontier Xchange API",
    version="2.0.0",
    docs_url="/docs",  # Swagger UI at http://localhost:8000/docs
    redoc_url="/redoc"  # ReDoc at http://localhost:8000/redoc
)
```

#### Environment Variables
Create `backend/.env`:
```env
PORT=8000
CORS_ORIGINS=["http://localhost:5173", "http://localhost:8080"]
DEBUG=true
```

### Step 5: Testing Setup

#### Frontend Tests
```bash
# Install test dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

#### Backend Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

#### E2E Tests
```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

## Troubleshooting

### Common Issues and Solutions

#### Port Already in Use
```bash
# Find process using port
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

#### CORS Errors
Add to backend configuration:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Database Connection Issues
Check Supabase configuration:
```javascript
// Verify connection
const { data, error } = await supabase
  .from('jobs')
  .select('count')
  .single();

if (error) {
  console.error('Database connection failed:', error);
}
```

### Performance Optimization

#### Frontend
```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize imports
npm install -D @vitejs/plugin-react-swc
```

#### Backend
```python
# Use connection pooling
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Cleanup
```

### Security Checklist

- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] API keys not committed to git
- [ ] Row-level security enabled (Supabase)
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] HTTPS configured for production

## Docker Setup (Optional)

### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "enhanced_demo_app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontier-xchange
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=false
```

## Deployment

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Render (Backend)
1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: frontier-xchange-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn enhanced_demo_app:app --host 0.0.0.0 --port $PORT"
```

2. Connect GitHub repository
3. Deploy from Render dashboard

### DigitalOcean App Platform
```yaml
name: frontier-xchange
services:
  - name: frontend
    github:
      repo: yourusername/frontier-xchange
      branch: main
      deploy_on_push: true
    build_command: npm run build
    run_command: npm run preview
    
  - name: backend
    github:
      repo: yourusername/frontier-xchange
      branch: main
      deploy_on_push: true
    build_command: pip install -r requirements.txt
    run_command: uvicorn enhanced_demo_app:app --host 0.0.0.0 --port 8000
```

## Monitoring & Maintenance

### Health Checks
```bash
# Frontend health
curl http://localhost:5173

# Backend health
curl http://localhost:8000/health
```

### Logs
```bash
# Frontend logs
npm run dev 2>&1 | tee frontend.log

# Backend logs
python enhanced_demo_app.py 2>&1 | tee backend.log
```

### Database Backups (Supabase)
```bash
# Export data
pg_dump postgresql://[CONNECTION_STRING] > backup.sql

# Import data
psql postgresql://[CONNECTION_STRING] < backup.sql
```

## Support

For help and support:
- 📖 Check the [README](README.md)
- 📚 Read the [API Documentation](API_DOCUMENTATION.md)
- 🐛 Report issues on [GitHub Issues](https://github.com/yourusername/frontier-xchange/issues)
- 💬 Join our [Discord Community](https://discord.gg/yourinvite)

---

Happy building! 🚀