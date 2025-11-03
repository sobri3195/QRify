# Quick Start Guide

Get up and running with Tix/Voucher Suite in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:5173
```

That's it! The app is now running locally.

## First Steps

### Generate Your First Ticket

1. The app opens on the **Generate** tab
2. Enter:
   - Number of Tickets: `5`
   - Ticket Prefix: `TEST`
   - Additional Info: `First Test` (optional)
3. Click **Generate Tickets**
4. You'll see 5 tickets with QR codes!

### Test Scanning

1. Click **Scan** tab (bottom navigation)
2. Option A - Manual Entry (easiest):
   - Type `TEST-000001` in the input field
   - Press Enter or click "Scan Manually"
   - See success message!
3. Option B - Camera Scan:
   - Click "Start Scanning"
   - Allow camera permissions
   - Point at a QR code from the tickets you generated

### View Reports

1. Click **Reports** tab
2. See your statistics:
   - Total Tickets: 5
   - Scanned: 1
   - Not Scanned: 4
   - Scan Rate: 20%
3. View the chart showing Generated vs Scanned
4. Browse the ticket table

### Configure Settings

1. Click **Settings** tab
2. Change "Organization Name" to your company name
3. Click "Save Settings"
4. Go back to Generate and create a new ticket
5. Notice your organization name appears on the ticket!

## Build for Production

```bash
# Build optimized production files
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `dist` folder, ready to deploy to Netlify!

## Deploy to Netlify (3 methods)

### Method 1: Drag & Drop (Fastest)
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder onto the page
4. Done! Your site is live

### Method 2: Git + Netlify Dashboard
1. Push code to GitHub
2. Go to https://app.netlify.com/
3. Click "Add new site" → "Import an existing project"
4. Select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Method 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run start        # Alias for dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BottomNavigation.jsx
│   ├── TicketCard.jsx
│   └── Toast.jsx
├── context/            # React Context for state management
│   └── TicketContext.jsx
├── pages/              # Main application pages
│   ├── Generate.jsx    # Ticket generation
│   ├── Scan.jsx        # QR code scanning
│   ├── Reports.jsx     # Analytics & reports
│   └── Settings.jsx    # App settings
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Features Overview

✅ **Generate Tickets** - Create 1-200 tickets at once with QR codes
✅ **Print Ready** - Professional print layout (use Print button)
✅ **Scan QR Codes** - Use webcam or manual entry
✅ **Duplicate Detection** - Automatically warn about re-scanned tickets
✅ **Analytics** - View statistics and charts
✅ **Export/Import** - Backup and restore data as JSON
✅ **Mobile Friendly** - Responsive design works on all devices
✅ **Offline Storage** - Data persists in localStorage
✅ **Undo Feature** - Undo last ticket generation

## Browser Compatibility

- ✅ Chrome/Edge (recommended for camera scanning)
- ✅ Firefox
- ✅ Safari (iOS 11+)
- ✅ Mobile browsers

**Note**: Camera scanning requires HTTPS (Netlify provides this automatically)

## Troubleshooting

### Port already in use?
```bash
# Kill process on port 5173
npx kill-port 5173

# Or specify different port
npm run dev -- --port 3000
```

### Build fails?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Camera not working?
- Ensure you're using HTTPS (required for camera access)
- Check browser permissions
- Try different browser (Chrome recommended)
- Use manual entry as fallback

## Next Steps

📖 Read [README.md](README.md) for full documentation
🚀 See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment details
🎯 Follow [DEMO_GUIDE.md](DEMO_GUIDE.md) for feature demo
🔧 Check [API_INTEGRATION.md](API_INTEGRATION.md) for backend setup

## Need Help?

- Check the README for detailed information
- Review error messages in browser console (F12)
- Ensure you're using Node.js 18 or higher
- Try clearing browser cache/localStorage

## Quick Tips

💡 **Tip 1**: Use Ctrl+P (or Cmd+P on Mac) to print tickets directly

💡 **Tip 2**: Export your data regularly from Settings tab as backup

💡 **Tip 3**: Use manual scan entry if you don't have camera access

💡 **Tip 4**: The app works offline - perfect for events with poor connectivity

💡 **Tip 5**: Filter tickets in Reports tab to see who hasn't checked in

---

**You're all set!** 🎉 Start generating tickets and have fun!
