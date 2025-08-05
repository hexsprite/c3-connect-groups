# Mobile View - Connect Groups Discovery

*Layout inspired by AirBnB's mobile map interface*

## Header (Fixed - 60px height)
- **Title**: "Connect Groups" with C3 logo
- **Filter Summary Bar**: Condensed filter chips showing active filters
  - Default: "All Groups • Any Day • Any Time"
  - Active filters: "Downtown • Sundays • 6:00 PM" (example)
  - Tap to expand filter modal

## Interactive Map View
- **Full-screen map** as primary interface (similar to AirBnB)
- **Group pins** with clustering for dense areas
- **Active location detection** with "Near Me" functionality
- **Pin interaction**: Tap pin → shows group preview card over map
- **Results counter**: "47 groups in this area" overlay (top-left)

## Bottom Sheet Panel (Sliding)
Inspired by AirBnB's property list panel with three states:

### 1. Collapsed State (120px height)
- **Handle bar** at top (4px rounded, draggable)
- **Quick preview**: "47 groups found"
- **Sample cards**: Horizontal scroll of 2-3 group cards (partial view)
- **"View List" button** to expand

### 2. Half-Expanded State (50% screen height)
- **Map remains visible** at top (50% height)
- **Scrollable group list** in bottom panel
- **Sticky header** with "47 Groups" and filter/sort controls
- **Group cards** optimized for mobile (compact vertical layout)
- **Scroll behavior**: Map stays fixed while list scrolls

### 3. Full-Expanded State (85% screen height)
- **Map minimized** to thin strip (15% height) 
- **Full group listing** with search bar at top
- **Enhanced group cards** with more details visible
- **Pull-down gesture** or tap map strip to collapse

## Filter Modal (Full-Screen Overlay)
Triggered by tapping filter summary bar:
- **Location picker** with map preview
- **Day/Time grid** selector
- **Group type** checkboxes (Young Adults, Families, etc.)
- **Additional filters**: Meeting format, childcare, etc.
- **Clear all** and **Apply** buttons
- **Results preview**: "23 groups match your filters"

## Map Pin Interaction
When user taps a map pin:
- **Bottom sheet auto-collapses** to show more map
- **Selected pin** highlighted with larger appearance
- **Info card** appears over map (not in bottom sheet)
- **Card actions**: "View Details", "Get Directions", "Join Group"

## Gestures & Navigation
- **Pinch/zoom** on map for area exploration
- **Drag handle** to adjust bottom sheet height
- **Swipe up/down** on bottom sheet to expand/collapse
- **Pull-to-refresh** on group list for updated data
- **Long press** on map pin for quick actions menu

## Responsive Behavior
- **Small phones** (<375px): Bottom sheet max 70% height
- **Large phones** (>414px): Enhanced card layouts with more content
- **Landscape mode**: Side-by-side map/list (60/40 split)

## Performance Considerations
- **Map tile caching** for offline viewing
- **Lazy loading** of group cards outside viewport
- **Smooth animations** (60fps) for sheet transitions
- **Progressive loading** of group details

## Accessibility
- **VoiceOver support** for all interactive elements
- **High contrast mode** compatibility
- **Gesture alternatives** (tap vs. drag for sheet control)
- **Screen reader announcements** for filter changes and results
