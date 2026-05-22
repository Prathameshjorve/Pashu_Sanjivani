# Pashu Sanjivani 🐄

Full-stack livestock health reporting and disease prediction system with multi-language support.

## 🌟 Features

### Backend
- Node.js + Express + PostgreSQL
- JWT authentication with bcryptjs
- Multer image file uploads
- CORS enabled
- RESTful API design
- Database schema with users & reports tables

### Frontend
- **Next.js 15** with App Router
- **React 18** component architecture
- **shadcn/ui** style components with Tailwind CSS
- **TypeScript** for type safety
- **Zustand** for state management
- **i18next** for internationalization (EN/HI/MAR)
- **Axios** with JWT interceptors
- Responsive mobile-first design
- Dark mode support ready

### Core Features
✅ User authentication (signup/login)  
✅ Protected API routes  
✅ Livestock symptom reporting  
✅ Disease prediction form  
✅ Report history viewing  
✅ Multi-language UI (English, Hindi, Marathi)  
✅ Image upload support  
✅ Real-time form validation  

## 📋 Requirements

- Node.js 18+
- PostgreSQL (for backend)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env and set DATABASE_URL:
# DATABASE_URL=postgres://user:password@localhost:5432/pashu_db
```

Start backend:
```bash
npm run dev
```

Backend runs on: **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend
npm install

# .env.local is pre-configured
npm run dev
```

Frontend runs on: **http://localhost:3000**

### 3. Access the Application

Open your browser: **http://localhost:3000**

- New users: Click "Sign Up" to register
- Existing users: Click login
- After login, explore:
  - **Dashboard** - View overview and recent reports
  - **Predict** - Submit new livestock health report
  - **Reports** - View all historical reports
  - **Language** - Switch between EN, HI, MAR

## 📁 Project Structure

```
PashuSanjivani/
├── backend/                    # Express.js API
│   ├── server.js              # Main entry point
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment template
│   ├── config/                # Database config
│   ├── controllers/           # Route handlers
│   ├── routes/                # API routes
│   ├── middleware/            # Auth & upload
│   ├── models/                # Database models
│   ├── services/              # Business logic
│   └── sql/                   # Database schema
│
└── frontend/                   # Next.js App
    ├── app/                   # Next.js pages
    │   ├── (auth)/            # Login & signup
    │   ├── dashboard/         # Main dashboard
    │   ├── predict/           # Prediction form
    │   ├── reports/           # Reports list
    │   └── layout.tsx         # Root layout
    ├── components/            # React components
    │   ├── ui/                # UI library
    │   └── navbar.tsx         # Navigation
    ├── lib/                   # Utilities
    │   ├── api.ts             # API client
    │   └── store.ts           # State management
    ├── hooks/                 # Custom hooks
    ├── i18n/                  # Translations
    │   ├── en.json
    │   ├── hi.json
    │   └── mar.json
    ├── package.json           # Dependencies
    └── README.md              # Frontend docs
```

## 🔌 API Endpoints

### Authentication (Public)
```
POST /api/auth/signup
  Body: { name, email, password }

POST /api/auth/login
  Body: { email, password }
  Response: { token }
```

### Predictions (Protected - Requires JWT Token)
```
POST /api/predict
  Headers: Authorization: Bearer <token>
  Body: FormData { image, animal_type, symptoms }
  Response: { animal, disease, severity, suggestion }

GET /api/reports
  Headers: Authorization: Bearer <token>
  Response: [ { id, user_id, animal_type, symptoms, disease, severity, suggestion, created_at } ]
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password_hash` - Hashed password
- `created_at` - Registration timestamp

### Reports Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `animal_type` - Type of livestock
- `symptoms` - Reported symptoms
- `disease` - Predicted disease
- `severity` - Severity level
- `suggestion` - Veterinary suggestion
- `image_path` - Path to uploaded image
- `created_at` - Report timestamp

See `backend/sql/schema.sql` for full schema.

## 🎨 Frontend Technologies

| Feature | Technology |
|---------|-----------|
| Framework | Next.js 15 |
| Language | TypeScript |
| UI Components | shadcn/ui style |
| Styling | Tailwind CSS 3.4 |
| State Management | Zustand |
| Forms | React Hook Form |
| Validation | Zod |
| HTTP Client | Axios |
| i18n | i18next |
| Icons | lucide-react |

## 📚 Documentation

- **[Backend Information](backend/README.md)** - Backend setup and architecture
- **[Frontend Guide](frontend/README.md)** - Frontend features and components
- **[Frontend Setup](frontend/SETUP_GUIDE.md)** - Detailed setup instructions
- **[Build Summary](BUILD_SUMMARY.md)** - Complete project overview
- **[Files Manifest](frontend/FILES_MANIFEST.md)** - All created files listing

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation (Zod)
- ✅ Environment variable configuration
- ✅ Secure token storage

## 🚢 Deployment

### Frontend Deployment Options
- **Vercel** (easiest, auto-from-git)
- **Netlify** (automated builds)
- **AWS Amplify**
- **Self-hosted** (Docker/Node)

### Backend Deployment Options
- **AWS EC2**
- **Heroku**
- **DigitalOcean**
- **Railway**
- **Docker**

See frontend/SETUP_GUIDE.md for detailed deployment instructions.

## 🐛 Troubleshooting

### Backend won't connect to database
- Verify PostgreSQL is running
- Check `DATABASE_URL` in backend `.env`
- Run SQL schema: `psql -U postgres -d pashu_db -f backend/sql/schema.sql`

### Frontend can't reach backend
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify CORS is enabled in backend

### Build errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

See **[SETUP_GUIDE.md](frontend/SETUP_GUIDE.md)** for more troubleshooting.

## 📝 Development Workflow

### Create New Page
1. Create folder in `frontend/app/` folder
2. Add `page.tsx` with component
3. Use `useProtectedRoute()` for protected pages

### Add New Component
1. Create in `frontend/components/`
2. Use shadcn/ui components as building blocks
3. Style with Tailwind CSS

### Add Translation
1. Add key to all JSON files in `frontend/i18n/`
2. Import `useTranslation()` in component
3. Use `t('key.path')` to translate

## 📊 Project Statistics

- **Backend**: 10+ files, Express API
- **Frontend**: 40+ files, Next.js app
- **Languages**: 3 (English, Hindi, Marathi)
- **API Endpoints**: 4 main endpoints
- **UI Components**: 8+ custom components
- **Database Tables**: 2 (users, reports)
- **Dependencies**: 142 packages

## 🎯 Future Enhancements

- [ ] Real ML model for disease prediction
- [ ] Cloud image storage (AWS S3)
- [ ] PDF report generation
- [ ] Email notifications
- [ ] User profile management
- [ ] Admin dashboard
- [ ] Analytics dashboard
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Offline support

## 📝 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For issues and questions:
1. Check troubleshooting section above
2. Review documentation in respective folders
3. Check inline code comments
4. Open an issue on GitHub

---

**Built with ❤️ for livestock farmers**

For farmers, by farmers. Improving livestock health, one report at a time. 🌾
