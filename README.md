# KaviosPix

> A secure full-stack photo management application for organizing, protecting, and sharing personal photos through authenticated APIs.

KaviosPix is a Google Photos-inspired image management application built with **React, Node.js, Express, MongoDB, and Google OAuth**.

The application allows users to create albums, upload images, organize photos using tags, mark photos as favorites, add comments, and share albums with other users.

The project focuses on building a secure API architecture where authentication and album-level authorization are checked before users can access protected resources.

---

## 📌 Project Overview

KaviosPix provides a centralized space for managing personal photo collections.

Users can:

* Sign in using Google OAuth
* Create and manage albums
* Upload and organize images
* Add tags to photos
* Filter photos using tags
* Mark photos as favorites
* Add comments to photos
* Share albums with other users
* Access protected images through authenticated APIs

The application separates **authentication** from **authorization**.

Authentication verifies who the user is, while authorization determines what that user is allowed to access or modify.

---

## ✨ Features

### 🔐 Authentication

* Google OAuth 2.0 authentication
* JWT-based authentication
* Protected API routes
* Protected frontend routes
* Persistent authentication state
* Logout functionality
* Authenticated user information

### 📁 Album Management

* Create albums
* View all accessible albums
* Update album name and description
* Delete albums
* Album ownership tracking
* Album sharing through email

### 🖼️ Image Management

* Upload images to albums
* Supported formats:

  * JPEG
  * PNG
  * WebP
* Maximum file size: **5 MB**
* Protected image serving
* Image metadata storage
* Delete images
* Responsive image gallery

### ⭐ Favorites

* Mark images as favorites
* Remove images from favorites
* Dedicated Favorites page
* Favorite photos across accessible albums

### 🏷️ Tags & Filtering

* Add tags while managing photos
* Store tags in normalized lowercase format
* Filter album images by tags
* Support multiple tag filters

Example:

```text
GET /albums/:albumId/images?tags=travel,nature
```

Multiple tags are handled using an AND-based filter.

### 💬 Comments

* Add comments to images
* Validate empty comments
* Maximum comment length of 500 characters
* Comments remain associated with their images

### 👥 Album Sharing

Albums can be shared with users through their email addresses.

Example request:

```json
{
  "emails": [
    "user1@gmail.com",
    "user2@gmail.com"
  ]
}
```

Shared users can access permitted album resources according to the backend authorization rules.

### 🛡️ Authorization

The backend uses middleware to enforce resource-level permissions.

#### Album Owner

The album owner can:

* Update the album
* Delete the album
* Share the album
* Upload images
* Delete images
* Add comments
* View images
* Mark images as favorites

#### Shared User

A shared user can access permitted album resources such as:

* View album images
* View protected images
* Mark images as favorites
* Use supported image filtering

Owner-only operations remain protected by backend authorization middleware.

---

# 🏗️ Architecture

KaviosPix follows a client-server architecture.

```text
                         ┌─────────────────────┐
                         │      React UI       │
                         │                     │
                         │ Pages / Components  │
                         │ Context / Router    │
                         └──────────┬──────────┘
                                    │
                                    │ Axios
                                    │ JWT
                                    ▼
                         ┌─────────────────────┐
                         │    Express API      │
                         │                     │
                         │ Routes              │
                         │ Controllers         │
                         │ Middleware          │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
                   ▼                ▼                ▼
              Authentication   Authorization     File Upload
                   │                │                │
                   ▼                ▼                ▼
                JWT/Auth       Album Access       Multer
                                    │
                                    ▼
                              ┌─────────────┐
                              │   MongoDB   │
                              │             │
                              │ Users       │
                              │ Albums      │
                              │ Images      │
                              └─────────────┘
```

---

# 🔒 Protected Image Access

Images are not exposed as unrestricted public resources.

When a user requests an image, the request passes through authentication and authorization middleware.

```text
Client
  │
  │ GET /albums/:albumId/images/:imageId/file
  ▼
authenticate
  │
  │ Verify JWT
  ▼
requireAlbumAccess
  │
  │ Owner or shared user?
  ▼
requireImageInAlbum
  │
  │ Does image belong to album?
  ▼
serveImage
  │
  ▼
Protected Image
```

This ensures that knowing an image ID alone is not sufficient to access the image.

---

# 🔐 Authentication Flow

KaviosPix uses Google OAuth for user authentication.

```text
User
 │
 │ Sign in with Google
 ▼
/auth/google
 │
 ▼
Google OAuth
 │
 ▼
/auth/google/callback
 │
 ▼
Passport
 │
 ▼
User authentication
 │
 ▼
JWT generation
 │
 ▼
Frontend callback
 │
 ▼
Store authentication data
 │
 ▼
Protected React routes
```

Authenticated API requests include the JWT:

```http
Authorization: Bearer <JWT>
```

The backend authentication middleware:

1. Reads the Authorization header.
2. Validates the Bearer token.
3. Verifies the JWT.
4. Finds the corresponding user.
5. Attaches the authenticated user to `req.user`.

---

# 📡 API Overview

## Authentication

```http
GET /auth/google
GET /auth/google/callback
GET /auth/me
```

## Albums

```http
POST   /albums
GET    /albums
PUT    /albums/:albumId
DELETE /albums/:albumId
POST   /albums/:albumId/share
```

## Images

```http
POST   /albums/:albumId/images
GET    /albums/:albumId/images
GET    /albums/:albumId/images/favorites
PUT    /albums/:albumId/images/:imageId/favorite
POST   /albums/:albumId/images/:imageId/comments
DELETE /albums/:albumId/images/:imageId
GET    /albums/:albumId/images/:imageId/file
```

---

# 🧩 Backend Middleware

The backend uses middleware to keep authentication and authorization logic separate from controllers.

### `authenticate`

Verifies the JWT and identifies the current user.

```text
Request
   ↓
JWT verification
   ↓
Find User
   ↓
req.user
```

### `requireAlbumOwner`

Checks whether the authenticated user owns the requested album.

```text
req.user.userId
       │
       ▼
album.ownerId
       │
       ├── Match → Continue
       │
       └── No match → 403
```

### `requireAlbumAccess`

Allows access when the user is either:

* The album owner
* A user included in the album's shared users

### `requireImageInAlbum`

Ensures that the requested image actually belongs to the requested album.

This prevents accessing an image through an unrelated album ID.

---

# 📂 Project Structure

```text
KaviosPix/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── albums/
│   │   │   ├── images/
│   │   │   └── common/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Bootstrap 5
* Axios
* Context API

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Passport.js
* Google OAuth 2.0
* Multer

## Development Tools

* Git
* GitHub
* VS Code
* Postman
* Nodemon

---

# ⚙️ Environment Variables

## Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

Do not commit real credentials or secrets to GitHub.

---

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/sunny-raj-sah/KaviosPix.git
```

```bash
cd KaviosPix
```

---

## 2. Install backend dependencies

```bash
cd backend
npm install
```

---

## 3. Configure backend environment variables

Create:

```text
backend/.env
```

and add the required MongoDB, JWT, and Google OAuth credentials.

---

## 4. Start the backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 6. Configure frontend environment

Create:

```text
frontend/.env
```

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 7. Start the frontend

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🧪 Testing

The APIs can be tested using Postman.

Important flows to test:

### Authentication

```text
Google Login
       ↓
JWT
       ↓
Protected API
```

### Album

```text
Create
  ↓
Read
  ↓
Update
  ↓
Delete
```

### Image

```text
Upload
  ↓
View
  ↓
Favorite
  ↓
Comment
  ↓
Delete
```

### Authorization

Test both:

```text
Album Owner
```

and:

```text
Shared User
```

to verify that owner-only operations are rejected for users who do not own the album.

---

# 📚 What I Learned

Building KaviosPix helped me understand how a complete full-stack application works beyond individual CRUD APIs.

### React

* Component-based architecture
* React Router
* Protected routes
* Context API
* Authentication state management
* Reusable components
* Form handling
* Loading and error states
* API integration with Axios
* Responsive UI with Bootstrap

### Backend

* Express.js routing
* Controller-service separation
* Middleware architecture
* JWT authentication
* Google OAuth
* Authorization
* Resource-level permissions
* Multipart file uploads
* File validation
* Protected file serving

### MongoDB

* Mongoose models
* Document relationships
* Query filtering
* Updating nested data
* Working with UUID-style identifiers

### Security

I learned the difference between:

```text
Authentication
"Who are you?"
```

and:

```text
Authorization
"What are you allowed to access?"
```

I also learned why frontend restrictions alone are not sufficient for security.

For example:

```text
Frontend hides Delete button
        ≠
Secure API
```

The backend must independently verify permissions:

```text
Request
  ↓
Authenticate
  ↓
Authorize
  ↓
Controller
```

### API Design

I learned how to design APIs around resources:

```text
/auth
/albums
/albums/:albumId
/albums/:albumId/images
/albums/:albumId/images/:imageId
```

and how middleware can be composed for different authorization requirements.

### Debugging

During development I worked through issues involving:

* React state updates
* Protected routes
* API response shapes
* JWT authentication
* Middleware ordering
* File uploads
* Protected image resources
* Component separation
* Frontend/backend integration

---

# 🎯 Project Goals

The main goals of KaviosPix are:

* Build a practical full-stack application
* Implement real authentication and authorization
* Work with protected resources
* Understand file upload and serving
* Practice API design
* Build reusable React components
* Implement resource-level permissions
* Develop a production-oriented project structure

---

# 🔮 Future Improvements

Potential future improvements include:

* Cloud image storage
* Image thumbnails
* Image search
* Pagination
* Infinite scrolling
* Album cover images
* Better image preview/lightbox
* Comment management
* More granular sharing permissions
* Image metadata extraction
* Automated testing
* API documentation
* Production deployment
* Improved caching and performance

---

# 👨‍💻 Author

**Sunny Raj**

* GitHub: https://github.com/sunny-raj-sah
* LinkedIn: https://www.linkedin.com/in/sunny-raj-885588313/

---

## 📌 Project Status

KaviosPix is an actively developed full-stack project focused on learning and implementing real-world authentication, authorization, image management, and React application architecture.

> **KaviosPix — Organize. Protect. Share.**
