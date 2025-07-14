# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for C3 Toronto's Connect Groups discovery platform. It provides an intuitive interface for church members to discover and join Connect Groups, leveraging Planning Center as the data source and Google Maps for location-based browsing.

## Development Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

**Important**: Always run `npm run lint` and `npm run type-check` before committing changes.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS 4.x with C3 brand tokens
- **State Management**: Zustand for client-side state
- **API Integration**: Planning Center API (backend) + Google Maps JavaScript API
- **UI Components**: Radix UI primitives + custom components
- **Icons**: Lucide React

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # C3 brand CSS variables and Tailwind
│   ├── layout.tsx      # Root layout with C3 branding
│   ├── page.tsx        # Home page (Connect Groups discovery)
│   └── api/            # API routes for Planning Center integration
├── components/         # React components
│   ├── ui/             # Base UI components (Radix-based)
│   ├── layout/         # Layout components (Header, Hero)
│   ├── groups/         # Group-specific components (Cards, List, Filters)
│   └── map/            # Google Maps integration components
├── lib/                # Utility functions and configurations
├── store/              # Zustand state management
└── types/              # TypeScript type definitions
```

### Key Types (src/types/index.ts)
- `Group`: Planning Center group data structure
- `GroupFilters`: Search and filter state
- `MapState`: Google Maps state (center, zoom, bounds)
- `AppState`: Complete Zustand store interface

### State Management (src/store/useGroupStore.ts)
Uses Zustand with actions for:
- `setGroups()`: Update groups list from API
- `updateFilters()`: Manage search/filter state
- `updateMapState()`: Handle map interactions
- `updateUIState()`: Control loading/view states
- `clearFilters()`: Reset all filters

## C3 Brand Implementation

### Colors (CSS Variables)
```css
--c3-primary-blue: #006acc     /* Primary brand color */
--c3-text-primary: #292929     /* Main text color */
--c3-text-secondary: #404040   /* Secondary text color */
--c3-border: #e5e5e5          /* Border color */
```

### Typography
- Font: Inter with system font fallbacks
- Border radius: 3px (C3 brand standard)
- Font smoothing: `-webkit-font-smoothing: antialiased`

## API Integration

### Planning Center API
- Primary data source for Connect Groups
- Requires API credentials in `.env.local`
- Rate limiting considerations for production

### Google Maps API
- Location-based group discovery
- Requires Google Maps API key
- Geolocation API for "near me" functionality

## Development Guidelines

### Component Patterns
- Use Radix UI primitives for accessibility
- Follow existing component structure in `components/` directories
- Implement responsive design (mobile-first)
- Maintain WCAG 2.1 AA accessibility standards

### Styling Conventions
- Use Tailwind CSS classes
- Reference C3 brand colors via CSS variables
- 3px border radius for consistency
- Inter font with proper fallbacks

### Performance Considerations
- Use Next.js Image component for optimization
- Implement proper loading states
- Cache API responses appropriately
- Consider map tile caching for Google Maps

## Key Features Implementation

### Group Discovery
- Search functionality across group names/descriptions
- Multi-criteria filtering (location, day, time, type)
- Real-time filter updates with result counts

### Map Integration
- Interactive Google Maps with group pins
- Pin clustering for dense areas
- User location detection (with permission)
- Map bounds sync with visible groups

### Responsive Design
- Desktop: 60/40 split (cards/map)
- Tablet: 70/30 split with smaller cards
- Mobile: Stacked layout with collapsible filters

## Important Files

- `PRD.md`: Complete product requirements and specifications
- `UX.md`: Detailed design system and user experience guidelines
- `src/app/globals.css`: C3 brand variables and base styles
- `src/types/index.ts`: Core TypeScript interfaces
- `src/store/useGroupStore.ts`: Application state management

## Testing & Quality

Always verify:
1. TypeScript compilation: `npm run type-check`
2. ESLint compliance: `npm run lint`
3. Responsive design across breakpoints
4. Accessibility standards (keyboard navigation, screen readers)
5. Google Maps API integration functionality


When adding new features or changing existing ones, make sure to keep the PRD.md up to date.

