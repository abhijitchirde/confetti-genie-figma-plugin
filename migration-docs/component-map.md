# Component Hierarchy Map

## Visual Component Tree

```
App (src/ui.tsx)
│
├─── Header
│    └─── "Confetti Genie" title text
│
├─── DensityControl
│    ├─── Label: "DENSITY"
│    ├─── DensityDisplay (dynamic label component)
│    │    └─── Text: "minimal" | "festive" | "party" | "bash" | "blast"
│    └─── RangeSlider (input type="range")
│         └─── Value: 30-300 (default: 115)
│
├─── SizeControl
│    ├─── Label: "SIZE"
│    └─── ChoiceChips (3 chips)
│         ├─── ChoiceChip: "Small"
│         ├─── ChoiceChip: "Medium" (default selected)
│         └─── ChoiceChip: "Large"
│
├─── ShapesDropdown
│    ├─── DropdownHeader (clickable)
│    │    ├─── Label: "SHAPES"
│    │    ├─── SelectedShapeIcons (dynamic SVG display)
│    │    │    └─── ShapeIcon[] (shows selected shapes)
│    │    └─── ChevronIcon (rotates on open/close)
│    │
│    └─── DropdownPanel (collapsible)
│         ├─── ShapeOption: Rectangles
│         │    ├─── Checkbox (checked by default)
│         │    ├─── SVGIcon (rectangle)
│         │    └─── Label: "Rectangles"
│         │
│         ├─── ShapeOption: Ellipses
│         │    ├─── Checkbox (checked by default)
│         │    ├─── SVGIcon (ellipse)
│         │    └─── Label: "Ellipses"
│         │
│         ├─── ShapeOption: Polygons
│         │    ├─── Checkbox (checked by default)
│         │    ├─── SVGIcon (polygon)
│         │    └─── Label: "Polygons"
│         │
│         └─── ShapeOption: Stars
│              ├─── Checkbox (checked by default)
│              ├─── SVGIcon (star)
│              └─── Label: "Stars"
│
├─── ColorControl
│    ├─── ControlRow
│    │    ├─── Label: "ADD COLORS"
│    │    ├─── ColorPicker (input type="color")
│    │    │    └─── Value: "#FF7272" (default)
│    │    └─── ButtonGroup
│    │         ├─── IconButton: Add (+)
│    │         └─── IconButton: Reset (↺)
│    │
│    └─── ColorDisplay (scrollable container)
│         ├─── EmptyState (when colors.length === 0)
│         │    └─── Text: "No colors yet. Add your first color!"
│         │
│         └─── ColorPill[] (when colors.length > 0)
│              ├─── ColorPill
│              │    ├─── ColorSwatch (background color)
│              │    ├─── ColorName (hex value text)
│              │    └─── RemoveButton (×)
│              │
│              └─── ... (repeat for each color)
│
├─── ActionButtons
│    ├─── Button (primary)
│    │    └─── "Generate with selected colors"
│    │
│    └─── Button (secondary)
│         └─── "Generate with random colors ✨"
│
└─── BottomSection (existing component - keep as-is)
     ├─── ThemeToggle (existing component - keep as-is)
     │    └─── Button: "🌙" | "☀️"
     │
     └─── CreditLink
          └─── "Made by Abhijit Chirde"
```

---

## Component Breakdown by Type

### Container Components (Stateful)

#### `App` (src/ui.tsx)
- **Purpose**: Root component, main state container
- **State**:
  - `density: number` (30-300, default: 115)
  - `size: 'small' | 'medium' | 'large'` (default: 'medium')
  - `shapes: { rectangles, ellipses, polygons, stars }` (all true by default)
  - `colors: string[]` (empty by default)
  - `currentColor: string` ('#FF7272' by default)
  - `isDropdownOpen: boolean` (false by default)
- **Responsibilities**:
  - Manage all form state
  - Handle plugin communication
  - Form validation
  - Orchestrate child components

#### `ColorControl`
- **Purpose**: Manage color selection section
- **State**:
  - May lift `colors` and `currentColor` from App or manage locally
- **Responsibilities**:
  - Add/remove colors
  - Reset colors
  - Validate color input
  - Display color pills

#### `ShapesDropdown`
- **Purpose**: Collapsible shape selection
- **State**:
  - `isOpen: boolean`
  - `shapes: object` (may be lifted from App)
- **Responsibilities**:
  - Toggle dropdown open/close
  - Handle click outside to close
  - Manage shape checkboxes
  - Generate selected icons for header

---

### Presentational Components (Stateless)

#### Base UI Components (`src/components/ui/`)

##### `Button`
- **Props**: `variant` ('primary' | 'secondary'), `children`, `onClick`, `disabled`
- **Purpose**: Reusable button component
- **Variants**: Primary (blue), Secondary (white)

##### `IconButton`
- **Props**: `icon` (ReactNode), `onClick`, `ariaLabel`, `disabled`
- **Purpose**: Small square button with icon
- **Usage**: Add (+), Reset (↺), Remove (×)

##### `ChoiceChip`
- **Props**: `label`, `selected`, `onClick`
- **Purpose**: Selectable pill-style button
- **Usage**: Size selection

##### `FormSection`
- **Props**: `children`, `className`
- **Purpose**: Bordered container wrapper
- **Usage**: Wraps density, size, shapes, colors sections

---

#### Feature Components

##### `Header`
- **Props**: None
- **Purpose**: Display plugin title
- **Content**: "Confetti Genie"

##### `DensityControl`
- **Props**: `value`, `onChange`
- **Purpose**: Display density slider and dynamic label
- **Sub-components**:
  - Range input (30-300)
  - Dynamic label (computed from value)

##### `SizeControl`
- **Props**: `value`, `onChange`
- **Purpose**: Display size choice chips
- **Options**: 'small', 'medium', 'large'

##### `ActionButtons`
- **Props**: `onGenerateWithColors`, `onGenerateRandom`, `disabled`
- **Purpose**: Display two generate buttons
- **Buttons**:
  1. "Generate with selected colors" (primary)
  2. "Generate with random colors ✨" (secondary)

---

#### Color Components

##### `ColorPicker`
- **Props**: `value`, `onChange`, `onAdd`, `onReset`
- **Purpose**: Color input with action buttons
- **Elements**:
  - Color input (type="color")
  - Add button (+)
  - Reset button (↺)

##### `ColorDisplay`
- **Props**: `colors`, `onRemove`
- **Purpose**: Display color pills or empty state
- **Conditional rendering**:
  - Empty state when `colors.length === 0`
  - Color pills when `colors.length > 0`

##### `ColorPill`
- **Props**: `color` (hex), `index`, `onRemove`
- **Purpose**: Display single color with remove button
- **Features**:
  - Background color from `color` prop
  - Text contrast (black/white based on luminance)
  - Remove button (×)

---

#### Dropdown Components

##### `DropdownHeader`
- **Props**: `isOpen`, `selectedShapes`, `onClick`
- **Purpose**: Clickable header for dropdown
- **Elements**:
  - Label: "SHAPES"
  - Selected shape icons (dynamic)
  - Chevron icon (rotates based on `isOpen`)

##### `DropdownPanel`
- **Props**: `isOpen`, `children`
- **Purpose**: Collapsible panel wrapper
- **Features**:
  - CSS transition for expand/collapse
  - Prevents click propagation

##### `ShapeOption`
- **Props**: `id`, `label`, `icon`, `checked`, `onChange`
- **Purpose**: Single shape checkbox row
- **Elements**:
  - Checkbox input
  - SVG icon
  - Label text

---

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          App (Root)                          │
│                                                              │
│  State:                                                      │
│  • density: number                                           │
│  • size: 'small' | 'medium' | 'large'                       │
│  • shapes: { rectangles, ellipses, polygons, stars }        │
│  • colors: string[]                                          │
│  • currentColor: string                                      │
│  • isDropdownOpen: boolean                                   │
└─────────────────────────────────────────────────────────────┘
        │
        ├──────────────────────────────────────────────────────┐
        │                                                       │
        ▼                                                       ▼
┌──────────────────┐                              ┌────────────────────┐
│ DensityControl   │                              │   ColorControl     │
│                  │                              │                    │
│ Props:           │                              │ Props:             │
│ • value          │                              │ • colors           │
│ • onChange       │                              │ • currentColor     │
└──────────────────┘                              │ • onColorChange    │
                                                  │ • onAddColor       │
        ▼                                         │ • onRemoveColor    │
┌──────────────────┐                              │ • onResetColors    │
│  SizeControl     │                              └────────────────────┘
│                  │                                        │
│ Props:           │                              ┌─────────┴──────────┐
│ • value          │                              ▼                    ▼
│ • onChange       │                      ┌──────────────┐    ┌──────────────┐
└──────────────────┘                      │ ColorPicker  │    │ ColorDisplay │
                                          └──────────────┘    └──────────────┘
        ▼                                                              │
┌──────────────────┐                                                  ▼
│ ShapesDropdown   │                                          ┌──────────────┐
│                  │                                          │  ColorPill   │
│ Props:           │                                          │  (mapped)    │
│ • shapes         │                                          └──────────────┘
│ • onShapeChange  │
│ • isOpen         │
│ • onToggle       │
└──────────────────┘
        │
        ├─────────────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────┐
│DropdownHeader│  │DropdownPanel │
└──────────────┘  └──────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │ ShapeOption  │
                  │  (x4 types)  │
                  └──────────────┘

        ▼
┌──────────────────┐
│ ActionButtons    │
│                  │
│ Props:           │
│ • onGenerate...  │
│ • disabled       │
└──────────────────┘
```

---

## Data Flow Examples

### Example 1: User Changes Density Slider

```
User drags slider
    ↓
DensityControl onChange fires
    ↓
App updates density state
    ↓
DensityControl re-renders with new value
    ↓
Dynamic label updates (e.g., "party")
```

### Example 2: User Adds a Color

```
User selects color in picker → currentColor updates
User clicks Add (+) button
    ↓
ColorPicker onAdd fires
    ↓
App adds currentColor to colors array
    ↓
ColorDisplay re-renders with new color
    ↓
New ColorPill appears in list
```

### Example 3: User Generates Confetti

```
User clicks "Generate with selected colors"
    ↓
ActionButtons onGenerateWithColors fires
    ↓
App validates colors array (not empty?)
    ↓
If valid:
    ↓
    App sends message to plugin code via parent.postMessage()
    {
        type: 'generate-selection',
        data: {
            sliderInput: adjustedDensity,
            inputColors: colors,
            RecValue: shapes.rectangles,
            EllValue: shapes.ellipses,
            PolyValue: shapes.polygons,
            StarValue: shapes.stars,
            sizeFactor: computedSizeFactor
        }
    }
    ↓
Plugin code receives message
    ↓
Confetti generated in Figma
```

### Example 4: Figma Theme Changes

```
User changes Figma theme (light ↔ dark)
    ↓
Plugin code detects theme change
    ↓
Plugin sends message to UI:
    {
        type: 'theme-changed',
        theme: 'dark'
    }
    ↓
useFigmaTheme hook receives message
    ↓
Updates theme state
    ↓
Updates document.documentElement.className
    ↓
CSS variables update (--figma-color-text, etc.)
    ↓
All components re-render with new theme colors
```

---

## Reusable Component Patterns

### Pattern 1: Controlled Input

**Used in**: DensityControl, SizeControl, ColorPicker

```tsx
// Parent (App)
const [value, setValue] = useState(defaultValue);

// Child component
<ControlComponent
    value={value}
    onChange={(newValue) => setValue(newValue)}
/>
```

### Pattern 2: Item List with Remove

**Used in**: ColorDisplay/ColorPill

```tsx
// Parent (App or ColorControl)
const [items, setItems] = useState<string[]>([]);

const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
};

// Child component
<ItemList items={items} onRemove={handleRemove} />

// List renders
items.map((item, index) => (
    <Item key={index} data={item} onRemove={() => onRemove(index)} />
))
```

### Pattern 3: Toggle State

**Used in**: ShapesDropdown, shape checkboxes

```tsx
// Parent (App)
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(!isOpen);

// Child component
<Dropdown isOpen={isOpen} onToggle={toggle} />
```

### Pattern 4: Multi-Select (Checkboxes)

**Used in**: Shapes selection

```tsx
// Parent (App)
const [shapes, setShapes] = useState({
    rectangles: true,
    ellipses: true,
    polygons: true,
    stars: true
});

const handleShapeChange = (shapeName: string, checked: boolean) => {
    setShapes({ ...shapes, [shapeName]: checked });
};

// Child component
<ShapeOption
    checked={shapes.rectangles}
    onChange={(checked) => handleShapeChange('rectangles', checked)}
/>
```

---

## Component Dependency Graph

```
Base Components (No dependencies)
├── Button
├── IconButton
├── ChoiceChip
└── FormSection

Feature Components (Depend on Base)
├── Header (no dependencies)
├── DensityControl (uses FormSection)
├── SizeControl (uses ChoiceChip, FormSection)
├── ColorPill (uses IconButton)
├── ColorDisplay (uses ColorPill, FormSection)
├── ColorPicker (uses IconButton, FormSection)
├── ColorControl (uses ColorPicker, ColorDisplay)
├── ShapeOption (no base dependencies)
├── DropdownHeader (uses IconButton for chevron)
├── DropdownPanel (no base dependencies)
├── ShapesDropdown (uses DropdownHeader, DropdownPanel, ShapeOption, FormSection)
└── ActionButtons (uses Button)

Container Component (Depends on all Features)
└── App (uses all feature components)

Existing Components (Keep as-is)
├── ThemeToggle
└── BottomSection
```

---

## Build Order Recommendation

Based on dependencies, build in this order:

### Round 1: Base Components
1. FormSection
2. Button
3. IconButton
4. ChoiceChip

### Round 2: Simple Features
5. Header
6. DensityControl (needs FormSection)
7. SizeControl (needs FormSection, ChoiceChip)

### Round 3: Color System
8. ColorPill (needs IconButton)
9. ColorDisplay (needs ColorPill, FormSection)
10. ColorPicker (needs IconButton, FormSection)
11. ColorControl (needs ColorPicker, ColorDisplay)

### Round 4: Dropdown System
12. ShapeOption
13. DropdownHeader
14. DropdownPanel
15. ShapesDropdown (needs all three above + FormSection)

### Round 5: Actions & Integration
16. ActionButtons (needs Button)
17. App (integrate everything)

---

*Component map created: 2025-11-13*
*Last updated: 2025-11-13*
