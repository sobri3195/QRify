# Deployment Guide - Tix/Voucher Suite

## Quick Start: Deploy to Netlify

### Method 1: Drag & Drop (Easiest)

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the `dist` folder

4. Your site is live! ✨

### Method 2: Git-based Deployment (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [Netlify](https://app.netlify.com/)

3. Click "Add new site" → "Import an existing project"

4. Choose your Git provider (GitHub/GitLab/Bitbucket)

5. Select your repository

6. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (set in Environment variables if needed)

7. Click "Deploy site"

### Method 3: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Post-Deployment Checklist

- ✅ Site loads correctly
- ✅ Bottom navigation works
- ✅ Can generate tickets
- ✅ QR codes display properly
- ✅ Camera permissions work (HTTPS required)
- ✅ Scan functionality works
- ✅ Reports show correct data
- ✅ Export/Import works

## Testing the Deployed App

### Test Ticket Generation:
1. Go to Generate tab
2. Create 5 tickets with prefix "TEST"
3. Click "Print Tickets" and verify print layout

### Test Scanning:
1. Go to Scan tab
2. Allow camera permissions
3. Point at a generated QR code
4. Verify scan success message

### Test Reports:
1. Go to Reports tab
2. Verify statistics are correct
3. Check chart displays data
4. Test filter functionality

## Camera Permissions

**Important**: Camera scanning requires HTTPS. Netlify automatically provides HTTPS for all sites.

If camera doesn't work:
- Check browser permissions
- Ensure HTTPS is enabled
- Try a different browser (Chrome recommended)
- Use Manual Entry as fallback

## Custom Domain (Optional)

1. In Netlify Dashboard → Domain settings
2. Add custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

## Environment Variables

For production with backend API:

1. In Netlify Dashboard → Site settings → Environment variables
2. Add:
   - `VITE_API_URL`: Your backend API URL
   - `VITE_API_KEY`: API key (if needed)

3. Update code to use env variables:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
   ```

## Continuous Deployment

With Git-based deployment, Netlify automatically:
- Builds on every push to main branch
- Provides deploy previews for pull requests
- Maintains deploy history
- Allows instant rollbacks

## Performance Optimization

Current bundle size: ~971 KB (gzipped: ~272 KB)

To optimize:
1. Use dynamic imports for charts:
   ```javascript
   const Reports = lazy(() => import('./pages/Reports'))
   ```

2. Split vendor chunks in vite.config.js:
   ```javascript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           charts: ['recharts']
         }
       }
     }
   }
   ```

## Monitoring

- View real-time analytics in Netlify Dashboard
- Monitor build logs for errors
- Check Netlify Functions logs (if using backend)

## Troubleshooting

### Build fails:
- Check Node version (should be 18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Site loads but shows blank page:
- Check browser console for errors
- Verify assets are loading (check Network tab)
- Check if base path is configured correctly

### Camera not working:
- Ensure HTTPS is enabled
- Check browser permissions
- Try incognito/private mode
- Test on different device

## Support

For deployment issues:
- Check [Netlify Status](https://www.netlifystatus.com/)
- Review [Netlify Docs](https://docs.netlify.com/)
- Check build logs in Netlify Dashboard

---

**Ready to deploy?** Run `npm run build` and follow Method 1 above! 🚀
