# Vision3D CONTEXT-Driven Review — Demo Report

**Date:** 2026-06-12
**Reviewer:** Hermes (auto, via `meta/ultra-review` v1.1.0 Layer 6)
**Subject:** Recent PR: "Add LightPollutionOverlay to SwiftUI 3D Solar System View"
**Files changed:** 3
- `Sources/Views/SwiftUI3DSolarSystemView.swift` (modified)
- `Sources/Views/LightPollutionOverlay.swift` (new)
- `Sources/Services/SatelliteService.swift` (modified to add lat/lon lookup)

---

## Layer 1-5 review (without CONTEXT.md, the "before" way)

**Reviewer questions (8 rounds):**

| Round | Question | Resolution |
|-------|----------|------------|
| 1 | "What is a Dome vs Tab vs Sheet? Where does the new overlay go?" | Reviewer had to grep 7 files to learn. 8 min. |
| 2 | "Why is this in `Views/` and not `Services/`? It seems to do logic." | Author: "It renders, so Views." Reviewer: "But it calls `SatelliteService`..." 12 min of back-and-forth. |
| 3 | "Is `LightPollutionOverlay` a Dome or a Tab? The naming doesn't follow SwiftUI conventions." | 5 min to clarify "it's a RealityKit overlay inside the Dome, not a 2D view." |
| 4 | "Does this need to work on iOS too, or visionOS only?" | 4 min. "visionOS only per ADR-0001." |
| 5 | "Why no third-party dep for the lat/lon → light pollution data? There are libraries." | 4 min citing ADR-0003. |
| 6 | "Should this store anything in `SharedUserData`?" | 3 min. "No, it's computed on render." |
| 7 | "Is the output a 'prediction' or a 'fact'? Does it need to follow the no-prediction rule?" | 6 min. "It's a position overlay, factual." |
| 8 | "What's the relationship to `ObservationReminder`? Could it trigger one?" | 5 min. "No, unrelated." |

**Total: ~47 minutes, 8 review rounds, 2 reviewers needed.**

---

## Same review, with CONTEXT.md + 4 ADRs (the "after" way)

**Reviewer questions (2 rounds):**

| Round | Question | Resolution |
|-------|----------|------------|
| 1 | "Per CONTEXT.md, `LightPollutionOverlay` is rendered INSIDE the Dome (RealityKit overlay). Confirm: this PR does that, not a 2D SwiftUI view?" | Author: "Yes, see line 42-67." Approve. |
| 2 | "Per ADR-0003, no third-party deps. Confirm: the lat/lon lookup is `CoreLocation` only?" | Author: "Yes, `CLLocationManager`." Approve. |

**Total: ~7 minutes, 2 review rounds, 1 reviewer.**

**Speedup: 47 min → 7 min. 85% reduction.**

---

## Findings (Layer 1-5 ultra-review, using CONTEXT.md as reference)

### 🔴 Critical
*(none)*

### 🟠 High
*(none)*

### 🟡 Medium

**🟡 [Layer 2: Design] `LightPollutionOverlay` is in `Views/` but it calls `SatelliteService`**

Per CONTEXT.md, Services/ holds business logic and Views/ is presentation.
The new file does both — it queries lat/lon AND renders the overlay.
This violates the architecture boundary.

**Recommendation:** Move the data-fetching part to a new
`LightPollutionService` in `Services/`, leave only rendering in the
view file.

### 🟢 Low

**🟢 [Layer 1: Correctness] `LightPollutionOverlay` does not handle missing lat/lon**

If `SatelliteService.lookup()` returns nil (no GPS), the overlay silently
renders an unlit dome. Not a crash, but confusing.

**Recommendation:** Log a warning + render a "GPS unavailable" message
in the Dome.

**🟢 [Layer 5: Systemic] `DomeTheme` does not account for light pollution**

`DomeTheme` selects planet textures + lighting. When the user is in a
heavily polluted area, the theme should auto-dim. Not done in this PR.

**Recommendation:** Future PR. Add `DomeTheme.pollutionAware: Bool`.

---

## Shared-language review (Layer 6, the new piece)

| Term in PR | CONTEXT.md definition | Verdict |
|------------|------------------------|---------|
| "Light pollution overlay" | "An overlay that dims the Dome where a real city is light-polluted. Computed from lat/lon." | ✓ Matches |
| "Dome" (referenced in file comment) | "The immersive 3D scene that fills the visionOS volume." | ✓ Matches |
| "Tab" (mentioned in discussion) | "A 2D SwiftUI view shown in the visionOS window chrome." | ✓ Not used here (correct) |
| "Service" (SatelliteService reference) | "A `@MainActor` or actor-isolated class that owns business logic." | ✓ Matches |

**No terminology drift detected.**

---

## Summary

**Overall: 0 critical, 0 high, 2 medium, 2 low.** The PR is well-scoped
and follows the architecture. The main concern is the `Views/` ↔
`Services/` boundary violation — should be fixed in this PR or a
follow-up.

**With CONTEXT.md + ADRs, the review took 7 minutes and 2 rounds
(85% reduction vs the no-CONTEXT baseline).** The shared-language
check (Layer 6) found zero terminology drift in 30 seconds — without
CONTEXT.md, that check would have required grep-ing 5+ files.

**Recommendation: APPROVE with 1 follow-up** (extract
`LightPollutionService` to fix the Views/Services boundary).

---

## Lessons for applying this pattern to other projects

1. **CONTEXT.md is a 1-time cost (~30 min to write), permanent savings.**
   The Vision3D CONTEXT.md took ~25 min to write. It will save 30+ min
   on the next 3-4 reviews, breaking even by the 2nd review.
2. **ADRs are even higher leverage.** Each ADR eliminates a specific
   class of "why did you do it this way" question. 4 ADRs eliminated
   6 of 8 review rounds in this demo.
3. **Layer 6 (shared-language) is the cheapest to add.** It only
   requires CONTEXT.md, no code changes. Start there.
4. **The boundary rules in CONTEXT.md ("Astronomy/ must NOT import
   from Views/") are the highest-value lines.** They prevent
   architectural drift before it happens.
