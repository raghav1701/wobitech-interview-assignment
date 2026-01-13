# 📍 Map Pinboard Application

An interactive map-based pinboard application built with Next.js, TypeScript, and Leaflet. Drop pins anywhere on the map, view detailed location information, and manage your pins with ease.

🔗 **[Live Demo](https://wobitech-interview-assignment.vercel.app/)**

![Map Pinboard](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green)

## ✨ Features

- Desktop, Mobile (Landscape & Potrait)
- All Bonus Features Implemented
## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Map Library**: [Leaflet](https://leafletjs.com/) via [react-leaflet](https://react-leaflet.js.org/)
- **Geocoding**: [OpenStreetMap Nominatim API](https://nominatim.org/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd map-pinboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Add custom pin SVG files** (optional)

Create these files in the `public` folder:
- `public/pin.svg` - Default pin marker (blue)
- `public/pin-red.svg` - Highlighted pin marker (red)

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure
```
map-pinboard/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main page with state management
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles & animations
│   ├── components/
│   │   ├── MapView.tsx           # Map container component
│   │   ├── MapClickHandler.tsx   # Handles map click events
│   │   ├── PinMarkers.tsx        # Renders pin markers with popups
│   │   ├── PinList.tsx           # Sidebar/bottom sheet pin list
│   │   └── PinListItem.tsx       # Individual pin list item
│   ├── lib/
│   │   ├── geocoding.ts          # Reverse geocoding utility
│   │   └── leaflet-config.ts     # Leaflet icon configuration
│   └── types/
│       └── pin.ts                # TypeScript interfaces
├── public/
│   ├── pin.svg                   # Custom pin marker
│   └── pin-red.svg               # Highlighted pin marker
└── package.json
```


## 📧 Contact

For questions or feedback, please reach out or open an issue!

---

**Made with ❤️ using Next.js and Leaflet**

🔗 [Live Demo](https://wobitech-interview-assignment.vercel.app/)
