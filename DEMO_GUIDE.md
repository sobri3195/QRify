# Quick Demo Guide - Tix/Voucher Suite

Follow this guide to quickly demo all features of the application.

## 🎯 5-Minute Demo

### Step 1: Generate Tickets (2 minutes)

1. Click on **Generate** tab (bottom navigation)
2. Enter the following:
   - Number of Tickets: `10`
   - Ticket Prefix: `DEMO`
   - Additional Info: `Demo Event 2024`
3. Click **Generate Tickets**
4. Observe:
   - ✅ 10 tickets are generated
   - ✅ Each has a unique QR code
   - ✅ Each has a unique number (DEMO-000001, DEMO-000002, etc.)
   - ✅ Generation timestamp is shown

### Step 2: Print Preview (30 seconds)

1. Scroll down to see all generated tickets
2. Click **Print Tickets** button
3. Observe the print-ready layout
4. Cancel print dialog or print to PDF

### Step 3: Scan Tickets (1 minute)

**Option A: Using Camera (if available)**
1. Click **Scan** tab
2. Click **Start Scanning**
3. Allow camera permissions
4. Point camera at a QR code from generated tickets
5. Observe:
   - ✅ Ticket is automatically recognized
   - ✅ Success message appears
   - ✅ Scan time is recorded

**Option B: Manual Entry (no camera needed)**
1. Click **Scan** tab
2. In Manual Entry field, type: `DEMO-000001`
3. Press Enter or click **Scan Manually**
4. Observe:
   - ✅ Ticket is marked as scanned
   - ✅ Success notification appears

5. Try scanning the same ticket again:
   - ✅ "Already scanned" warning appears
   - ✅ Original scan time is shown

### Step 4: View Reports (1 minute)

1. Click **Reports** tab
2. Observe statistics:
   - Total Tickets: 10
   - Scanned: 1-2 (depending on how many you scanned)
   - Not Scanned: 8-9
   - Scan Rate: 10-20%
3. Check the chart showing Generated vs Scanned
4. Scroll down to ticket list
5. Test filters:
   - Select "Scanned Only" → see only scanned tickets
   - Select "Not Scanned" → see only unscanned tickets
   - Select "All Tickets" → see everything
6. Try changing period:
   - Daily (default)
   - Weekly
   - Monthly

### Step 5: Settings & Data Management (30 seconds)

1. Click **Settings** tab
2. Change Organization Name to: `My Company`
3. Click **Save Settings**
4. Go back to **Generate** tab
5. Generate 1 ticket and observe organization name on ticket
6. Return to **Settings**
7. Click **Export Data (JSON)** to download backup
8. (Optional) Click **Import Data** to restore from backup

## 🎪 Advanced Demo Scenarios

### Scenario 1: Event Check-In Simulation

**Context**: You're checking in attendees at an event entrance

1. Generate 20 tickets for "Music Festival 2024"
2. Print tickets (or save print preview as PDF)
3. Scan 5 random tickets using camera or manual entry
4. Go to Reports → observe 25% scan rate
5. Use ticket filter to see who hasn't checked in yet

### Scenario 2: Bulk Ticket Generation

**Context**: Creating tickets for a large event

1. Generate 200 tickets (maximum allowed)
2. Observe loading time and preview
3. Test print layout with many tickets
4. Export data as backup
5. Clear data and re-import to verify backup works

### Scenario 3: Duplicate Detection

**Context**: Preventing ticket fraud

1. Generate 5 tickets
2. Scan ticket #1 successfully
3. Try scanning ticket #1 again
4. Observe duplicate warning with original scan time
5. Check Reports → verify only counted once

### Scenario 4: Daily Event Management

**Context**: Multi-day event tracking

1. Generate 30 tickets with prefix "DAY1"
2. Scan 10 tickets
3. Generate 30 more with prefix "DAY2"
4. Scan 15 of the DAY2 tickets
5. Go to Reports:
   - Total: 60 tickets
   - Scanned: 25
   - Chart shows generation/scan patterns
6. Use daily/weekly filters to see trends

## 📱 Mobile Demo

1. Open the app on your mobile device
2. Notice:
   - ✅ Responsive layout adapts to screen
   - ✅ Bottom navigation is touch-friendly
   - ✅ Forms are easy to use on mobile
   - ✅ Camera scanning works natively
   - ✅ Print layout optimized for mobile

## 🔄 Data Persistence Demo

1. Generate 10 tickets
2. Scan 5 tickets
3. Close the browser
4. Reopen the app
5. Observe:
   - ✅ All tickets are still there
   - ✅ Scan status preserved
   - ✅ Statistics accurate

## 🎨 QR Code Testing

### Test QR Code Content:

1. Right-click on any QR code
2. Save image to desktop
3. Use any QR scanner app on your phone
4. Scan the saved image
5. Observe JSON output:
   ```json
   {
     "id": "550e8400-e29b-41d4-a716-446655440000",
     "number": "TIX-000001"
   }
   ```

### Create Test QR Code:

1. Visit [QR Code Generator](https://www.qr-code-generator.com/)
2. Enter:
   ```json
   {"id":"test-123","number":"TEST-000999"}
   ```
3. Generate and print QR code
4. Use app to scan it
5. Verify error message (ticket not in system)

## 🧪 Testing Checklist

Use this checklist during your demo:

**Generation:**
- [ ] Generate 1 ticket
- [ ] Generate 10 tickets
- [ ] Generate with custom prefix
- [ ] Generate with additional info
- [ ] Generate 200 tickets (max limit)
- [ ] Test undo feature
- [ ] Verify unique numbers
- [ ] Check QR codes display

**Scanning:**
- [ ] Scan with camera
- [ ] Scan with manual entry
- [ ] Scan valid ticket
- [ ] Scan duplicate ticket
- [ ] Scan non-existent ticket
- [ ] View scan history

**Reports:**
- [ ] View statistics
- [ ] Check chart data
- [ ] Filter by status
- [ ] Switch time periods
- [ ] Verify calculations

**Settings:**
- [ ] Change organization name
- [ ] Update max users
- [ ] Export data
- [ ] Import data
- [ ] Clear all data

**UI/UX:**
- [ ] Bottom navigation switches tabs
- [ ] Active tab is highlighted
- [ ] Toast notifications appear
- [ ] Forms validate input
- [ ] Print layout works
- [ ] Mobile responsive

## 💡 Demo Tips

1. **For Technical Audience**: Focus on code structure, localStorage usage, and backend integration possibilities

2. **For Business Users**: Emphasize ease of use, quick setup, and real-world scenarios

3. **For Stakeholders**: Show statistics, reporting capabilities, and scalability options

4. **For End Users**: Demonstrate simple generation and scanning workflow

## 🎬 Demo Script

> "Let me show you Tix/Voucher Suite, a complete ticket management system.
> 
> First, I'll generate 10 tickets for our event. [Do Step 1]
> 
> Each ticket has a unique QR code that contains the ticket ID and number. [Show QR code]
> 
> These are print-ready. [Click Print]
> 
> Now let's scan a ticket. [Do Step 3]
> 
> Notice it immediately marks as scanned. If I try to scan again... [Rescan]
> 
> It warns me it's a duplicate with the original scan time.
> 
> In Reports, we can see our statistics and track scan rates. [Show Reports]
> 
> We can filter by scanned or not scanned to see who's checked in.
> 
> Finally, we can export all data for backup and import later. [Show Settings]
> 
> The app works offline, is mobile-friendly, and can be deployed to Netlify in minutes."

---

**Ready to demo?** Start with the 5-Minute Demo above! 🎉
