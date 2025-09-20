# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a background removal web application with a modern full-stack architecture:

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS 4, NextAuth.js authentication
- **Backend**: Python FastAPI with rembg AI model for background removal
- **Database**: PostgreSQL with Prisma ORM for user management and quota tracking
- **Storage**: Azure Blob Storage for persistent image storage with gallery functionality
- **Analytics**: Google Analytics and Vercel Analytics

## Development Commands

### Frontend (Next.js)

```bash
cd front
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (FastAPI)

```bash
cd back
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Database

```bash
cd front
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema changes to database
npx prisma studio     # Open Prisma Studio
```

## Architecture Overview

### API Flow Architecture

The application uses a **proxy pattern** where Next.js API routes act as middleware between the frontend and FastAPI:

1. **Frontend** → Next.js API routes → FastAPI backend
2. **Next.js API routes** handle: authentication, quota management, database operations
3. **FastAPI backend** handles: ML processing only

### API Routes Structure

```
front/app/api/
├── auth/[...nextauth]/     # NextAuth.js authentication
├── quotas/                 # Quota checking and status
├── remove-background/      # Main image processing endpoint
└── images/                 # Gallery API endpoints
    ├── route.ts            # GET: List user images with pagination/filters
    └── [id]/route.ts       # GET/PATCH/DELETE: Individual image operations
```

### Authentication & Authorization

- **Frontend Authentication**: NextAuth.js with Google OAuth
- **API Route Protection**: Server-side session checking in Next.js API routes
- **Backend Security**: FastAPI protected by API key from Next.js routes
- **User Types**: Authenticated users (higher quotas) vs Anonymous users (IP-based quotas)

### Quota Management System

- **Anonymous users**: 5 images/day tracked by IP address
- **Authenticated users**: 20 images/day tracked via database
- **Real-time checking**: Before processing in Next.js API route
- **Usage tracking**: Metadata stored after successful processing

### Backend (FastAPI) - ML Processing Only

- **Single endpoint**: `/process-image`
- **Purpose**: Pure ML processing with rembg model
- **Authentication**: Simple API key validation (`x-api-key` header)
- **Input**: Multipart file upload (JPEG, PNG, WebP)
- **Output**: PNG with transparent background

### Frontend API Client

Located in `front/lib/api.ts`:

- `removeBackground(file)`: Calls Next.js API route `/api/remove-background`
- `getQuotas()`: Fetches current user quota status
- `getImages(filters)`: Fetches user's image gallery with pagination/search
- `getImage(id)`: Gets individual image with SAS URLs
- `updateImage(id, data)`: Updates image metadata (title, tags, favorites)
- `deleteImage(id)`: Deletes image from storage and database
- Error handling with typed responses for quota exceeded scenarios

## Key Configuration

### Environment Variables

**Frontend (.env.local)**:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=
FASTAPI_URL=http://localhost:8000
FASTAPI_SECRET_KEY=
AZURE_STORAGE_CONNECTION_STRING=
```

**Backend**:

```
FASTAPI_SECRET_KEY=  # Must match frontend FASTAPI_SECRET_KEY
```

### Database Schema (Prisma)

Key models:

- `User`: OAuth user accounts with gallery relationship
- `UserQuota`: Daily/monthly limits and usage tracking
- `QuotaUsage`: Individual processing records with metadata
- `UserImage`: Azure Blob Storage references with metadata (original, processed, thumbnails)

## Development Workflow

### Request Flow for Image Processing

1. **Frontend** uploads image via `removeBackground()` function
2. **Next.js API route** `/api/remove-background`:
   - Checks user session (authenticated vs anonymous)
   - Validates quota limits (database for auth users, IP tracking for anonymous)
   - Validates file type and size
   - Forwards request to FastAPI with API key
3. **FastAPI backend** processes image and returns result
4. **Next.js API route** saves images to Azure Blob Storage (for authenticated users)
5. **Next.js API route** creates UserImage database record with metadata
6. **Next.js API route** increments usage counters and returns processed image
7. **Frontend** receives processed image or quota error

### Adding New API Endpoints

1. Create route in `front/app/api/[endpoint]/route.ts`
2. Add authentication/quota checks as needed
3. Call FastAPI if ML processing required
4. Add client function in `front/lib/api.ts`

### Database Changes

1. Modify Prisma schema in `front/prisma/schema.prisma`
2. Run `npx prisma db push` to update database
3. Run `npx prisma generate` to update client
4. Update quota functions in `front/lib/quotas-db.ts`

## Important Implementation Notes

- **Quota Enforcement**: Always check quotas in Next.js API routes before processing
- **Error Handling**: Distinguish between quota errors (429) and processing errors (500)
- **Security**: Never expose FastAPI directly to frontend; always proxy through Next.js
- **File Validation**: Both Next.js route and FastAPI validate file types
- **Performance**: Track processing time and file size for analytics

## Testing Strategy

- **Backend**: Test FastAPI endpoints directly with pytest
- **API Routes**: Test Next.js API routes with authentication states
- **Integration**: Test complete flow: auth → quota check → processing → increment
- **Quota Logic**: Test daily resets and different user types
