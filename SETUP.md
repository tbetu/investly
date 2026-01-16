# Investly - Setup Instructions

## Quick Start

1. **Open a terminal** in this folder

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will install:
   - expo ~54.0.0
   - react-native
   - @react-navigation/native
   - @react-navigation/native-stack
   - @react-navigation/bottom-tabs
   - react-native-safe-area-context
   - react-native-screens
   - @expo/vector-icons

3. **Start the app:**
   ```bash
   npx expo start
   ```

4. **Run on your device:**
   - Download the **Expo Go** app on your phone
   - Scan the QR code shown in the terminal
   - The app will load on your device!

## Troubleshooting

### "Cannot find module" errors
Run `npm install` again to ensure all dependencies are installed.

### Metro bundler issues
Try clearing the cache:
```bash
npx expo start -c
```

### TypeScript errors
These may appear in your IDE but shouldn't prevent the app from running.
If they do, try:
```bash
npx expo install --fix
```

## Adding Custom Icons (Optional)

To customize the app icon and splash screen, add these files to the `assets/` folder:

- `icon.png` (1024x1024) - App store icon
- `splash-icon.png` (288x288) - Splash screen logo
- `adaptive-icon.png` (1024x1024) - Android adaptive icon

Then update `app.json` to reference them:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    }
  }
}
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npx expo start` | Start development server |
| `npx expo start -c` | Start with cache cleared |
| `npx expo start --ios` | Open in iOS simulator |
| `npx expo start --android` | Open in Android emulator |
| `npx expo start --web` | Open in web browser |

## Project Structure

```
src/
├── components/     # Reusable UI components (Button, Card, etc.)
├── context/        # Global state management (AppContext)
├── data/           # Static data (lessons, scenarios, market data)
├── navigation/     # React Navigation setup
├── screens/        # All app screens
└── types/          # TypeScript type definitions
```

## What's Included

✅ Splash Screen with app branding
✅ 3-slide onboarding carousel
✅ Age level selection (Elementary → University)
✅ Home dashboard with portfolio overview
✅ Learn section with lessons and quizzes
✅ Scenarios for practice with economic news
✅ Portfolio with practice buy/sell
✅ Profile with progress and badges
✅ Bottom tab navigation
✅ Stack navigation for detail screens
✅ Global state management
✅ All static data (no API calls)

## Notes

- All market data is **static** - no real-time updates
- This is an MVP - no authentication or backend
- Content is filtered by age level
- Works with Expo Go (no native modules required)
