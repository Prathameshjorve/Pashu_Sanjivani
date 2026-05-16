# PashuSanjivani Frontend - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Navigate to: **http://localhost:3000**

## Project Structure

```
frontend/
├── app/                          # Next.js pages & routes
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Signup page
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── predict/page.tsx         # Prediction form
│   ├── reports/page.tsx         # Reports listing
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── providers.tsx            # App providers
├── components/
│   ├── ui/                      # UI components (Button, Card, Input, etc.)
│   ├── forms/                   # Form components
│   └── navbar.tsx               # Navigation bar
├── lib/
│   ├── api.ts                   # Axios API client with interceptors
│   ├── store.ts                 # Zustand auth & report stores
│   └── utils.ts                 # Utility functions
├── hooks/
│   ├── useAuth.ts               # Authentication hook
│   └── useProtectedRoute.ts     # Route protection hook
├── i18n/
│   ├── config.ts                # i18next configuration
│   ├── en.json                  # English translations
│   ├── hi.json                  # Hindi translations
│   └── mar.json                 # Marathi translations
└── public/                       # Static files
```

## Features

### Pages

#### Public (No auth required)
- **Login** (`/login`): User login form
- **Signup** (`/signup`): User registration form

#### Protected (Auth required)
- **Dashboard** (`/dashboard`): Overview with recent reports
- **Predict** (`/predict`): Submit new predictions
- **Reports** (`/reports`): View all predictions

### Authentication

- JWT-based authentication
- Token stored in localStorage
- Automatic token injection in API requests
- Auto-logout on token expiry
- Protected route guards

### Internationalization (i18n)

Switch languages using navbar buttons:
- **EN** - English
- **HI** - Hindi  
- **MAR** - Marathi

Powered by **i18next** with complete translations for all pages.

### State Management

Uses **Zustand** for:
- Auth state (user, token)
- Report caching
- Language preference

### UI Components

Built with **shadcn/ui** utilities:
- Button
- Card
- Input
- Textarea
- Select
- Alert
- Badge
- And more...

### Styling

- **Tailwind CSS** for utility-first styling
- CSS variables for theming
- Dark mode support
- Responsive mobile-first design

## Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Production
npm run build           # Build for production
npm start               # Start production server

# Linting
npm run lint            # Run ESLint
```

## Troubleshooting

### Issue: "An Application Control policy has blocked this file"

**Cause**: Windows Application Control Policy blocking native binary execution.

**Solutions**:

#### Option 1: Disable Policy (Admin Required)
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
```

#### Option 2: Use cmd instead of PowerShell
```bash
cmd /c npm run dev
```

#### Option 3: Use compiler instead of swc
```bash
npm install --save-dev @swc/core swc-wasm-web
```

### Issue: "Unknown compiler option 'skip'"

**Status**: Fixed in tsconfig.json

**If still occurs**: 
- Delete `tsconfig.json`
- Run `npm run dev` to generate new one
- Rename to tsconfig.json

### Issue: Can't connect to backend

**Check**:
```bash
# Verify backend is running
curl http://localhost:5000

# Check API URL in .env.local
cat .env.local  # Should show:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Issue: Styles not loading

- Clear `.next` folder: `rm -rf .next`
- Clear browser cache: Hard refresh (Ctrl+Shift+R)
- Reinstall: `rm -rf node_modules && npm install`

### Issue: Language changes not reflecting

- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Reload page: Browser refresh

## API Integration

### Available Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/predict` | Yes | Submit prediction |
| GET | `/api/reports` | Yes | Get all reports |

### Making API Calls

```typescript
// Using the API client
import { authAPI, predictAPI } from '@/lib/api';

// Login
const response = await authAPI.login({ email, password });
const token = response.data.token;

// Get predictions
const reports = await predictAPI.getReports();
```

### Error Handling

API client automatically:
- Adds JWT token to protected requests
- Handles CORS
- Logs errors to console
- Returns error messages from backend

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub first
git push origin main

# Connect to Vercel dashboard
# Auto-deploys on push
```

### Manual Server

```bash
# Build
npm run build

# Start
npm start

# Or use PM2
npm install -g pm2
pm2 start "npm start" --name "pashu-frontend"
```

### Environment Variables

Set on hosting platform:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Development Workflow

### Adding a New Page

1. Create folder in `app/` (e.g., `app/newpage/`)
2. Add `page.tsx`:

```typescript
'use client';
import Navbar from '@/components/navbar';

export default function NewPage() {
  return (
    <div>
      <Navbar />
      {/* Your content */}
    </div>
  );
}
```

### Adding a Component

1. Create in `components/` folder
2. Import shadcn components as needed
3. Use Tailwind for styling

### Adding Translations

1. Add key to all JSON files in `i18n/`:
   - `en.json`
   - `hi.json`
   - `mar.json`

2. Use in components:

```typescript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('key.path')}</h1>;
}
```

## Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Automatic with Next.js
3. **API Caching**: Implement in stores as needed
4. **Bundle Analysis**:
   ```bash
   npm run build --analyze
   ```

## Security

- ✅ JWT token-based auth
- ✅ CORS enabled on backend
- ✅ Input validation with Zod
- ✅ Protected API routes
- ✅ No sensitive data in git (use .env)
- ✅ HTTPS recommended for production

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [i18next](https://www.i18next.com)
- [Zustand](https://github.com/pmndrs/zustand)

## Support

For issues:
1. Check troubleshooting section
2. Check browser console for errors
3. Verify backend is running
4. Clear cache and reinstall dependencies
