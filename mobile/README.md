# qiymetleri.com Android app

Native Expo/React Native client for the public qiymetleri.com catalogue. The existing FastAPI backend remains the data source; admin functionality is intentionally excluded.

## Local setup

```powershell
Copy-Item .env.example .env
npm install
npm run android
```

The default `.env.example` URL targets a FastAPI server running on the Windows host from the standard Android emulator (`10.0.2.2`). For a physical device or production build, set `EXPO_PUBLIC_API_URL` to an HTTPS endpoint reachable by that device.

## Checks

```powershell
npm run lint
npm run typecheck
npm test -- --runInBand
npx expo export --platform android
```
