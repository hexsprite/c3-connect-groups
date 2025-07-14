# UX Design Specification: C3 Connect Groups

## Overview

This document outlines the user experience design for the C3 Connect Groups discovery page, featuring an Airbnb-inspired interface that combines intuitive filtering, search functionality, and map-based browsing to help church members find and join Connect Groups.

## Design Goals

- **Discoverability**: Make it easy for users to find groups that match their preferences
- **Visual Appeal**: Modern, clean interface that reflects C3's brand identity
- **Usability**: Intuitive navigation and filtering system
- **Accessibility**: WCAG 2.1 AA compliant design
- **Performance**: Fast loading and responsive interactions

## Page Layout Structure

### 1. Header Navigation
```
+----------------------------------------------------------------+
|  [C3 TORONTO]                              [JOIN ON SUNDAY]   |
+----------------------------------------------------------------+
```

**Components:**
- **Logo/Brand**: C3 Toronto logo (top-left)
- **Primary CTA**: "JOIN ON SUNDAY" button (top-right)
- **Mobile Menu**: Hamburger menu for mobile devices

**Specifications:**
- Height: 80px
- Background: White (#ffffff) with subtle shadow
- Logo: C3 Toronto brand mark, 120px wide
- CTA Button: C3 Blue (#006acc), white text, rounded corners (3px radius)
- Font: Inter system font stack
- Button hover: #0084ff

### 2. Hero Section
```
+----------------------------------------------------------------+
|                    JOIN A CONNECT GROUP                       |
|                                                               |
|    At C3 Toronto, Connect Groups play a vital role in        |
|    creating community, growing our faith, and connecting     |
|    people to God. Our groups run on a semester basis,        |
|    with the next season starting June 3rd!                   |
|                                                               |
|    Fall: September - November                                 |
|    Winter: February - April                                   |
|    Summer: June - July                                        |
+----------------------------------------------------------------+
```

**Specifications:**
- Background: White (#ffffff) 
- Padding: 60px vertical, 20px horizontal
- Typography: 
  - Headline: 48px, bold, C3 text primary (#292929), Inter font
  - Body text: 18px, regular, C3 text secondary (#404040)
  - Season info: 16px, medium weight, C3 text secondary (#404040)
- Font smoothing: -webkit-font-smoothing: antialiased

### 3. Search & Filter Interface

```
+----------------------------------------------------------------+
| [Search for groups...]  [Location ▼] [Day ▼] [Time ▼] [Type ▼] |
+----------------------------------------------------------------+
|    < Filters    [Downtown ×]                     91 Groups     |
+----------------------------------------------------------------+
```

**Components:**

#### Primary Search Bar
- **Placeholder**: "Search for groups..."
- **Width**: 300px on desktop, full width on mobile
- **Icon**: Search icon (left side)
- **Function**: Real-time search of group names and descriptions

#### Filter Dropdowns (Horizontal Layout)
1. **Location Filter**
   - Options: All Locations, Downtown, Midtown, Hamilton
   - Default: "All Locations"
   
2. **Meeting Day Filter**
   - Options: Any Day, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
   - Default: "Any Day"
   
3. **Meeting Time Filter**
   - Options: Any Time, Morning (6AM-12PM), Afternoon (12PM-6PM), Evening (6PM-11PM)
   - Default: "Any Time"
   
4. **Group Type Filter**
   - Options: Mixed, Men, Women
   - Default: "Mixed"

#### Active Filters & Results
- **Active Filter Tags**: Show selected filters as removable tags
- **Results Counter**: "X Groups" display on the right
- **Clear All**: Option to reset all filters

**Specifications:**
- Height: 60px for search bar, 50px for filter row
- Dropdowns: 150px width, 3px rounded corners, C3 border (#e5e5e5)
- Search bar: 3px rounded corners, #e5e5e5 border, Inter font
- Filter tags: 3px rounded corners, light gray background, C3 text (#404040)
- Focus states: #0073e6 border (Webflow selection blue)
- Typography: 16px Inter font, #404040 text color

### 4. Content Area (Split Layout)

```
+----------------------------------------------------------------+
|                           |                                    |
|    GROUP CARDS            |         MAP VIEW                  |
|    (60% width)            |         (40% width)               |
|                           |                                    |
|  [Card 1] [Card 2]        |    [Interactive Google Map]       |
|  [Card 3] [Card 4]        |                                    |
|  [Card 5] [Card 6]        |                                    |
|                           |                                    |
+----------------------------------------------------------------+
```

#### Left Panel: Group Cards (60% width)

**Group Card Design:**
```
+----------------------------------------+
|  [Group Image - 16:9 ratio]           |
|                                        |
|  Group Name                           |
|  Short description text...            |
|                                        |
|  📍 Location • 🕒 Day, Time           |
|  👥 Group Type                        |
|                                        |
|  [Learn More →]                       |
+----------------------------------------+
```

**Card Specifications:**
- **Dimensions**: 380px width × 320px height
- **Grid**: 2 columns on desktop, 1 column on mobile
- **Spacing**: 20px gap between cards
- **Image**: 16:9 aspect ratio, covers top 40% of card
- **Padding**: 20px internal padding
- **Border**: 1px solid #e5e5e5, 3px rounded corners
- **Background**: White (#ffffff)
- **Hover**: Gentle elevation shadow, 200ms transition
- **Font**: Inter system font stack

**Card Content:**
1. **Hero Image**: Group photo or default placeholder
2. **Group Name**: 20px, semi-bold, C3 text primary (#292929)
3. **Description**: 14px, C3 text secondary (#404040), 2-line truncation
4. **Metadata Icons**:
   - 📍 Location: 14px, #404040 (Downtown, Midtown, Hamilton)
   - 🕒 Meeting schedule: 14px, #404040 (Day, Time)
   - 👥 Group type: 14px, #404040 (Mixed, Men, Women)
5. **CTA Button**: "Learn More →" - C3 blue (#006acc), 16px Inter, links to Planning Center

#### Right Panel: Map View (40% width)

**Map Specifications:**
- **Platform**: Google Maps integration
- **Height**: Matches left panel height
- **Features**:
  - Group location pins
  - Pin clustering for dense areas
  - User location marker (if permission granted)
  - Zoom controls
  - Map/Satellite view toggle

**Pin Design:**
- **Default Pin**: C3 brand blue (#006acc)
- **Clustered Pin**: C3 blue with white text showing number of groups
- **Selected Pin**: Highlighted with #0084ff, slightly enlarged
- **Hover Pin**: #0073e6 (Webflow selection blue)
- **Popup**: Mini card with group name, Inter font, and "View Details" link in C3 blue

### 5. Responsive Breakpoints

#### Desktop (1200px+)
- Split layout: 60/40 cards/map
- 2-column card grid
- Horizontal filter layout

#### Tablet (768px - 1199px)
- Split layout: 70/30 cards/map
- 2-column card grid (smaller cards)
- Horizontal filter layout

#### Mobile (< 768px)
- Stacked layout: Cards above map
- 1-column card grid
- Collapsible filter drawer
- Map toggle button

### 6. Interactive States

#### Search & Filters
- **Loading State**: Skeleton cards while fetching results
- **Empty State**: "No groups found" with suggestion to adjust filters
- **Error State**: "Something went wrong" with retry option

#### Map Interactions
- **Pin Hover**: Show group name tooltip
- **Pin Click**: Open group info popup
- **Map Bounds Change**: Update visible cards based on map viewport
- **Location Permission**: Request user location for "near me" functionality

#### Card Interactions
- **Hover**: Subtle elevation and highlight
- **Click**: Navigate to Planning Center group page
- **Focus**: Keyboard navigation support

## Component Specifications

### Color Palette
```
Primary Blue:    #006acc (C3 brand blue)
Selection Blue:  #0073e6 (Webflow system blue)
Button Hover:    #0084ff
Text Primary:    #292929 (rgb(41, 41, 41))
Text Secondary:  #404040 (rgb(64, 64, 64))
Background:      #ffffff
Card Background: #ffffff
Border:          #e5e5e5
Success Green:   #28a745
Warning Orange:  #ffbc86 (rgb(255, 188, 134))
```

### Typography
```
Font Family: Inter, -apple-system, "system-ui", "Segoe UI", Roboto, 
             Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", 
             Helvetica, Arial, sans-serif

Headings: 
- H1: 48px, bold, #292929 (Hero title "JOIN A CONNECT GROUP")
- H2: 24px, semi-bold, #292929 (Section titles)
- H3: 20px, semi-bold, #292929 (Card titles)

Body:
- Large: 18px, regular, #404040 (Hero description)
- Medium: 16px, regular, #404040 (General text)
- Small: 14px, regular, #404040 (Card metadata)

Interactive:
- Button: 16px, medium weight, white text on #006acc background
- Link: 16px, medium weight, #006acc color
- Filter Labels: 14px, medium weight, #404040

Font Smoothing: -webkit-font-smoothing: antialiased
```

### Spacing System
```
XXS: 4px
XS:  8px
S:   12px
M:   16px
L:   20px
XL:  24px
XXL: 32px
XXXL: 48px
```

### Animation & Transitions
- **Hover Transitions**: 200ms ease-in-out
- **Filter Changes**: 300ms ease-in-out
- **Map Animations**: 400ms ease-in-out
- **Loading States**: Skeleton shimmer effect

### C3 Brand Implementation Notes
```css
/* Core C3 Brand Colors */
:root {
  --c3-primary-blue: #006acc;
  --c3-selection-blue: #0073e6;
  --c3-button-hover: #0084ff;
  --c3-text-primary: #292929;
  --c3-text-secondary: #404040;
  --c3-border: #e5e5e5;
  --c3-background: #ffffff;
}

/* Typography System */
body {
  font-family: Inter, -apple-system, "system-ui", "Segoe UI", Roboto, 
               Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", 
               Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Selection Color (consistent with Webflow) */
::selection {
  background-color: #0073e6;
  color: white;
}
```

## Accessibility Guidelines

### Keyboard Navigation
- Tab order: Search → Filters → Cards → Map
- Enter/Space to activate buttons and links
- Escape to close dropdowns and modals
- Arrow keys for map navigation

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for interactive elements
- Alt text for all images
- Live regions for dynamic content updates

### Visual Accessibility
- Minimum 4.5:1 color contrast ratio
- Focus indicators on all interactive elements
- Text scaling support up to 200%
- High contrast mode compatibility

## Performance Considerations

### Loading Strategy
- **Above-fold Priority**: Hero section and search interface load first
- **Progressive Enhancement**: Map loads after initial page render
- **Image Optimization**: WebP format with fallbacks, lazy loading
- **Infinite Scroll**: Load 20 cards initially, fetch more on scroll

### Caching Strategy
- **API Responses**: Cache group data for 5 minutes
- **Images**: CDN caching with appropriate headers
- **Map Tiles**: Browser caching for repeated map interactions

### Error Handling
- **API Failures**: Graceful degradation with cached data
- **Image Failures**: Fallback to default placeholder
- **Map Failures**: Fall back to list-only view

## Technical Implementation Notes

### State Management
```javascript
// Global State Structure
{
  groups: Group[],
  filters: {
    search: string,
    location: string,
    day: string,
    time: string,
    type: string
  },
  map: {
    center: LatLng,
    zoom: number,
    bounds: LatLngBounds
  },
  ui: {
    loading: boolean,
    view: 'split' | 'list' | 'map',
    selectedGroup: string | null
  }
}
```

### API Integration
- **Planning Center Groups API**: Fetch group data
- **Google Maps API**: Map functionality and geocoding
- **Geolocation API**: User location detection

### Component Hierarchy
```
ConnectGroupsPage
├── Header
├── HeroSection
├── SearchFilters
│   ├── SearchBar
│   ├── FilterDropdowns
│   └── ActiveFilters
├── ContentArea
│   ├── GroupList
│   │   └── GroupCard[]
│   └── MapView
│       ├── GoogleMap
│       └── GroupPin[]
└── MobileControls
```

## Success Metrics

### User Experience Metrics
- **Time to First Group Found**: < 30 seconds
- **Filter Usage Rate**: > 60% of sessions
- **Map Interaction Rate**: > 40% of sessions
- **Mobile Usability Score**: > 90/100

### Performance Metrics
- **Page Load Time**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **Lighthouse Score**: > 90/100
- **Core Web Vitals**: All green

### Business Metrics
- **Group Discovery Rate**: 20% increase
- **Planning Center Click-through**: > 25%
- **Mobile Traffic**: Support 60%+ mobile users
- **User Satisfaction**: 4.5+ star rating

## Future Enhancements

### Phase 2 Features
- **Saved Groups**: Bookmark favorites
- **Group Recommendations**: ML-based suggestions
- **Calendar Integration**: Add to personal calendar
- **Social Sharing**: Share group links

### Advanced Functionality
- **Advanced Filters**: Age range, study topics, childcare
- **Group Chat Preview**: See recent group activity
- **Leader Profiles**: Meet the group leaders
- **Photo Gallery**: Multiple group images

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Status: Design Specification*