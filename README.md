 # KaviosPix

> **A secure full-stack photo management platform for organizing, protecting, and sharing personal images.**

KaviosPix is a full-stack photo management application inspired by modern cloud photo platforms. It allows authenticated users to create albums, upload and organize images, share albums with other users, add tags and comments, and manage favorite photos.

The application focuses heavily on **authentication, resource-level authorization, protected image access, file validation, and clean separation between frontend and backend responsibilities.**

---

## Live Demo

**Frontend:**
https://frontend-five-puce-11.vercel.app/

**GitHub Repository:**
https://github.com/sunny-raj-sah/KaviosPix

---

## Project Overview

KaviosPix provides a centralized platform where users can securely manage their personal photo collections.

The application supports:

* Google OAuth authentication
* JWT-based API authentication
* Protected frontend routes
* Album creation and management
* Image uploads
* Image validation
* Album sharing
* Resource-level authorization
* Image tags and filtering
* Favorites
* Image comments
* Protected image serving
* Responsive React UI

The core security model separates:

```text
Authentication
      ↓
Who is the user?
      ↓
Authorization
      ↓
What is the user allowed to access?
```

---

# Key Features

## Authentication

KaviosPix uses Google OAuth for user authentication and JWT for protecting API requests.

### Authentication flow

```text
User
  │
  │ Continue with Google
  ▼
Google OAuth
  │
  ▼
Backend Callback
  │
  ▼
Find/Create User
  │
  ▼
Generate JWT
  │
  ▼
Frontend Callback
  │
  ▼
Store Authentication State
  │
  ▼
Protected Application
```

Authenticated requests use:

```http
Authorization: Bearer <JWT>
```

The backend verifies the token before allowing access to protected resources.

---

# Album Management

Users can:

* Create albums
* View accessible albums
* Update album information
* Delete albums
* Share albums
* Revoke album access

Each album contains ownership information:

```text
Album
├── albumId
├── name
├── description
├── ownerId
├── sharedUsers
├── createdAt
└── updatedAt
```

---

# Image Management

Users can upload images into albums.

Supported formats:

```text
JPEG
PNG
WebP
```

Maximum file size:

```text
5 MB
```

The backend validates:

* File type
* File size
* Upload errors
* Album ownership
* Image-to-album relationship

Images are stored with generated filenames instead of relying on the original filename.

---

# Protected Image Access

One of the important engineering aspects of KaviosPix is that image files are not treated as unrestricted public resources.

A request to retrieve an image goes through multiple validation layers:

```text
Client
  │
  ▼
JWT Authentication
  │
  ▼
Album Access Check
  │
  ▼
Image Belongs to Album?
  │
  ▼
Serve Image
```

For example:

```http
GET /albums/:albumId/images/:imageId/file
```

The backend verifies:

1. The user has a valid JWT.
2. The album exists.
3. The user owns or has access to the album.
4. The image belongs to that album.
5. Only then is the image served.

This prevents a user from accessing an image simply by knowing an image ID.

---

# Album Authorization

KaviosPix implements resource-level authorization.

There are two major access levels.

## Album Owner

The album owner can:

* Update the album
* Delete the album
* Share the album
* Revoke sharing
* Upload images
* Delete images
* Add comments
* Delete comments
* View images
* Manage favorites

## Shared User

A shared user can access permitted album resources without becoming the owner.

For example:

```text
Owner
  │
  ├── Full album management
  ├── Upload images
  ├── Delete images
  ├── Share album
  └── Manage album
       
Shared User
  │
  ├── View permitted images
  ├── Access protected images
  └── Manage supported photo interactions
```

The authorization decision is made by the backend.

The frontend UI is not treated as a security boundary.

---

# Authorization Middleware

The backend separates authentication and authorization into reusable middleware.

### `authenticate`

Responsible for:

```text
Read Authorization Header
        ↓
Extract JWT
        ↓
Verify JWT
        ↓
Find User
        ↓
req.user
```

### `requireAlbumOwner`

Checks whether:

```text
req.user.userId === album.ownerId
```

If the user is not the owner:

```http
403 Forbidden
```

### `requireAlbumAccess`

Allows access when:

```text
User is Owner
      OR
User exists in sharedUsers
```

Otherwise:

```http
403 Forbidden
```

### `requireImageInAlbum`

Ensures that the requested image actually belongs to the requested album.

This protects against cross-album resource access.

---

# Tags and Filtering

Images can be organized using tags.

Example:

```text
travel
nature
friends
college
vacation
```

Tags can be used to filter album images.

Example:

```http
GET /albums/:albumId/images?tags=travel,nature
```

Multiple tags can be processed as an AND-based filter.

---

# Favorites

Users can mark images as favorites.

Features include:

* Add to favorites
* Remove from favorites
* View favorite images
* Maintain favorite state per image

A dedicated Favorites page provides a centralized view of favorite photos.

---

# Comments

Users can add comments to supported images.

Comment validation includes:

* Empty comment prevention
* Maximum length validation
* Image relationship validation
* Authorization checks

Example:

```text
Image
 ├── Comment
 │    ├── User
 │    ├── Text
 │    └── Timestamp
```

---

# API Design

The backend follows a resource-oriented REST API structure.

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
DELETE /albums/:albumId/share
```

## Images

```http
POST   /albums/:albumId/images
GET    /albums/:albumId/images
GET    /albums/:albumId/images/favorites

PUT    /albums/:albumId/images/:imageId/favorite

POST   /albums/:albumId/images/:imageId/comments

DELETE /albums/:albumId/images/:imageId/comments/:commentId

DELETE /albums/:albumId/images/:imageId

GET    /albums/:albumId/images/:imageId/file
```

---

# Architecture

KaviosPix follows a client-server architecture.

```text
┌──────────────────────────┐
│        React UI          │
│                          │
│ Pages                    │
│ Components               │
│ Context API              │
│ Protected Routes         │
└────────────┬─────────────┘
             │
             │ Axios / HTTP
             │ JWT
             ▼
┌──────────────────────────┐
│      Express API         │
│                          │
│ Routes                   │
│ Controllers              │
│ Middleware               │
│ Error Handling           │
└────────────┬─────────────┘
             │
       ┌─────┼──────────────┐
       │     │              │
       ▼     ▼              ▼
   MongoDB  JWT/OAuth     Multer
       │                    │
       ▼                    ▼
   Users / Albums /      Image Files
      Images
```

---

# Frontend Architecture

The React application is divided into reusable responsibilities.

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── albums/
│   │   ├── images/
│   │   └── common/
│   │
│   ├── context/
│   │
│   ├── pages/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── App.jsx
│   └── main.jsx
```

Important frontend areas include:

```text
components/
  ↓
Reusable UI

pages/
  ↓
Application screens

services/
  ↓
API communication

context/
  ↓
Authentication state

routes/
  ↓
Navigation and protected routes
```

---

# Backend Architecture

The backend follows a layered structure.

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
```

### Controllers

Business logic is separated into controllers:

```text
auth.controller.js
album.controller.js
image.controller.js
user.controller.js
```

### Middleware

Security and request processing are separated into middleware:

```text
auth.middleware.js
album.middleware.js
albumAccess.middleware.js
image.middleware.js
upload.middleware.js
error.middleware.js
notFound.middleware.js
```

### Models

MongoDB data models include:

```text
User
Album
Image
```

---

# Data Model

## User

```text
User
├── userId
├── googleId
├── email
├── createdAt
└── updatedAt
```

## Album

```text
Album
├── albumId
├── name
├── description
├── ownerId
├── sharedUsers[]
├── createdAt
└── updatedAt
```

## Image

```text
Image
├── imageId
├── albumId
├── filename
├── originalName
├── tags[]
├── favorites
├── comments[]
└── timestamps
```

The application uses UUID-style identifiers for application-level resources.

---

# File Upload Pipeline

Image uploads use Multer.

```text
Frontend
  │
  │ multipart/form-data
  ▼
Express Route
  │
  ▼
Authentication
  │
  ▼
Album Ownership Check
  │
  ▼
Multer
  │
  ├── File Type Validation
  │
  ├── File Size Validation
  │
  └── Unique Filename
  │
  ▼
Image Controller
  │
  ▼
MongoDB Metadata
```

Only the following MIME types are accepted:

```text
image/jpeg
image/png
image/webp
```

---

# Tech Stack

## Frontend

* React 19
* Vite
* React Router
* Axios
* Bootstrap 5
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

## Development

* Git
* GitHub
* VS Code
* Postman
* Nodemon

---

# Project Structure

```text
KaviosPix/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
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
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Environment Variables

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

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Never commit real credentials or secrets.

---

# Getting Started

## 1. Clone

```bash
git clone https://github.com/sunny-raj-sah/KaviosPix.git
cd KaviosPix
```

## 2. Backend

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

## 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Google OAuth Configuration

The application requires Google OAuth credentials.

Configure the Google OAuth application with the backend callback:

```text
http://localhost:5000/auth/google/callback
```

The frontend handles the authentication callback and stores the returned authentication information before navigating into the protected application.

---

# Engineering Challenges

## 1. Separating Authentication and Authorization

A major design consideration was avoiding the assumption that a logged-in user automatically has access to every resource.

The application therefore uses two separate concepts:

```text
Authentication
      ↓
Is the user logged in?
```

and:

```text
Authorization
      ↓
Can this user access this specific album?
```

---

## 2. Protecting Images

Serving image files directly without authorization could allow unauthorized users to access private images.

The solution was to protect the image endpoint itself.

```text
JWT
 ↓
Album Access
 ↓
Image Ownership / Relationship
 ↓
Serve File
```

---

## 3. Owner vs Shared User Permissions

Album sharing introduced different permission levels.

The backend therefore distinguishes:

```text
Owner
```

from:

```text
Shared User
```

This prevents a shared user from automatically gaining owner privileges.

---

## 4. File Validation

Uploaded files cannot be trusted simply because the frontend validates them.

The backend independently validates:

```text
File Type
File Size
Upload Errors
```

This provides defense at the API layer.

---

## 5. Resource Relationship Validation

An image request contains both:

```text
albumId
imageId
```

The backend verifies that the requested image actually belongs to the requested album.

This prevents an image belonging to one album from being accessed through another album's route.

---

# What I Learned

Building KaviosPix strengthened my understanding of full-stack application architecture.

### React

* Component-based architecture
* React Router
* Protected routes
* Context API
* Authentication state
* Reusable components
* API integration
* Form handling
* Loading and error states

### Node.js / Express

* REST API design
* Middleware composition
* Controllers
* Authentication middleware
* Authorization middleware
* Error handling
* Multipart uploads
* Protected resource serving

### MongoDB

* Mongoose schemas
* Resource relationships
* Indexed identifiers
* Array-based sharing relationships
* Query filtering
* Updating nested resources

### Authentication

* Google OAuth
* Passport.js
* JWT generation
* JWT verification
* Bearer authentication
* Frontend authentication state

### Security

Most importantly, I learned that:

```text
Frontend restriction
        ≠
Backend security
```

For example, hiding a Delete button does not secure the API.

The backend must still perform:

```text
Authenticate
     ↓
Authorize
     ↓
Validate Resource
     ↓
Execute Operation
```

---

# Future Improvements

Potential improvements include:

* Cloud image storage
* Image thumbnails
* Pagination
* Infinite scrolling
* Image search
* Album cover images
* Improved image preview
* More granular sharing permissions
* Image metadata extraction
* Automated testing
* API documentation
* Better caching
* Production monitoring
* Improved upload performance

---

# Project Status

KaviosPix is an actively developed full-stack project focused on:

```text
React
+
Node.js
+
Express
+
MongoDB
+
OAuth
+
JWT
+
Authorization
+
File Management
```

The project demonstrates how authentication, authorization, file handling, and resource-level security can be combined into a practical full-stack application.

---

# Author

**Sunny Raj**

GitHub:
https://github.com/sunny-raj-sah

LinkedIn:
https://www.linkedin.com/in/sunny-raj-885588313/

---

> **KaviosPix — Organize. Protect. Share.**
