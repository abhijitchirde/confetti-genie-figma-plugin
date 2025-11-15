# Phase 3: Feature Components

## Objectives
Build all main feature components that compose the plugin UI.

---

## Components to Build

### Simple Components
1. Header
2. DensityControl
3. SizeControl
4. ActionButtons

### Complex Components
5. ColorControl (with sub-components: ColorPicker, ColorDisplay, ColorPill)
6. ShapesDropdown (with sub-components: DropdownHeader, DropdownPanel, ShapeOption)

---

## Actions Performed

### Component 1: Header

*Status: Pending*

**File Created**: `src/components/Header.tsx`

**Purpose**: Display plugin title

**Implementation Details**:
- Simple presentational component
- No props needed
- Displays "Confetti Genie" title

---

### Component 2: DensityControl

*Status: Pending*

**File Created**: `src/components/DensityControl.tsx`

**Purpose**: Density slider with dynamic label

**Props Interface**:
```typescript
interface DensityControlProps {
  value: number;  // 30-300
  onChange: (value: number) => void;
}
```

**Features**:
- Range slider (30-300)
- Dynamic label based on value:
  - 30-79: "minimal"
  - 80-129: "festive"
  - 130-179: "party"
  - 180-229: "bash"
  - 230-300: "blast"
- Label color changes with theme

---

### Component 3: SizeControl

*Status: Pending*

**File Created**: `src/components/SizeControl.tsx`

**Purpose**: Size selection with choice chips

**Props Interface**:
```typescript
interface SizeControlProps {
  value: 'small' | 'medium' | 'large';
  onChange: (value: 'small' | 'medium' | 'large') => void;
}
```

**Features**:
- Three ChoiceChip components
- Single selection (radio button behavior)
- Default: 'medium'

---

### Component 4: ActionButtons

*Status: Pending*

**File Created**: `src/components/ActionButtons.tsx`

**Purpose**: Generate buttons

**Props Interface**:
```typescript
interface ActionButtonsProps {
  onGenerateWithColors: () => void;
  onGenerateRandom: () => void;
  disabled?: boolean;
}
```

**Features**:
- Primary button: "Generate with selected colors"
- Secondary button: "Generate with random colors ✨"
- Both can be disabled

---

### Component 5: ColorPill

*Status: Pending*

**File Created**: `src/components/ColorControl/ColorPill.tsx`

**Purpose**: Display single color with remove button

**Props Interface**:
```typescript
interface ColorPillProps {
  color: string;  // hex value
  index: number;
  onRemove: (index: number) => void;
}
```

**Features**:
- Background color from prop
- Text color auto-calculated (black/white based on luminance)
- Remove button (×)
- Hover state

---

### Component 6: ColorDisplay

*Status: Pending*

**File Created**: `src/components/ColorControl/ColorDisplay.tsx`

**Purpose**: Display color pills or empty state

**Props Interface**:
```typescript
interface ColorDisplayProps {
  colors: string[];
  onRemove: (index: number) => void;
}
```

**Features**:
- Shows empty state when `colors.length === 0`
- Maps ColorPill components when colors exist
- Scrollable container
- Custom scrollbar styling

---

### Component 7: ColorPicker

*Status: Pending*

**File Created**: `src/components/ColorControl/ColorPicker.tsx`

**Purpose**: Color input with add/reset buttons

**Props Interface**:
```typescript
interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onReset: () => void;
}
```

**Features**:
- Color input (type="color")
- Add button (+)
- Reset button (↺)
- Label: "ADD COLORS"

---

### Component 8: ColorControl

*Status: Pending*

**File Created**: `src/components/ColorControl.tsx`

**Purpose**: Complete color management section

**Props Interface**:
```typescript
interface ColorControlProps {
  colors: string[];
  currentColor: string;
  onColorChange: (color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onResetColors: () => void;
}
```

**Features**:
- Combines ColorPicker and ColorDisplay
- Manages color state (may be lifted to App)
- Error animation when empty and user tries to generate

---

### Component 9: ShapeOption

*Status: Pending*

**File Created**: `src/components/ShapesDropdown/ShapeOption.tsx`

**Purpose**: Single shape checkbox row

**Props Interface**:
```typescript
interface ShapeOptionProps {
  id: string;
  label: string;
  icon: ReactNode;  // SVG icon
  checked: boolean;
  onChange: (checked: boolean) => void;
}
```

**Features**:
- Checkbox input
- SVG icon (dynamic, theme-aware)
- Label text

---

### Component 10: DropdownHeader

*Status: Pending*

**File Created**: `src/components/ShapesDropdown/DropdownHeader.tsx`

**Purpose**: Clickable dropdown header

**Props Interface**:
```typescript
interface DropdownHeaderProps {
  isOpen: boolean;
  selectedShapes: string[];  // Array of selected shape names
  onClick: () => void;
}
```

**Features**:
- Label: "SHAPES"
- Selected shape icons (dynamic SVG generation)
- Chevron icon (rotates based on isOpen)
- Clickable to toggle dropdown

---

### Component 11: DropdownPanel

*Status: Pending*

**File Created**: `src/components/ShapesDropdown/DropdownPanel.tsx`

**Purpose**: Collapsible panel wrapper

**Props Interface**:
```typescript
interface DropdownPanelProps {
  isOpen: boolean;
  children: ReactNode;
}
```

**Features**:
- CSS transition for expand/collapse
- Stops click propagation (prevents closing when clicking inside)
- Conditional rendering based on isOpen

---

### Component 12: ShapesDropdown

*Status: Pending*

**File Created**: `src/components/ShapesDropdown.tsx`

**Purpose**: Complete shapes selection dropdown

**Props Interface**:
```typescript
interface ShapesDropdownProps {
  shapes: {
    rectangles: boolean;
    ellipses: boolean;
    polygons: boolean;
    stars: boolean;
  };
  onShapeChange: (shapeName: string, checked: boolean) => void;
}
```

**Features**:
- Manages isOpen state internally
- Click outside to close functionality
- Combines DropdownHeader, DropdownPanel, and 4x ShapeOption
- Dynamic icon generation for header

---

## Testing Performed

### Per Component
- [ ] Component renders without errors
- [ ] Props are properly typed
- [ ] Event handlers work correctly
- [ ] Visual appearance matches design

### Integration Testing
- [ ] DensityControl updates label correctly
- [ ] SizeControl single selection works
- [ ] ColorControl adds/removes colors
- [ ] ColorPill text contrast works (light/dark)
- [ ] ShapesDropdown opens/closes correctly
- [ ] ShapesDropdown closes on outside click
- [ ] ActionButtons trigger correct callbacks

---

## Code Samples

*To be added during implementation*

---

## Known Issues

*To be documented during implementation*

---

## Next Steps

Proceed to Phase 4: State management and integration

---

*Phase 3 started: [Date]*
*Phase 3 completed: [Date]*
