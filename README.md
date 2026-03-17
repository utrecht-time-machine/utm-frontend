# Utrecht Time Machine - Front-end

## Prerequisites

- Node.js 22+
- npm
- Angular CLI
- For mobile development: Cordova CLI and Android/iOS SDKs

### Public APIs Used

The application uses these public APIs:

- **Utrecht Time Machine Data API (Drupal)**: `https://data.utrechttimemachine.nl`
  - Locations, themes, routes, and media content
  - Live search functionality
- **Utrecht Time Machine Services API (Express)**: `https://services.utrechttimemachine.nl`
  - Translation services
  - Feedback and comment submission
- **Mapbox API**: Public token included for map rendering
  - Geocoding and directions services

## Installation

```bash
npm install
```

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The production build uses Server-Side Rendering (SSR) for optimal performance and SEO.

### Production Deployment

The production deployment (https://utrechttimemachine.nl) is automated through GitHub Actions:

1. **E2E Testing**: Cypress tests run automatically against a local production build
2. **Docker Build**: If tests pass, a Docker image is built with the SSR application
3. **Deployment**: The Docker image is deployed to the VPS via SSH

Push to the main branch to trigger the complete CI/CD pipeline.

### Environment Setup for Mobile

For Cordova mobile builds, create `cordova/.env`:

```bash
# Geolocation license key for cordova-background-geolocation-lt
GEOLOCATION_LICENSE_KEY=your_license_key_here
```

Get your license key from: [cordova-background-geolocation-lt](https://www.transistorsoft.com/shop/products/cordova-background-geolocation)

The geolocation plugin is used for background location tracking to provide notifications while following walking or bicycle routes.

### Android Build Setup

1. Copy `cordova/build.json.template` to `cordova/build.json` and fill in your keystore details:

```json
{
  "android": {
    "release": {
      "keystore": "android.keystore",
      "keystoreType": "pkcs12",
      "storePassword": "your_store_password",
      "alias": "utm-android-app-key",
      "password": "your_key_password",
      "packageType": "bundle"
    }
  }
}
```

2. Update the version number in `cordova/config.xml` before building releases
3. App IDs:
   - **Android**: `com.utm.utrechttimemachine`
   - **iOS**: `nl.utrechttimemachine`

```bash
npm run build:android  # Build for Android
npm run build:ios      # Build for iOS
npm run run:android    # Run on Android device/emulator
npm run run:ios        # Run on iOS device/simulator
```

Builds are published through [Google Play Console](https://play.google.com/console/about/) and [App Store Connect](https://appstoreconnect.apple.com/).

## End-to-end testing (Cypress)

```bash
npm run cypress:open  # Open Cypress test runner for interactive testing
npm run cypress:run:local-prod  # Run tests against local production build
npm run cypress:run:live-prod   # Run tests against live production site
```
