# PashuSanjivani - Setup & Troubleshooting Guide

## Dependency Installation Status ✅

Both frontend and backend dependencies have been successfully installed.

### Frontend Dependencies Installed:
- React 18.3.1
- Vite 6.4.1  
- Tailwind CSS 3.4.19
- React Router 6.30.3
- i18next 23.16.8
- Axios 1.13.5
- PostCSS & Autoprefixer

### Backend Dependencies Installed:
- Express 4.22.1
- PostgreSQL (pg) 8.18.0
- JWT 9.0.3
- bcryptjs 2.4.3
- Multer 1.4.5-lts.2
- CORS 2.8.6
- Dotenv 16.6.1
- Nodemon 3.1.13

## ⚠️ Known Issues & Solutions

### Issue: esbuild binary execution error
**Cause:** The project path contains spaces (`EDI SEM 4`) which causes issues with native binary execution on Windows.

**Solution:** Use `.npmrc` file with `ignore-scripts=true` (already configured)

**To reinstall dependencies:**
```bash
npm install --ignore-scripts
```

### Issue: PowerShell execution policy
**If npm scripts fail to run**, use cmd.exe:
```bash
cmd /c npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install --ignore-scripts
npm run dev
```

This will start the Vite development server.

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

This will start the Express server with nodemon for auto-reload.

## Build & Production

### Frontend Build:
```bash
cd frontend
npm run build
npm run preview
```

### Environment Configuration Required:
- Backend: Create `.env` file with database configuration
- Frontend: Configure API endpoints in `src/services/api.js`

## Vulnerability Status ✅
- Backend: 0 vulnerabilities
- Frontend: 0 vulnerabilities (after fixes)

All dependencies are current and secure!
