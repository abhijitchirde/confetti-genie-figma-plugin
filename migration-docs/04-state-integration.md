# Phase 4: State Management & Integration

## Objectives
1. Create custom hooks for plugin communication and state management
2. Build main App component with all state
3. Wire up all components together
4. Implement message passing to plugin code
5. Add form validation

---

## Actions Performed

### Hook 1: useFigmaMessage

*Status: Pending*

**File Created**: `src/hooks/useFigmaMessage.ts`

**Purpose**: Handle message passing between UI and plugin code

**Hook Interface**:
```typescript
interface UseFigmaMessageReturn {
  sendMessage: (type: string, data: any) => void;
  addMessageListener: (callback: (message: any) => void) => () => void;
}

function useFigmaMessage(): UseFigmaMessageReturn
```

**Features**:
- Wraps `parent.postMessage()` for sending to plugin
- Wraps `window.addEventListener('message')` for receiving from plugin
- Returns cleanup function for listeners
- Type-safe message structure

**Usage Example**:
```typescript
const { sendMessage } = useFigmaMessage();

const handleGenerate = () => {
  sendMessage('generate-selection', {
    sliderInput: adjustedDensity,
    inputColors: colors,
    RecValue: shapes.rectangles,
    // ... etc
  });
};
```

---

### Hook 2: useColorManager

*Status: Pending*

**File Created**: `src/hooks/useColorManager.ts`

**Purpose**: Manage color array state with add/remove/reset operations

**Hook Interface**:
```typescript
interface UseColorManagerReturn {
  colors: string[];
  currentColor: string;
  setCurrentColor: (color: string) => void;
  addColor: () => void;
  removeColor: (index: number) => void;
  resetColors: () => void;
}

function useColorManager(initialColor?: string): UseColorManagerReturn
```

**Features**:
- Manages colors array state
- Manages current color picker value
- Add operation (allows duplicates)
- Remove by index
- Reset to empty array
- Default initial color: '#FF7272'

**Usage Example**:
```typescript
const {
  colors,
  currentColor,
  setCurrentColor,
  addColor,
  removeColor,
  resetColors
} = useColorManager('#FF7272');
```

---

### App Component Integration

*Status: Pending*

**File Modified**: `src/ui.tsx`

**State Management**:
```typescript
// Density state
const [density, setDensity] = useState<number>(115);

// Size state
const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');

// Shapes state
const [shapes, setShapes] = useState({
  rectangles: true,
  ellipses: true,
  polygons: true,
  stars: true
});

// Color state (using custom hook)
const {
  colors,
  currentColor,
  setCurrentColor,
  addColor,
  removeColor,
  resetColors
} = useColorManager('#FF7272');

// Theme state (existing hook)
const { theme } = useFigmaTheme();

// Message passing (custom hook)
const { sendMessage } = useFigmaMessage();
```

**Event Handlers**:
```typescript
const handleShapeChange = (shapeName: string, checked: boolean) => {
  setShapes({ ...shapes, [shapeName]: checked });
};

const handleGenerateWithColors = () => {
  // Validate colors
  if (colors.length === 0) {
    // Show error animation
    return;
  }

  // Calculate adjusted density
  const sizeFactor = getSizeFactor(size);
  const adjustedDensity = Math.round(density * sizeFactor);

  // Send message to plugin
  sendMessage('generate-selection', {
    sliderInput: adjustedDensity,
    inputColors: colors,
    RecValue: shapes.rectangles,
    EllValue: shapes.ellipses,
    PolyValue: shapes.polygons,
    StarValue: shapes.stars,
    sizeFactor
  });
};

const handleGenerateRandom = () => {
  const sizeFactor = getSizeFactor(size);
  const adjustedDensity = Math.round(density * sizeFactor);

  sendMessage('generate-random', {
    sliderInput: adjustedDensity,
    RecValue: shapes.rectangles,
    EllValue: shapes.ellipses,
    PolyValue: shapes.polygons,
    StarValue: shapes.stars,
    sizeFactor
  });
};
```

**Component Composition**:
```tsx
<main>
  <Header />

  <DensityControl
    value={density}
    onChange={setDensity}
  />

  <SizeControl
    value={size}
    onChange={setSize}
  />

  <ShapesDropdown
    shapes={shapes}
    onShapeChange={handleShapeChange}
  />

  <ColorControl
    colors={colors}
    currentColor={currentColor}
    onColorChange={setCurrentColor}
    onAddColor={addColor}
    onRemoveColor={removeColor}
    onResetColors={resetColors}
  />

  <ActionButtons
    onGenerateWithColors={handleGenerateWithColors}
    onGenerateRandom={handleGenerateRandom}
  />

  <BottomSection />
</main>
```

---

### Form Validation

*Status: Pending*

**Empty Color Validation**:
- Check if `colors.length === 0` before generating with colors
- Show error animation (shake effect)
- Prevent message from being sent
- Error state managed in ColorControl or App

**Implementation**:
```typescript
const [colorError, setColorError] = useState(false);

const handleGenerateWithColors = () => {
  if (colors.length === 0) {
    setColorError(true);
    setTimeout(() => setColorError(false), 500);
    return;
  }
  // ... proceed with generation
};
```

**CSS Animation**:
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.color-display-error {
  animation: shake 0.3s ease-in-out;
}
```

---

### Helper Functions

*Status: Pending*

**Size Factor Calculation**:
```typescript
function getSizeFactor(size: 'small' | 'medium' | 'large'): number {
  switch (size) {
    case 'small': return 0.6;
    case 'medium': return 1;
    case 'large': return 1.3;
  }
}
```

**Adjusted Density Calculation**:
```typescript
function getAdjustedDensity(density: number, size: string): number {
  const sizeFactor = getSizeFactor(size);
  return Math.round(density * sizeFactor);
}
```

---

## Message Flow Documentation

### Messages from UI to Plugin

#### 1. generate-selection
**Sent when**: User clicks "Generate with selected colors"

**Payload**:
```typescript
{
  type: 'generate-selection',
  data: {
    sliderInput: number,      // Adjusted density
    inputColors: string[],    // Hex colors
    RecValue: boolean,        // Rectangles enabled
    EllValue: boolean,        // Ellipses enabled
    PolyValue: boolean,       // Polygons enabled
    StarValue: boolean,       // Stars enabled
    sizeFactor: number        // 0.6, 1, or 1.3
  }
}
```

#### 2. generate-random
**Sent when**: User clicks "Generate with random colors"

**Payload**:
```typescript
{
  type: 'generate-random',
  data: {
    sliderInput: number,
    RecValue: boolean,
    EllValue: boolean,
    PolyValue: boolean,
    StarValue: boolean,
    sizeFactor: number
  }
}
```

### Messages from Plugin to UI

#### 1. theme-changed
**Sent when**: Figma theme changes

**Payload**:
```typescript
{
  type: 'theme-changed',
  theme: 'light' | 'dark'
}
```

**Handler**: Received by `useFigmaTheme` hook

---

## Testing Performed

### Hook Testing
- [ ] useFigmaMessage sends messages correctly
- [ ] useFigmaMessage receives messages correctly
- [ ] useColorManager manages state correctly
- [ ] useColorManager allows duplicate colors
- [ ] useColorManager removes by index correctly

### Integration Testing
- [ ] All components render together without errors
- [ ] State flows correctly from App to children
- [ ] Event handlers trigger state updates
- [ ] Density changes reflect in UI
- [ ] Size changes affect density calculation
- [ ] Shape checkboxes update state
- [ ] Colors add/remove correctly
- [ ] Empty color validation works
- [ ] Messages sent to plugin with correct payload
- [ ] Theme changes propagate to all components

### Edge Cases
- [ ] Empty colors array handled
- [ ] No shapes selected (plugin validates)
- [ ] Maximum density value (300)
- [ ] Minimum density value (30)
- [ ] Multiple rapid clicks on generate button

---

## Code Samples

*To be added during implementation*

---

## Known Issues

*To be documented during implementation*

---

## Next Steps

Proceed to Phase 5: Utilities and polish

---

*Phase 4 started: [Date]*
*Phase 4 completed: [Date]*
