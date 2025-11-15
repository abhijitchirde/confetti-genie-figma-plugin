# Migration Overview: Vanilla JS to React

## Project: Confetti Genie Figma Plugin

### Migration Goal
Convert the existing vanilla JavaScript/HTML-based Figma plugin UI to a modern React + TypeScript architecture while maintaining all functionality and design.

---

## Scope

### What's Being Migrated
- **UI Layer**: Complete conversion from `ui.html` (with embedded CSS/JS) to React components
- **Styling**: Extract ~800 lines of embedded CSS into organized stylesheets
- **State Management**: Convert vanilla JS state to React hooks and component state
- **Theme System**: Enhance existing React theme hook to communicate with Figma

### What's Staying the Same
- **Plugin Logic** (`src/code.ts`): Already migrated, no changes needed
- **Existing Components**: `ThemeToggle.tsx` and `BottomSection.tsx` remain as-is
- **Build Configuration**: webpack, TypeScript, and package.json already set up
- **Design System**: All Figma design tokens and styling preserved

---

## Original Architecture

### File Structure (Before)
```
├── code.ts                 # Plugin logic (326 lines)
├── ui.html                 # Complete UI (1300+ lines total)
│   ├── HTML structure      # (~70 lines)
│   ├── Embedded CSS        # (~800 lines)
│   └── Embedded JavaScript # (~427 lines)
├── manifest.json
├── package.json
└── tsconfig.json
```

### Original UI Structure
The `ui.html` file contained everything in one monolithic file:

1. **HTML Elements**:
   - Density slider with dynamic label
   - Size choice chips (Small/Medium/Large)
   - Shapes dropdown with checkboxes
   - Color picker with add/reset buttons
   - Color pills display area
   - Two action buttons (generate with colors/random)
   - Theme toggle and footer

2. **Embedded CSS**:
   - Figma design system CSS variables
   - Component-specific styles
   - Animations and transitions
   - Theme-aware styling (light/dark)

3. **Embedded JavaScript**:
   - Event handlers for all interactions
   - State management in variables
   - Message passing to plugin code
   - Theme detection and toggling
   - Form validation logic

---

## Target Architecture

### File Structure (After)
```
src/
├── code.ts                          # Plugin logic (unchanged)
├── ui.tsx                           # Main React entry point
├── ui.html                          # Minimal HTML with React mount point
├── ui.css                           # Extracted and organized styles
├── components/
│   ├── ui/                          # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   ├── ChoiceChip.tsx
│   │   └── FormSection.tsx
│   ├── DensityControl.tsx           # Density slider section
│   ├── SizeControl.tsx              # Size selection section
│   ├── ColorControl.tsx             # Color management section
│   │   ├── ColorPicker.tsx
│   │   ├── ColorDisplay.tsx
│   │   └── ColorPill.tsx
│   ├── ShapesDropdown.tsx           # Shapes selection dropdown
│   │   ├── DropdownHeader.tsx
│   │   ├── DropdownPanel.tsx
│   │   └── ShapeOption.tsx
│   ├── ActionButtons.tsx            # Generate buttons
│   ├── Header.tsx                   # Plugin title
│   ├── ThemeToggle.tsx              # (existing, keep as-is)
│   └── BottomSection.tsx            # (existing, keep as-is)
├── hooks/
│   ├── useFigmaTheme.ts             # (existing, needs enhancement)
│   ├── useFigmaMessage.ts           # NEW: Plugin communication
│   └── useColorManager.ts           # NEW: Color state management
└── utils/
    ├── colorUtils.ts                # Color conversion and contrast
    ├── densityUtils.ts              # Density label calculations
    └── iconUtils.ts                 # SVG icon generation
```

---

## Key Features to Preserve

### Functional Requirements
1. **Duplicate Colors Allowed**: Users can add the same color multiple times for "color dominance"
2. **Empty Color Validation**: Show error animation if user tries to generate with no colors
3. **Theme Auto-Detection**: Sync with Figma's current theme automatically
4. **Dynamic Density Labels**: Label changes based on slider value (minimal → festive → party → bash → blast)
5. **Size Affects Density**: Size selection affects both confetti size AND density adjustment
6. **Multi-Node Support**: Generate confetti on multiple selected frames simultaneously
7. **Shape Selection**: Must have at least one shape type selected

### Design Requirements
1. **Figma Design Tokens**: Use CSS variables for colors, spacing, typography
2. **Smooth Transitions**: 0.2s ease transitions throughout
3. **Button States**: Proper hover, active, and pressed states
4. **Custom Scrollbars**: Styled scrollbars for color display area
5. **Color Pill Contrast**: Automatic black/white text based on background color
6. **Dropdown Animation**: Smooth expand/collapse with chevron rotation
7. **Empty States**: Proper messaging when no colors added

---

## Migration Strategy

### Approach: Incremental Component-by-Component
We'll build from the bottom up, starting with reusable primitives and composing them into larger features.

### Phase Breakdown

#### Phase 0: Documentation Setup ✓
Create documentation structure and overview

#### Phase 1: Foundation
- Extract CSS from ui.html
- Organize styles by component
- Fix theme integration to communicate with Figma

#### Phase 2: Base UI Components
- Button (primary/secondary variants)
- IconButton (add/reset/remove buttons)
- ChoiceChip (size selection)
- FormSection (container wrapper)

#### Phase 3: Feature Components
- DensityControl (slider + dynamic label)
- SizeControl (choice chips)
- ColorControl (complete color management)
- ShapesDropdown (collapsible shape selection)
- ActionButtons (generate buttons)
- Header (title)

#### Phase 4: State Management & Integration
- Create custom hooks
- Build main App component
- Wire up all state
- Implement plugin message passing
- Add form validation

#### Phase 5: Polish & Testing
- Create utility functions
- Test all interactions
- Verify theme switching
- Test plugin communication
- Handle edge cases

---

## Success Criteria

### Functionality Checklist
- [ ] All UI controls work identically to vanilla version
- [ ] Theme switching syncs with Figma
- [ ] Confetti generation works for both modes (selected/random colors)
- [ ] Form validation prevents empty color submission
- [ ] Multiple frames can be targeted simultaneously
- [ ] Size affects both confetti size and density
- [ ] Shapes dropdown opens/closes correctly
- [ ] Colors can be added, removed, and duplicated

### Quality Checklist
- [ ] TypeScript types for all components and functions
- [ ] Proper component composition and reusability
- [ ] Clean separation of concerns
- [ ] No console errors or warnings
- [ ] Matches original design pixel-perfect
- [ ] Smooth animations and transitions
- [ ] Accessible (keyboard navigation, focus states)

### Documentation Checklist
- [ ] All phases documented with before/after code samples
- [ ] Component hierarchy diagram created
- [ ] Migration decisions and rationale explained
- [ ] Code examples provided for key patterns
- [ ] Known issues and future improvements noted

---

## Timeline Estimate

| Phase | Components | Estimated Effort |
|-------|-----------|------------------|
| Phase 0 | Documentation setup | ✓ Complete |
| Phase 1 | CSS extraction + theme fix | 1-2 hours |
| Phase 2 | 4 base components | 2-3 hours |
| Phase 3 | 10+ feature components | 4-6 hours |
| Phase 4 | State management + integration | 2-3 hours |
| Phase 5 | Utils + testing + polish | 2-3 hours |
| **Total** | | **11-17 hours** |

---

## Next Steps

1. Begin Phase 1: Extract CSS from ui.html
2. Document CSS organization decisions
3. Fix theme integration in useFigmaTheme hook
4. Test theme switching with Figma

---

## Notes

- **Manual Approval**: All file changes require manual approval
- **Component-First**: Build and test components in isolation before integration
- **Test Frequently**: Verify each component works before moving to next
- **Document Everything**: Keep migration docs updated after each phase

---

*Migration started: 2025-11-13*
*Last updated: 2025-11-13*
