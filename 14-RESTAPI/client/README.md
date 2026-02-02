# Reminder
## package.json
- scripts > dev: allow port forwarding to host to other devices
  - vite -- --host
## vite.config.ts
- allow port forwarding to host to other devices
  - server: { host: true } // or "0.0.0.0"
- resolve @bsolute paths
  - resolve: { alias: { '@': '/src' } }
## vercel.json
- for SPAs with routing
  - "rewrites": [{ "source": "/(.*)", "destination": "/" }]
## public/robots.txt
  - User-agent: *
  - Disallow:
## index.html:
  - lang="en"
  - < meta name="description" content="React App" >
