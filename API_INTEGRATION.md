# API Integration Guide - Backend for Multi-User Support

This guide shows how to convert the localStorage-based demo into a multi-user system with backend API.

## Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │  HTTPS  │   Backend   │   SQL   │  Database   │
│   Frontend  │ ◄─────► │   API       │ ◄─────► │  Postgres   │
│  (Netlify)  │   JWT   │  (Node.js)  │         │   /MongoDB  │
└─────────────┘         └─────────────┘         └─────────────┘
```

## Backend API Endpoints

### 1. Authentication

```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### 2. Tickets

```javascript
POST   /api/tickets/generate      // Generate N tickets
GET    /api/tickets               // Get all tickets (with pagination)
GET    /api/tickets/:id           // Get single ticket
PUT    /api/tickets/:id/scan      // Mark ticket as scanned
DELETE /api/tickets/:id           // Delete ticket
DELETE /api/tickets               // Clear all tickets
```

### 3. Reports

```javascript
GET /api/reports/stats            // Get statistics
GET /api/reports/daily            // Daily report
GET /api/reports/weekly           // Weekly report
GET /api/reports/monthly          // Monthly report
```

### 4. Settings

```javascript
GET /api/settings                 // Get organization settings
PUT /api/settings                 // Update settings
```

## Example Backend Implementation (Node.js + Express)

### Setup

```bash
mkdir tix-backend
cd tix-backend
npm init -y
npm install express pg jsonwebtoken bcrypt cors dotenv
```

### Project Structure

```
tix-backend/
├── server.js
├── .env
├── package.json
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── tickets.js
│   ├── reports.js
│   └── settings.js
├── models/
│   ├── User.js
│   ├── Ticket.js
│   └── Organization.js
└── controllers/
    ├── authController.js
    ├── ticketController.js
    ├── reportController.js
    └── settingsController.js
```

### Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    organization_id INTEGER REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    max_users INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number VARCHAR(50) UNIQUE NOT NULL,
    prefix VARCHAR(20) NOT NULL,
    extra TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scanned_at TIMESTAMP,
    scanned_by INTEGER REFERENCES users(id),
    organization_id INTEGER REFERENCES organizations(id),
    created_by INTEGER REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_tickets_organization ON tickets(organization_id);
CREATE INDEX idx_tickets_scanned ON tickets(scanned_at);
CREATE INDEX idx_tickets_number ON tickets(number);
```

### server.js

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const reportRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
```

### routes/tickets.js

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// Generate tickets
router.post('/generate', authMiddleware, async (req, res) => {
    const { count, prefix, extra } = req.body;
    const { userId, organizationId } = req.user;
    
    try {
        // Get next number for this prefix
        const lastTicket = await pool.query(
            'SELECT number FROM tickets WHERE prefix = $1 AND organization_id = $2 ORDER BY number DESC LIMIT 1',
            [prefix, organizationId]
        );
        
        let nextNumber = 1;
        if (lastTicket.rows.length > 0) {
            const match = lastTicket.rows[0].number.match(/(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }
        
        const tickets = [];
        for (let i = 0; i < count; i++) {
            const id = uuidv4();
            const number = `${prefix}-${String(nextNumber).padStart(6, '0')}`;
            
            const result = await pool.query(
                'INSERT INTO tickets (id, number, prefix, extra, organization_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [id, number, prefix, extra, organizationId, userId]
            );
            
            tickets.push(result.rows[0]);
            nextNumber++;
        }
        
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate tickets' });
    }
});

// Get all tickets
router.get('/', authMiddleware, async (req, res) => {
    const { organizationId } = req.user;
    const { page = 1, limit = 100, filter } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        let query = 'SELECT * FROM tickets WHERE organization_id = $1';
        const params = [organizationId];
        
        if (filter === 'scanned') {
            query += ' AND scanned_at IS NOT NULL';
        } else if (filter === 'not-scanned') {
            query += ' AND scanned_at IS NULL';
        }
        
        query += ' ORDER BY generated_at DESC LIMIT $2 OFFSET $3';
        params.push(limit, offset);
        
        const result = await pool.query(query, params);
        
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM tickets WHERE organization_id = $1',
            [organizationId]
        );
        
        res.json({
            tickets: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// Scan ticket
router.put('/:id/scan', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { userId, organizationId } = req.user;
    
    try {
        // Check if ticket exists and belongs to organization
        const ticketResult = await pool.query(
            'SELECT * FROM tickets WHERE id = $1 AND organization_id = $2',
            [id, organizationId]
        );
        
        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        const ticket = ticketResult.rows[0];
        
        if (ticket.scanned_at) {
            return res.status(400).json({
                error: 'Ticket already scanned',
                ticket,
                duplicate: true
            });
        }
        
        // Mark as scanned
        const updateResult = await pool.query(
            'UPDATE tickets SET scanned_at = CURRENT_TIMESTAMP, scanned_by = $1 WHERE id = $2 RETURNING *',
            [userId, id]
        );
        
        res.json({
            success: true,
            ticket: updateResult.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scan ticket' });
    }
});

// Delete ticket
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { organizationId } = req.user;
    
    try {
        await pool.query(
            'DELETE FROM tickets WHERE id = $1 AND organization_id = $2',
            [id, organizationId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

module.exports = router;
```

### routes/reports.js

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../config/database');

// Get statistics
router.get('/stats', authMiddleware, async (req, res) => {
    const { organizationId } = req.user;
    
    try {
        const result = await pool.query(
            `SELECT 
                COUNT(*) as total,
                COUNT(scanned_at) as scanned,
                COUNT(*) - COUNT(scanned_at) as not_scanned,
                CASE 
                    WHEN COUNT(*) > 0 THEN ROUND((COUNT(scanned_at)::numeric / COUNT(*)::numeric) * 100, 1)
                    ELSE 0
                END as scan_rate
            FROM tickets 
            WHERE organization_id = $1`,
            [organizationId]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get daily report
router.get('/daily', authMiddleware, async (req, res) => {
    const { organizationId } = req.user;
    
    try {
        const result = await pool.query(
            `SELECT 
                DATE(generated_at) as date,
                COUNT(*) as generated,
                COUNT(scanned_at) as scanned
            FROM tickets 
            WHERE organization_id = $1
            GROUP BY DATE(generated_at)
            ORDER BY date DESC
            LIMIT 30`,
            [organizationId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch daily report' });
    }
});

module.exports = router;
```

## Frontend Integration

### 1. Update TicketContext.jsx

Replace localStorage calls with API calls:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with auth
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// In TicketContext:
const generateTickets = async (count, prefix, extra) => {
    try {
        const response = await api.post('/tickets/generate', {
            count,
            prefix,
            extra
        });
        setTickets(prev => [...response.data, ...prev]);
        showToast(`Generated ${count} tickets`, 'success');
        return response.data;
    } catch (error) {
        showToast('Failed to generate tickets', 'error');
        throw error;
    }
};

const scanTicket = async (ticketData) => {
    try {
        const response = await api.put(`/tickets/${ticketData.id}/scan`);
        setTickets(prev => prev.map(t => 
            t.id === ticketData.id ? response.data.ticket : t
        ));
        showToast('Ticket scanned successfully', 'success');
        return response.data;
    } catch (error) {
        if (error.response?.data?.duplicate) {
            showToast('Ticket already scanned', 'warning');
            return error.response.data;
        }
        showToast('Failed to scan ticket', 'error');
        throw error;
    }
};

const loadTickets = async () => {
    try {
        const response = await api.get('/tickets');
        setTickets(response.data.tickets);
    } catch (error) {
        console.error('Failed to load tickets:', error);
    }
};

// Load tickets on mount
useEffect(() => {
    if (token) {
        loadTickets();
    }
}, [token]);
```

### 2. Add Authentication

Create `src/context/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    
    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
    };
    
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };
    
    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
```

### 3. Add Login Page

Create `src/pages/Login.jsx`:

```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            alert('Login failed');
        }
    };
    
    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
```

## Real-time Updates with WebSockets

### Backend (Socket.io)

```javascript
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

io.on('connection', (socket) => {
    socket.on('join-organization', (organizationId) => {
        socket.join(`org-${organizationId}`);
    });
});

// When ticket is scanned
io.to(`org-${organizationId}`).emit('ticket-scanned', ticket);

// When tickets are generated
io.to(`org-${organizationId}`).emit('tickets-generated', tickets);
```

### Frontend

```javascript
import io from 'socket.io-client';

const socket = io(API_URL);

useEffect(() => {
    if (user) {
        socket.emit('join-organization', user.organizationId);
        
        socket.on('ticket-scanned', (ticket) => {
            setTickets(prev => prev.map(t => 
                t.id === ticket.id ? ticket : t
            ));
            showToast(`Ticket ${ticket.number} scanned`, 'info');
        });
        
        socket.on('tickets-generated', (newTickets) => {
            setTickets(prev => [...newTickets, ...prev]);
        });
    }
    
    return () => socket.disconnect();
}, [user]);
```

## Deployment

### Backend (Heroku example)

```bash
# Login to Heroku
heroku login

# Create app
heroku create tix-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set FRONTEND_URL=https://your-netlify-site.netlify.app

# Deploy
git push heroku main
```

### Frontend (Update .env)

```env
VITE_API_URL=https://tix-backend.herokuapp.com/api
```

Rebuild and deploy to Netlify.

## Testing Multi-User Setup

1. Create 2 user accounts
2. Login from different browsers/devices
3. Generate tickets from user 1
4. Scan tickets from user 2
5. Observe real-time updates in both sessions

---

**Ready for production?** Follow this guide to add backend support! 🚀
