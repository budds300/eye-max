# EYEMAX Setup Guide

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration (Required)
NEXT_FIREBASE_API_KEY=your-firebase-api-key
NEXT_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_FIREBASE_PROJECT_ID=your-project-id
NEXT_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_FIREBASE_APP_ID=your-app-id

# TMDB API (Required for movie/TV show data)
TMDB_API_KEY=your-tmdb-api-key
```

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Give your project a name (e.g., "eyemax-app")

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Enable and allow users to sign up
   - **Google**: Enable and configure OAuth consent screen

### 3. Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "eyemax-web")
6. Copy the configuration object and add the values to your `.env.local` file

### 4. Create Demo User (Optional)

1. In Firebase Authentication, go to "Users" tab
2. Click "Add user"
3. Create a user with:
   - **Email**: demo@example.com
   - **Password**: demo123

## TMDB API Setup

1. Visit [TMDB](https://www.themoviedb.org/settings/api)
2. Create an account and request an API key
3. Add the API key to your `.env.local` file

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features Implemented

✅ **Navigation**: Responsive navigation with Home, Movies, TV Shows links
✅ **TV Shows**: Complete TV shows listing and individual TV show viewing
✅ **Movies**: Complete movies listing and individual movie viewing
✅ **Firebase Authentication**: Email/password and Google OAuth authentication
✅ **Search**: Global search functionality for movies and TV shows
✅ **Responsive Design**: Mobile-friendly navigation and layouts
✅ **Fixed Black Background**: Reduced overlay opacity on movie/TV show posters

## Authentication Features

- **Email/Password Sign Up & Sign In**: Users can create accounts and sign in
- **Google OAuth**: One-click sign in with Google accounts
- **Demo Account**: Quick access with demo credentials
- **User Profile**: Display user name and profile picture
- **Secure Logout**: Proper session management

## Navigation Structure

- **Home**: Landing page with trending content
- **Movies**: Browse all movies with categories (Popular, Top Rated, Now Playing, Upcoming)
- **TV Shows**: Browse all TV shows with categories (Popular, Top Rated, On Air)
- **Search**: Global search functionality
- **Login**: Firebase authentication with email/password or Google OAuth
