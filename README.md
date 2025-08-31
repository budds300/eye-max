
# EyeMax - Movie Recommendation Application

A modern, responsive movie recommendation application built with Next.js, TypeScript, and TailwindCSS. Discover and explore movies with personalized recommendations powered by the TMDB API.

## Features

- 🎬 **Movie Discovery**: Browse popular, top-rated, and now-playing movies
- 🔍 **Smart Search**: Search movies by title with debounced input
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- ⚡ **Fast Performance**: Optimized with caching and lazy loading
- 🎨 **Modern UI**: Smooth animations and transitions with Framer Motion
- 🔐 **Authentication**: GitHub OAuth integration with NextAuth.js
- 📊 **Movie Details**: Comprehensive movie information including cast, crew, and recommendations
- 🧪 **Testing**: Comprehensive Jest and React Testing Library tests
- 🚀 **CI/CD**: Automated testing and deployment with GitHub Actions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js with GitHub OAuth
- **API**: TMDB (The Movie Database)
- **Testing**: Jest + React Testing Library
- **Animations**: Framer Motion
- **UI Components**: Custom components with Radix UI primitives
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub account (for OAuth)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eye-max
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# TMDB API Configuration
TMDB_API_KEY=<your-api-key>
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

4. Set up Firebase Authentication:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication in the Firebase console
   - Add Email/Password and Google sign-in methods
   - Get your Firebase configuration from Project Settings
   - Copy the configuration values to your `.env.local` file

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── movie/[id]/        # Movie details page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── MovieCard.tsx     # Movie card component
│   ├── MovieDetails.tsx  # Movie details component
│   ├── MovieList.tsx     # Movie list component
│   └── SearchBar.tsx     # Search component
├── services/             # API services
│   └── MovieService.ts   # TMDB API service
├── store/                # State management
│   └── movieStore.ts     # Zustand store
├── lib/                  # Utility functions
│   └── utils.ts          # Common utilities
└── __tests__/           # Test files
    ├── MovieList.test.tsx
    └── MovieDetails.test.tsx
```

## API Integration

The application integrates with the TMDB API to fetch:
- Popular, top-rated, and now-playing movies
- Movie details with cast and crew information
- Movie recommendations
- Search functionality

All API calls are cached for 5 minutes to improve performance.

## Testing

The application includes comprehensive tests for core components:

- **MovieList**: Tests loading states, error handling, and movie rendering
- **MovieDetails**: Tests movie information display and user interactions

Run tests with:
```bash
npm run test
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## CI/CD

The project includes GitHub Actions workflow that:
- Runs linting and tests on push
- Deploys to Vercel when tests pass
- Supports multiple Node.js versions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and linting
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie data API
- [Next.js](https://nextjs.org/) for the amazing React framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
