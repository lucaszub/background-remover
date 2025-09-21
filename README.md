# Background Remover - AI-Powered SaaS Platform

A complete full-stack web application for removing image backgrounds using artificial intelligence, featuring user authentication, quota management, and persistent image storage.

<img width="2088" height="1307" alt="Background Remover Application" src="https://github.com/user-attachments/assets/c2b7e752-6f4b-41c7-b98d-a75a2702ef89" />

## 🚀 Features

### 🎯 Core Functionality
- **AI Background Removal**: One-click background removal using the `rembg` ML model
- **Real-time Processing**: Fast image processing with progress indicators
- **Multiple Format Support**: JPEG, PNG, and WebP input formats
- **High-Quality Output**: PNG output with transparent backgrounds

### 🔐 Authentication & User Management
- **Google OAuth Integration**: Secure authentication via NextAuth.js
- **User Profiles**: Complete account management system
- **Anonymous Access**: Limited usage for non-authenticated users
- **Session Management**: Persistent login sessions

### 📊 Quota Management System
- **Anonymous Users**: 5 images per day (IP-based tracking)
- **Authenticated Users**: 20 images per day with account tracking
- **Real-time Quota Display**: Live usage indicators and warnings
- **Smart Reset System**: Daily quota resets with timezone support
- **Plan Types**: FREE, PREMIUM, ENTERPRISE support ready

### 🖼️ Personal Image Gallery
- **Persistent Storage**: Images saved to Azure Blob Storage
- **Complete Gallery Interface**: View, organize, and manage processed images
- **Search & Filter**: Find images by name, tags, or favorites
- **Image Metadata**: Processing time, file size, dimensions tracking
- **Favorites System**: Mark and filter favorite images
- **Bulk Operations**: Delete and organize multiple images
- **Download History**: Re-download any previously processed image

### 📱 Modern UI/UX
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Theme**: Modern dark interface with Tailwind CSS 4
- **Real-time Feedback**: Loading states, progress indicators, and error handling
- **Accessibility**: WCAG compliant design patterns
- **Progressive Enhancement**: Works without JavaScript for core functionality

## 🏗️ Architecture

### Full-Stack Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │   FastAPI       │
│   (Next.js 15)  │───▶│   Routes        │───▶│   (ML Engine)   │
│                 │    │   (Middleware)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   PostgreSQL    │              │
         │              │   + Prisma ORM  │              │
         │              └─────────────────┘              │
         │                                                │
         ▼                                                ▼
┌─────────────────┐                            ┌─────────────────┐
│   Azure Blob    │                            │   rembg ML      │
│   Storage       │                            │   Model         │
│   (Images)      │                            │   Processing    │
└─────────────────┘                            └─────────────────┘
```

### Request Flow
1. **Frontend** → Next.js API routes → FastAPI backend
2. **Next.js API routes** handle: Authentication, quota management, database operations
3. **FastAPI backend** handles: ML processing only (isolated and stateless)
4. **Response flow**: Processed image → Azure storage → Database metadata → Client

### Technology Stack

#### Frontend
- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS 4**: Modern utility-first CSS framework
- **NextAuth.js**: Authentication with Google OAuth
- **Lucide React**: Beautiful icon library
- **Sharp**: Image processing and optimization

#### Backend
- **FastAPI**: High-performance Python web framework
- **rembg 2.0.50**: State-of-the-art background removal AI model
- **Uvicorn**: Lightning-fast ASGI server
- **Python 3.11+**: Modern Python with async support

#### Database & Storage
- **PostgreSQL**: Robust relational database
- **Prisma ORM**: Type-safe database access with migrations
- **Azure Blob Storage**: Scalable cloud storage for images
- **Connection pooling**: Optimized database connections

#### Analytics & Monitoring
- **Vercel Analytics**: Real-time performance monitoring
- **Google Analytics**: User behavior tracking
- **Custom metrics**: Processing time and usage analytics

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.11+** with pip
- **PostgreSQL 14+** database
- **Azure Storage Account**
- **Google OAuth Application**

### Frontend Setup

1. **Clone and navigate to frontend**:
```bash
git clone <repository-url>
cd background-remover/front
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment configuration**:
Create `.env.local` with the following variables:
```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# FastAPI Backend
FASTAPI_URL=http://localhost:8000
FASTAPI_SECRET_KEY=your-fastapi-secret-key

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
```

4. **Database setup**:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

5. **Start development server**:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd background-remover/back
```

2. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Environment configuration**:
Create `.env` with:
```bash
FASTAPI_SECRET_KEY=your-fastapi-secret-key  # Must match frontend
```

5. **Start backend server**:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Authentication Flow
All requests to `/api/remove-background` and `/api/images/*` require session authentication via NextAuth.js. Anonymous users can access background removal with IP-based quota limits.

### Core Endpoints

#### `POST /api/remove-background`
Process an image to remove its background.

**Headers**: Session cookie (automatic)
**Body**: `multipart/form-data` with `image` file
**Response**: PNG image with transparent background

**Response Headers**:
- `X-Quota-Usage`: Current quota usage
- `X-Quota-Limit`: Quota limit
- `X-Quota-Remaining`: Remaining quota
- `X-Processing-Time`: Processing time in ms
- `X-Image-Id`: Image ID (authenticated users only)

#### `GET /api/quotas`
Get current user quota information.

**Response**:
```json
{
  "usage": 3,
  "limit": 20,
  "remaining": 17,
  "canUse": true,
  "percentage": 15,
  "status": "safe",
  "isAuthenticated": true,
  "quotaType": "free",
  "resetTime": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /api/images`
Get user's image gallery with pagination and filtering.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `search`: Search by image name
- `tags`: Filter by tags (comma-separated)
- `favorites`: Show only favorites (true/false)

**Response**:
```json
{
  "images": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalCount": 45,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### `GET /api/images/[id]`
Get specific image details with SAS URLs for download.

#### `PATCH /api/images/[id]`
Update image metadata (title, tags, favorite status).

#### `DELETE /api/images/[id]`
Delete image from storage and database.

### FastAPI Backend Endpoints

#### `GET /`
Health check endpoint.

#### `POST /process-image`
Internal ML processing endpoint (not directly accessible from frontend).

**Headers**: `x-api-key: <FASTAPI_SECRET_KEY>`
**Body**: `multipart/form-data` with `file`
**Response**: PNG image data

## 🗄️ Database Schema

### Core Models

#### User
- Authentication and profile information
- Linked to Google OAuth accounts
- One-to-many relationship with images and quota usage

#### UserQuota
- Daily and monthly limits per user
- Plan types: FREE, PREMIUM, ENTERPRISE
- Automatic daily resets

#### UserImage
- Complete image metadata
- Azure Blob Storage URLs (original, processed, thumbnail)
- File information (size, type, dimensions)
- Organization features (tags, favorites, public/private)

#### QuotaUsage
- Detailed usage tracking
- IP address and user agent logging
- Processing time and file size metrics

## 🚀 Deployment

### Production Environment Variables

Ensure all environment variables are properly configured:

**Frontend (.env.local)**:
```bash
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FASTAPI_URL=https://api.yourdomain.com
FASTAPI_SECRET_KEY=...
AZURE_STORAGE_CONNECTION_STRING=...
```

**Backend (.env)**:
```bash
FASTAPI_SECRET_KEY=... # Must match frontend
```

### Azure Container Apps

Deploy both frontend and backend to Azure Container Apps:

1. **Build and push Docker images**
2. **Configure environment variables**
3. **Set up custom domains and SSL**
4. **Configure CORS policies**

Deployment scripts are included in the `back/` directory for reference.

## 🎨 Component Library

### Core Components
- **Header**: Navigation with authentication status
- **Hero**: Landing page hero section
- **ImageUpload**: Drag-and-drop file upload with validation
- **ImagePreview**: Before/after image comparison
- **QuotaDisplay**: Real-time quota usage indicator
- **ImageGallery**: Paginated image grid with filters
- **ImageModal**: Full-screen image viewer with metadata
- **ErrorNotification**: Toast-style error messages

### UI Components
- **AuthProvider**: NextAuth.js session management
- **GalleryFilters**: Search and filter controls
- **MobileMenu**: Responsive navigation
- **Footer**: Site footer with links

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database admin panel
npx prisma db push   # Push schema changes to database
```

### Backend
```bash
uvicorn main:app --reload               # Development server
uvicorn main:app --host 0.0.0.0 --port 8000  # Production server
pytest                                  # Run tests
```

## 📱 Usage Examples

### Background Removal
1. Visit the application homepage
2. Upload an image (JPEG, PNG, or WebP)
3. Click "Remove Background"
4. Download the processed image with transparent background

### Gallery Management
1. Sign in with Google OAuth
2. Upload and process images
3. View your gallery with all processed images
4. Search, filter, and organize your images
5. Mark favorites and add tags
6. Download any previous image

### Quota Monitoring
- Check quota usage in the header
- View detailed quota information in your account
- Upgrade prompts when approaching limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and portfolio purposes.

## 🔗 Links

- **Live Demo**: [https://background-remover.lucaszubiarrain.com](https://background-remover.lucaszubiarrain.com)
- **API Documentation**: [https://api.background-remover.lucaszubiarrain.com](https://api.background-remover.lucaszubiarrain.com)

---

Built with ❤️ using Next.js, FastAPI, and Azure Cloud Services