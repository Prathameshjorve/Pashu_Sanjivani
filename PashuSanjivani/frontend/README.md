# PashuSanjivani Frontend

Modern Next.js frontend for livestock health reporting with shadcn/ui components.

## Features

- ✨ **Modern UI**: Built with Next.js 15 and shadcn/ui components
- 🌍 **Multi-language Support**: English, Hindi, Marathi with i18next
- 🔐 **Authentication**: JWT-based login/signup with Zustand state management
- 📦 **Form Handling**: React Hook Form with Zod validation
- 🎨 **Styling**: Tailwind CSS with dark mode support
- 📱 **Responsive**: Mobile-first responsive design
- ♿ **Accessible**: WCAG compliant components

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **i18n**: i18next
- **API**: Axios

## Project Structure

```
frontend/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Auth routes (login, signup)
│   ├── dashboard/               # Main dashboard
│   ├── predict/                 # Prediction form
│   ├── reports/                 # Reports listing
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home redirect
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # shadcn UI components
│   ├── forms/                   # Form components
│   └── navbar.tsx               # Navigation bar
├── lib/
│   ├── api.ts                   # API client
│   ├── store.ts                 # Zustand stores
│   └── utils.ts                 # Utility functions
├── hooks/
│   ├── useAuth.ts               # Auth hook
│   └── useProtectedRoute.ts     # Route protection
├── i18n/
│   ├── config.ts                # i18next config
│   ├── en.json                  # English translations
│   ├── hi.json                  # Hindi translations
│   └── mar.json                 # Marathi translations
└── public/                       # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Pages

### Public Pages
- `/login` - User login
- `/signup` - User registration

### Protected Pages (require authentication)
- `/` - Home (redirects to dashboard)
- `/dashboard` - Main dashboard with recent reports
- `/predict` - New prediction form
- `/reports` - All predictions history

## Components

### UI Components (from shadcn)
- Button
- Card
- Input
- Textarea
- Select
- AlertDialog
- Alert
- Badge

### Custom Components
- **Navbar**: Navigation with language switcher
- **Forms**: Structured form components

## API Integration

The frontend connects to the backend API with the following endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/predict` - Submit prediction (protected)
- `GET /api/reports` - Get all reports (protected)

## Authentication Flow

1. User signs up/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token added to all protected requests via interceptor
5. Automatic logout on token expiry

## Internationalization

Switch languages in the navbar (EN / HI / MAR):

- **English (en)**: English translation
- **Hindi (hi)**: Hindi translation
- **Marathi (mar)**: Marathi translation

## Styling

Uses Tailwind CSS with custom color variables:

```css
--primary: Green (#22c55e)
--secondary: Dark Blue
--destructive: Red
--muted: Gray
```

## Development Tips

1. **Add new page**: Create folder in `/app` with `page.tsx`
2. **Add component**: Create in `/components` folder
3. **Add translation**: Update JSON files in `/i18n`
4. **API error handling**: Check `/lib/api.ts` interceptors
5. **Protected routes**: Use `useProtectedRoute()` hook

## Troubleshooting

### Build fails
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### API connection error
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Language not switching
- Clear browser localStorage
- Check i18n translations are complete

## Future Enhancements

- [ ] Dark mode toggle
- [ ] User profile management
- [ ] Report filtering & search
- [ ] Image upload preview
- [ ] PDF report export
- [ ] Real-time notifications
- [ ] Analytics dashboard
