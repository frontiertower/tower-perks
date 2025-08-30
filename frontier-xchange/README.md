# 🚀 Frontier Xchange - Universal Job Marketplace

A comprehensive Tower member job marketplace platform that enables all members to create jobs, submit offers, negotiate terms, and complete transactions with multiple payment options.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage Tutorial](#usage-tutorial)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Deployment](#deployment)

## 🎯 Overview

Frontier Xchange is a modern web application that connects Tower members through a sophisticated job marketplace. Built with React, TypeScript, and Supabase, it provides real-time updates, advanced negotiation features, and flexible payment options.

### Key Highlights
- **Universal Access**: All members can post and claim jobs
- **Flexible Payments**: Support for monetary, in-kind, and hybrid payments
- **Real-time Updates**: Live notifications via Supabase subscriptions
- **Advanced Negotiations**: Counter-offer system with full conversation tracking
- **Professional UI**: Clean, intuitive 6-tab interface

## ✨ Features

### 🛠️ Core Functionality
- **Job Creation Wizard**: Step-by-step job posting with payment flexibility
- **6-Tab Marketplace Interface**:
  - Browse Jobs - Discover opportunities
  - Create Job - Post new jobs
  - My Posted Jobs - Manage your listings
  - My Offers - Track your bids
  - Active Work - Monitor in-progress jobs
  - History - View completed transactions

### 💰 Payment System
- **Three Payment Types**:
  - Monetary (Cash payments)
  - In-Kind (Trade/Barter)
  - Hybrid (Cash + Trade)
- **Standard Service Rates**:
  - Bambu Lab X1 Carbon: $5/hour
  - Bambu Lab H2D: $7/hour
  - Laser Cutting: $20/hour

### 🤝 Negotiation Features
- Counter-offer system
- Offer management panel
- Full conversation history
- Accept/Reject/Withdraw options

### 🔄 Real-time Capabilities
- Live job updates
- Instant offer notifications
- Activity feed banner
- WebSocket subscriptions

## 🏗️ Architecture

### Frontend Stack
```
React 18 + TypeScript
├── Vite (Build tool)
├── Tailwind CSS + shadcn/ui (Styling)
├── Zustand (State management)
├── React Query (Server state)
├── Supabase Client (Real-time DB)
└── React Router (Navigation)
```

### Backend Architecture
```
Primary: Supabase (Serverless)
├── PostgreSQL Database
├── Row-level Security
├── Real-time Subscriptions
└── Google OAuth

Fallback: FastAPI Demo Backend
├── Python 3.12+
├── In-memory storage
├── Supabase-compatible API
└── CORS enabled
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+ (for demo backend)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/frontier-xchange.git
cd frontier-xchange
```

2. **Install frontend dependencies**
```bash
cd frontier-xchange
npm install
```

3. **Set up environment variables**
Create a `.env` file in the frontend directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Install backend dependencies** (optional for demo)
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

1. **Start the backend (optional)**
```bash
cd backend
python enhanced_demo_app.py
# Backend runs on http://localhost:8000
```

2. **Start the frontend**
```bash
cd frontier-xchange
npm run dev
# Frontend runs on http://localhost:5173
```

3. **Access the application**
Open your browser and navigate to `http://localhost:5173`

## 📖 Usage Tutorial

### 1. Authentication
- Click "Continue with Google" to authenticate
- First-time users will be prompted to complete their profile

### 2. Creating a Job

1. Navigate to the **Jobs** page from the sidebar
2. Click **"Create Job"** tab or the **"Post New Job"** button
3. Follow the wizard steps:
   - **Step 1**: Enter job title and category
   - **Step 2**: Add detailed description
   - **Step 3**: Choose payment type and amount
   - **Step 4**: Set deadline (optional)
   - **Step 5**: Review and submit

Example job creation:
```javascript
{
  title: "3D Print Custom Phone Case",
  category: "3D_PRINTING",
  description: "Need a custom phone case with my logo",
  payment_type: "HYBRID",
  budget_usd: 25,
  in_kind_description: "Will provide design consultation",
  service_type: "BAMBU_X1C"
}
```

### 3. Browsing and Bidding

1. Go to **"Browse Jobs"** tab
2. Use filters to find relevant jobs:
   - Category filter
   - Payment type filter
   - Status filter
   - Search by keywords
3. Click on a job to view details
4. Submit an offer with your terms

### 4. Managing Offers (Job Poster)

1. Navigate to **"My Posted Jobs"**
2. Click **"Manage Offers"** on your job
3. Review submitted offers
4. Options for each offer:
   - ✅ Accept - Awards the job
   - ❌ Reject - Declines the offer
   - 💬 Counter - Negotiate terms

### 5. Tracking Active Work

1. Go to **"Active Work"** tab
2. View all in-progress jobs
3. Mark jobs as complete when finished
4. Submit deliverables

### 6. Job History

1. Click **"History"** tab
2. View all completed and cancelled jobs
3. See transaction history
4. Export records (coming soon)

## 🔌 API Documentation

### Base URLs
- Supabase: `https://your-project.supabase.co`
- Demo Backend: `http://localhost:8000`

### Key Endpoints

#### Jobs
```http
GET /rest/v1/jobs
POST /rest/v1/jobs
PATCH /rest/v1/jobs?id=eq.{job_id}
DELETE /rest/v1/jobs?id=eq.{job_id}
```

#### Offers
```http
GET /rest/v1/job_offers
POST /rest/v1/job_offers
PATCH /rest/v1/job_offers?id=eq.{offer_id}
```

#### Standard Rates
```http
GET /api/standard-rates
```

### Example API Calls

**Create a Job**
```bash
curl -X POST http://localhost:8000/rest/v1/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laser Cut Acrylic Sign",
    "category": "LASER_CUTTING",
    "description": "Need a 12x12 inch acrylic sign",
    "budget_usd": 40,
    "payment_type": "MONETARY",
    "posted_by_id": "user_123",
    "service_type": "LASER",
    "is_standard_rate": true
  }'
```

**Submit an Offer**
```bash
curl -X POST http://localhost:8000/rest/v1/job_offers \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "job_123",
    "offered_by_id": "user_456",
    "offer_amount_usd": 35,
    "offer_payment_type": "MONETARY",
    "message": "I can complete this by tomorrow"
  }'
```

## 🛠️ Development Guide

### Project Structure
```
frontier-xchange/
├── src/
│   ├── components/
│   │   ├── marketplace/    # Marketplace components
│   │   ├── jobs/           # Job-related components
│   │   ├── auth/           # Authentication
│   │   └── ui/             # UI components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route pages
│   ├── types/              # TypeScript definitions
│   ├── lib/                # Utilities
│   └── integrations/       # External services
├── backend/
│   └── enhanced_demo_app.py
├── public/
└── package.json
```

### Key Components

**UnifiedJobMarketplace.tsx**
- Main marketplace hub
- Manages tab navigation
- Coordinates child components

**OfferManagementPanel.tsx**
- Handles offer negotiations
- Displays offer details
- Manages counter-offers

**useRealtimeJobs.ts**
- Real-time job subscriptions
- Fallback to demo backend
- Filter management

### Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Code Style Guidelines
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

## 📦 Deployment

### Building for Production
```bash
npm run build
# Output in dist/ directory
```

### Environment Variables (Production)
```env
VITE_SUPABASE_URL=production_supabase_url
VITE_SUPABASE_ANON_KEY=production_anon_key
VITE_API_BASE_URL=production_api_url
```

### Deployment Options

1. **Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

2. **Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

3. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

## 🔒 Security Considerations

- Row-level security enabled in Supabase
- Environment variables for sensitive data
- CORS configuration for API access
- Input validation on all forms
- XSS protection via React
- SQL injection prevention via parameterized queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the Frontier Makerspace community
- Powered by Supabase, React, and TypeScript
- UI components from shadcn/ui
- Icons from Lucide React

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Join our Discord community

---

**🤖 Generated with [Claude Code](https://claude.ai/code)**

Co-Authored-By: Claude <noreply@anthropic.com>