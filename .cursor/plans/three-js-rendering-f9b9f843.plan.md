<!-- f9b9f843-da17-47be-8a4f-019329b445fd 9c8d3ae2-eb66-4361-81fd-f8e8a71e1620 -->
# Three.js Rendering and UX Optimization Plan

## Critical Rendering Issues

### 1. Object Allocation in useFrame Loops

`ProductsSandbox.tsx` creates new `THREE.Vector3` instances on every animation frame (lines 195, 203, 216), causing garbage collection pressure and frame drops.

```typescript
// Current (bad - creates new Vector3 every frame)
group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
```

**Fix:** Pre-allocate reusable vector objects outside the frame loop using `useRef`.

### 2. Window Width Check Causing Layout Thrashing

`window.innerWidth` is read inside `useFrame` (lines 172, 388), triggering browser layout/reflow on every frame.

**Fix:** Create a `useMobileCheck` hook with a resize event listener and memoized state.

### 3. Dormant DepthOfField Effect Consuming GPU

In `Transition.tsx` (lines 82-88), `DepthOfField` runs with `bokehScale={0}`, rendering passes with no visible effect.

**Fix:** Conditionally render the effect or disable when not active.

### 4. Canvas Rendering Every Frame Unnecessarily

`Scene.tsx` lacks `frameloop="demand"` - the canvas renders continuously even when idle.

**Fix:** Add `frameloop="demand"` and use `invalidate()` when animations trigger.

## UX Visual Improvements

### 5. Empty Suspense Fallbacks

All Suspense boundaries use `fallback={null}` (ProductsSandbox line 482, 549; Layout line 88) - users see nothing during model loading.

**Fix:** Add skeleton/spinner components using the existing `Loading.tsx` component or lightweight inline loaders.

### 6. Missing Model Preloading

GLB models load on-demand, causing hitches when products first appear.

**Fix:** Add `useGLTF.preload()` calls for the shoe model at module level.

## Minor Optimizations

### 7. Inline Function Props

Line 490 creates a new function per render: `onSelect={(id) => onSelectProduct(id)}`

**Fix:** Pass the callback directly or memoize.

### 8. High DPR on Mobile

`Scene.tsx` uses `dpr={[1.5, 2]}` which is expensive on mobile devices.

**Fix:** Use adaptive DPR based on device performance or lower min to `[1, 2]`.

## Files to Modify

- `src/sandboxes/business/ProductsSandbox.tsx` - Vector allocation, mobile check, inline functions
- `src/components/canvas/Transition.tsx` - Conditional DepthOfField
- `src/components/canvas/Scene.tsx` - frameloop and adaptive DPR
- `src/hooks/useMobileCheck.ts` (new) - Reusable mobile viewport hook

### To-dos

- [ ] Pre-allocate Vector3 objects outside useFrame loops in ProductsSandbox
- [ ] Create useMobileCheck hook with resize listener to replace window.innerWidth checks
- [ ] Conditionally render DepthOfField effect when not active
- [ ] Add frameloop="demand" to Canvas and invalidate on animations
- [ ] Add visual loading indicators to Suspense fallbacks
- [ ] Add useGLTF.preload() for shoe model at module level
- [ ] Remove inline function props in ProductItem callbacks
- [ ] Lower minimum DPR for mobile performance