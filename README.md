# An Ode To Node
## Master Repo for all Node & Express Development Projects
- entirely with TypeScript and ESM

### 00 CommonJS
- some common JS comparison syntax
### 01 The Basics
- basic server with raw Node JS
- all HTML & CSS code from 01-04 is written with TS Template literals
### 02 Express Train
- First Express server with models, routes & controllers
### 03 SQL
- adds an SQL db with SQLite3
### 04 Sequelize
- ORM (Object-Relational Mapping) with Sequelize
### 05 noSQL
- noSQL with native Mongo Driver
- Views from 05-13 now with EJS Template Engine
### 06 Mongoose
- ODM (Object-Document Mapping) with Mongoose
### 07 Sessions
- Express-session middleware stored with Connect-mongo library
### 08 Authentication
- deeper dive into session middleware
- added CSRF protection (custom middleware)
- password hashing with bcrypt
### 09 Advanced Authentication
- email based password reset with NodeMailer
### 10 Validation
- validation with Express Validator (data stored with Express session)
### 11 File Upload/Download
- File System file upload and download with Multer
### 12 Pagination
- Paginated data with reusable template and request limits
### 13 Payments
- handle payments with STRIPE
#### Deployed Project
##### [D-Bay](https://d-bay.onrender.com/)
- Final build of all previous projects, deployed as an classidied Ads Demo
- uses Sessions for:
  - persistent authentication
  - handling form errors
  - storing user uploaded files if validation fails (user does not need to reupload on each validation attempt)
  - Connect-mongo for session storage
- Multer based file uploads (will automatically be removed when Render.com server sleeps)
- STRIPE payments demo
- CSRF protection
- Mongoose ODM
- Bcrypt.js password hashing
- Express Validator for re-usable, dynamic form validation
- NodeMailer password reset - in local version only. Removed in deployed version
  -- Password reset URLs redirects you directly to reset page instead of sending email
- dotENV protects vital details
- Light/Dark mode, all device responsiveness
- EJS Templates follow React principles (re-usable components, DRY code)
### 14 REST API
#### Deployed Project
##### [FriendFace](https://friendface-lyart.vercel.app/)
- First Original Social Media Project
- REST with React Client and Node-Express Server
- JWT persistent authentication
  - uses access tokens (expire in 15 minutes) and refresh tokens (expire in 7 days)
  - if response not ok due to expired access token, will fetch refresh token in background; if succeeds then request silently re-tried without disturbing UI
- Multer based file uploads (will automatically be removed when Render.com server sleeps)
- Mongoose ODM, Brypt hashing, Express Validator
- Socket.IO for live update notifications (friend requests, post replies) and a Live Chat feature
  - impossible to chat to users who are not friends
  - one way chat deletion possible (one user keeps history, the other user clears history)
  - if both users delete the chat, then it is deleted from Mongo
  - chats have a query parameter and can be accessed from any page via URL
  - notifications received when:
    - a user replies to one of your posts
    - you receive a friend request
    - a user accepts your friend requests
- Framer Motion for animations, CSS Modules for isolated styling
- Tailwind library available as CSS variables for easy global style configuration
- Custom React hooks handle all data fetching & requests - no 3rd party libraries
- multi-clicks are throttled to prevent too many requests
- colored and formatted human readable logging function for client (see dev-tools in browser) and server
- Effect Dependencies are tracked so you can see exactly what changes on each action
- All data is paginated to reduce payload
### 15 Testing
- test with Jest the server app from 14
### 16 Deno
- Deno CRUD server with native Mongo Driver
### 17 Deno REST
- Deno server from 16 as REST API with React client
