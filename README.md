# Affiliate Marketing Chain

A Next.js application with PostgreSQL backend for managing affiliate marketing offer chains with user tracking.

## 🚀 Features

- **Offer Chain Flow**: 10 sequential offers with decline/accept actions
- **User Tracking**: Automatic lead generation and action logging
- **Real-time Database**: PostgreSQL with Prisma ORM
- **Admin API**: Protected endpoints for offer management
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 📁 Project Structure

```
affiliate-chain/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── offers/          # Public: Get offers
│   │   │   ├── leads/           # Public: Lead tracking
│   │   │   ├── actions/         # Public: Action logging
│   │   │   └── admin/           # Protected: Admin endpoints
│   │   ├── page.js              # Main page
│   │   └── layout.js            # App layout
│   ├── components/
│   │   ├── OfferCard.jsx        # Individual offer display
│   │   ├── ProgressChain.jsx    # Progress indicator
│   │   └── OfferChainContainer.jsx # Main container
│   ├── hooks/
│   │   └── useUserSession.js    # Session management
│   ├── services/
│   │   └── apiService.js        # API calls
│   └── lib/
│       ├── db.js                # Database client
│       └── auth.js              # Admin authentication
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.js                  # Initial data
├── docker-compose.yml           # PostgreSQL container
└── .env                         # Environment variables
```

## 🗄️ Database Schema

### Tables
- **leads**: User tracking (IP-based)
- **actions**: User interactions (VIEW, DECLINE, SUBMIT)
- **offers**: Affiliate offers content

## 🛠️ Setup & Installation

### 1. Clone and Install
```bash
git clone <repo>
cd affiliate-chain
npm install
```

### 2. Start Database
```bash
npm run db:up
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 3. Start Application
```bash
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Database GUI**: http://localhost:5555 (`npm run db:studio`)
- **pgAdmin**: http://localhost:8080 (admin@affiliate.com / admin123)

## 🔗 API Endpoints

### Public APIs
- `GET /api/offers` - Get active offers
- `POST /api/leads` - Create/get lead
- `POST /api/actions` - Log user actions

### Protected APIs (Basic Auth: admin/admin123)
- `GET /api/admin/offers` - List all offers
- `POST /api/admin/offers` - Create offer
- `PUT /api/admin/offers/[id]` - Update offer
- `DELETE /api/admin/offers/[id]` - Delete offer
- `PUT /api/admin/offers/reorder` - Reorder offers

## 🧪 Testing

### Frontend Flow
1. Visit http://localhost:3000
2. See offer #1 with progress chain
3. Click "Decline" → moves to next offer
4. Click "Accept" → shows affiliate URL alert
5. Watch debug panel for tracking info

### API Testing
```bash
# Test public API
curl http://localhost:3000/api/offers

# Test protected API
curl -u admin:admin123 http://localhost:3000/api/admin/offers
```

### Database Verification
```bash
npm run db:studio
```
Check `leads`, `actions`, and `offers` tables for data.

## 📊 User Flow

1. **User visits site** → Lead automatically created (IP-based)
2. **Offer displayed** → VIEW action logged
3. **User clicks Decline** → DECLINE action logged, next offer shown
4. **User clicks Accept** → SUBMIT action logged, redirect to affiliate URL
5. **After 10 offers** → Loop back to offer #1

## 🔧 Available Scripts

```bash
# Database
npm run db:up          # Start PostgreSQL
npm run db:down        # Stop database
npm run db:migrate     # Run migrations
npm run db:seed        # Seed with sample data
npm run db:studio      # Open database GUI

# Development
npm run dev            # Start dev server
npm run build          # Build for production
npm run start          # Start production server
```

## 🔐 Admin Credentials

- **Username**: admin
- **Password**: admin123

## 🌍 Environment Variables

```bash
DATABASE_URL="postgresql://affiliate_user:affiliate_password123@localhost:5432/affiliate_chain"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

## 📈 Next Steps

- [ ] Admin panel UI for offer management
- [ ] Advanced analytics dashboard
- [ ] A/B testing capabilities
- [ ] Email capture integration
- [ ] Mobile optimization
- [ ] Production deployment

## 🐛 Troubleshooting

### Database Issues
```bash
npm run db:reset       # Reset database completely
npm run db:logs        # Check database logs
```

### API Issues
- Check console logs for error messages
- Verify database is running: `npm run db:logs`
- Test endpoints manually in browser/Postman

### Frontend Issues
```bash
rm -rf .next node_modules
npm install
npm run dev
```