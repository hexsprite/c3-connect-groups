# C3 Connect Groups

A modern web application for discovering and joining Connect Groups at C3 Toronto, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Smart Search & Filtering** - Find groups by location, meeting day, time, and type
- 🗺️ **Interactive Map View** - Browse groups geographically with Google Maps integration
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ♿ **Accessibility First** - WCAG 2.1 AA compliant
- 🎨 **C3 Brand Design** - Consistent with C3 Toronto's visual identity

## Technology Stack

- **Framework**: Next.js 15.x with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with C3 brand tokens
- **State Management**: Zustand
- **Maps**: Google Maps JavaScript API
- **API Integration**: Planning Center API
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Planning Center API credentials
- Google Maps API key

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd c3-connect-groups
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and add your API keys:
- Planning Center API credentials
- Google Maps API key

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
src/
├── app/                  # Next.js App Router
│   ├── globals.css      # C3 brand CSS variables
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── api/             # API routes
├── components/          # React components
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components
│   ├── groups/          # Group-specific components
│   └── map/             # Map components
├── lib/                 # Utility functions
├── store/               # Zustand stores
└── types/               # TypeScript definitions
\`\`\`

## Development Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking

## Design System

The application uses C3 Toronto's brand colors and typography:

- **Primary Blue**: #006acc
- **Text Colors**: #292929 (primary), #404040 (secondary)
- **Font**: Inter with system font fallbacks
- **Border Radius**: 3px (C3 brand standard)

## Contributing

1. Follow the existing code style and conventions
2. Ensure accessibility standards are maintained
3. Test on mobile devices
4. Run type checking and linting before submitting

## Documentation

- [Product Requirements Document](./PRD.md)
- [UX Design Specification](./UX.md)

## License

MIT License - see LICENSE file for details.