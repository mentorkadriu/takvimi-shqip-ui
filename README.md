# Takvimi Shqip - Islamic Prayer Times App

A modern, responsive web application for Muslims to check prayer times and find the Qibla direction. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

### Prayer Times
- Real-time prayer times based on user location
- Displays Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha times
- Shows next prayer time with countdown
- Includes Hijri date information

### Qibla Direction
- Interactive compass to find the direction to the Kaaba
- Uses device orientation for real-time updates
- Displays precise angle from North
- Shows user's current coordinates

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: React 18 with Server Components
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Data Fetching**: Aladhan API for prayer times
- **Geolocation**: Browser Geolocation API
- **Device Orientation**: DeviceOrientation API

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/takvimi-shqip-ui.git
cd takvimi-shqip-ui

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm start
# or
yarn start
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── icons.tsx         # SVG icons used throughout the app
│   │   └── PrayerTimes.tsx   # Prayer times component
│   ├── qibla/
│   │   └── page.tsx          # Qibla direction page
│   ├── services/
│   │   └── prayerTimes.ts    # API services for prayer times
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── public/                   # Static assets
└── ...
```
## TODO:

- PrayerTimesList.tsx: improve timeline from https://codepen.io/bbera/pen/gOMKYKg and make list item as card
- Add notifications page
- Add theme for each time

icons: https://www.flaticon.com/packs/ramadan-kareem-15993742/2