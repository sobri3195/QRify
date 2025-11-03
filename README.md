# Tix/Voucher Suite

A complete ticket generation and management system built with React.js, deployable to Netlify. Generate tickets with QR codes, scan them via webcam, and track analytics - all in a mobile-first, responsive interface.

## 🚀 Features

- **Generate Tickets**: Create 1-200 tickets at once with custom prefixes and QR codes
- **QR Code Generation**: Each ticket includes a unique QR code containing ticket ID and number
- **Print-Ready Layout**: Professional print layout with CSS `@media print` optimization
- **Webcam Scanning**: Scan QR codes using device camera to validate tickets
- **Duplicate Detection**: Automatically detect and warn about already-scanned tickets
- **Analytics Dashboard**: View statistics with charts (Generated vs Scanned)
- **Data Export/Import**: Migrate data via JSON files
- **Responsive Design**: Mobile-first design with bottom navigation
- **Undo Feature**: Undo the last ticket generation
- **Toast Notifications**: User-friendly feedback for all actions

## 🛠 Tech Stack

- **Framework**: React 18 with Vite
- **QR Generation**: qrcode.react
- **QR Scanning**: @zxing/browser
- **Charts**: recharts
- **Icons**: lucide-react
- **Storage**: localStorage (see backend integration below)
- **Styling**: Custom CSS with mobile-first approach

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy to Netlify

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option 2: Netlify Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

### Option 3: Manual Deploy

```bash
npm run build
# Upload the 'dist' folder to Netlify via drag-and-drop
```

## 📖 Usage Guide

### Quick Demo Scenario

1. **Generate Tickets** (Generate Tab)
   - Set count to 10
   - Enter prefix "EVENT"
   - Add extra info: "Music Festival 2024"
   - Click "Generate Tickets"
   - Preview the tickets with QR codes
   - Click "Print Tickets" to get print-ready layout

2. **Scan Tickets** (Scan Tab)
   - Click "Start Scanning" to activate webcam
   - Point camera at a ticket's QR code
   - System will automatically scan and validate
   - Or use "Manual Entry" to enter ticket number directly

3. **View Reports** (Reports Tab)
   - See statistics: Total, Scanned, Not Scanned, Scan Rate
   - View chart comparing Generated vs Scanned
   - Filter ticket table by status
   - Switch between daily/weekly/monthly views

4. **Manage Settings** (Settings Tab)
   - Update organization name
   - Export data as JSON backup
   - Import previously exported data
   - Clear all data if needed

### QR Code Format

The QR codes contain JSON data in this format:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "number": "TIX-000001"
}
```

### Testing Scans Without Camera

If you don't have a camera or want to test:

1. Generate some tickets
2. Right-click on a QR code → Save image
3. Go to Scan tab → Use "Manual Entry"
4. Enter the ticket number (e.g., "TIX-000001")
5. Click "Scan Manually"

You can also create a test QR code:
- Go to any QR code generator website
- Input: `{"id":"test-id-123","number":"TIX-000001"}`
- Print or display on another device to scan

## 🔄 Backend Integration for Multi-User

This demo uses localStorage. For 4-20 concurrent users, integrate with a backend API:

### Step 1: Create Backend API

Create a REST API with these endpoints:

```javascript
// Node.js + Express example endpoints
POST   /api/tickets/generate       // Generate tickets
GET    /api/tickets               // Get all tickets
GET    /api/tickets/:id           // Get single ticket
PUT    /api/tickets/:id/scan      // Mark ticket as scanned
GET    /api/reports/stats         // Get statistics
DELETE /api/tickets               // Clear all tickets
```

### Step 2: Update TicketContext.jsx

Replace localStorage operations with API calls:

```javascript
// Example: Replace generateTickets function
const generateTickets = async (count, prefix, extra) => {
  const response = await fetch('/api/tickets/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ count, prefix, extra })
  })
  const newTickets = await response.json()
  setTickets(prev => [...newTickets, ...prev])
  return newTickets
}

// Example: Replace scanTicket function
const scanTicket = async (ticketData) => {
  const response = await fetch(`/api/tickets/${ticketData.id}/scan`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  })
  const result = await response.json()
  // Update local state
  setTickets(prev => prev.map(t => 
    t.id === ticketData.id ? { ...t, scannedAt: result.scannedAt } : t
  ))
  return result
}
```

### Step 3: Add Authentication

Implement JWT-based authentication:

```javascript
// Add auth context
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  const login = async (username, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const { token } = await response.json()
    setToken(token)
    localStorage.setItem('token', token)
  }
  
  return (
    <AuthContext.Provider value={{ token, login }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Step 4: Real-time Updates

For real-time multi-user sync, add WebSocket support:

```javascript
import { useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('https://your-backend.com')

// In TicketContext
useEffect(() => {
  socket.on('ticket:scanned', (ticket) => {
    setTickets(prev => prev.map(t => 
      t.id === ticket.id ? ticket : t
    ))
  })
  
  socket.on('ticket:generated', (newTickets) => {
    setTickets(prev => [...newTickets, ...prev])
  })
  
  return () => socket.disconnect()
}, [])
```

### Recommended Backend Stack

- **Node.js + Express**: Simple REST API
- **PostgreSQL/MongoDB**: Data persistence
- **JWT**: Authentication
- **Socket.io**: Real-time updates
- **Redis**: Session management

### Example Backend Structure

```
backend/
├── server.js
├── routes/
│   ├── tickets.js
│   ├── auth.js
│   └── reports.js
├── models/
│   ├── Ticket.js
│   └── User.js
├── middleware/
│   └── auth.js
└── config/
    └── database.js
```

## 📱 Browser Support

- Chrome/Edge: Full support (recommended for scanning)
- Firefox: Full support
- Safari: Full support (iOS 11+)
- Mobile: Optimized for mobile devices

**Note**: Camera scanning requires HTTPS in production (Netlify provides this automatically)

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css` and `src/App.css`:

```css
/* Primary color */
--primary: #3b82f6;

/* Success color */
--success: #10b981;

/* Danger color */
--danger: #ef4444;
```

### Modify Ticket Layout

Edit `src/components/TicketCard.jsx` and `TicketCard.css` to customize ticket appearance.

### Change Organization Branding

Go to Settings tab and update "Organization Name" - this appears on all tickets.

## 🔐 Security Considerations

For production deployment:

1. **Add Authentication**: Implement user login/logout
2. **API Security**: Use HTTPS, validate inputs, implement rate limiting
3. **Database**: Use proper indexing and backups
4. **Environment Variables**: Store sensitive config in `.env` files
5. **CORS**: Configure proper CORS policies for API
6. **Session Management**: Implement secure session handling

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🐛 Troubleshooting

### Camera not working?
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions for camera access
- Try a different browser (Chrome recommended)

### QR codes not scanning?
- Ensure good lighting
- Hold camera steady and at proper distance
- Try manual entry as fallback

### Data not persisting?
- Check browser's localStorage isn't disabled
- Clear browser cache and try again
- Use Export/Import feature to backup data

## 📞 Support

For issues or questions:
- Check existing issues in the repository
- Create a new issue with detailed description
- Include browser version and error messages

## 🚀 Future Enhancements

Potential features for future versions:
- Email ticket delivery
- Custom ticket templates
- Bulk import from CSV
- Advanced analytics
- Multi-language support
- Role-based access control
- PDF generation for tickets
- SMS notifications

---

## 👨‍💻 Author

**Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE**

- GitHub: [@sobri3195](https://github.com/sobri3195)
- Email: [muhammadsobrimaulana31@gmail.com](mailto:muhammadsobrimaulana31@gmail.com)
- Website: [muhammadsobrimaulana.netlify.app](https://muhammadsobrimaulana.netlify.app)

## 📞 Contact & Social Media

- 🌐 **Website**: [muhammadsobrimaulana.netlify.app](https://muhammadsobrimaulana.netlify.app)
- 🌐 **Portfolio**: [muhammad-sobri-maulana-kvr6a.sevalla.page](https://muhammad-sobri-maulana-kvr6a.sevalla.page/)
- 📺 **YouTube**: [@muhammadsobrimaulana6013](https://www.youtube.com/@muhammadsobrimaulana6013)
- 💬 **Telegram**: [winlin_exploit](https://t.me/winlin_exploit)
- 🎵 **TikTok**: [@dr.sobri](https://www.tiktok.com/@dr.sobri)
- 💬 **WhatsApp Group**: [Join Group](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)

## 💖 Support & Donations

If you find this project useful, consider supporting through:

- 💳 **Lynk.id**: [lynk.id/muhsobrimaulana](https://lynk.id/muhsobrimaulana)
- ☕ **Trakteer**: [trakteer.id/g9mkave5gauns962u07t](https://trakteer.id/g9mkave5gauns962u07t)
- 🛍️ **Gumroad**: [maulanasobri.gumroad.com](https://maulanasobri.gumroad.com/)
- 🎨 **Karya Karsa**: [karyakarsa.com/muhammadsobrimaulana](https://karyakarsa.com/muhammadsobrimaulana)
- 💰 **Nyawer**: [nyawer.co/MuhammadSobriMaulana](https://nyawer.co/MuhammadSobriMaulana)

Your support helps me create more open-source projects and educational content!

---

**Built with ❤️ using React + Vite**
