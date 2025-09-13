# Setup Test Instructions

## Prerequisites
You'll need Node.js installed to run this project. If Node.js isn't available:

1. **Install Node.js** from https://nodejs.org/
2. **Verify installation** with `node --version` and `npm --version`

## Testing the Setup

### 1. Test the CLI Script
```bash
node .kiro/generatePlan.js "Math" "Beginner"
```

Expected output: JSON with study plan and resources

### 2. Install Dependencies and Run Backend
```bash
npm install
npm run dev
```

Backend should start on http://localhost:3001

### 3. Install Frontend Dependencies and Run
```bash
cd frontend
npm install
npm run dev
```

Frontend should start on http://localhost:3000

### 4. Test API Endpoint
Visit: http://localhost:3001/api/plan?subject=Math&level=Beginner

## Project Structure Verification
- ✅ Backend server (server.js) on port 3001
- ✅ Frontend (React + Vite) on port 3000 with proxy to backend
- ✅ CLI script (.kiro/generatePlan.js) for direct testing
- ✅ API endpoint /api/plan that uses the same logic as CLI
- ✅ Frontend proxies /api calls to backend via Vite config

## Key Features
1. **CLI Usage**: `node .kiro/generatePlan.js "Subject" "Level"`
2. **API Usage**: GET `/api/plan?subject=Subject&level=Level`
3. **Frontend**: Interactive form that calls the API
4. **Shared Logic**: Both CLI and API use the same generatePlan function