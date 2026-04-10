# Design System Strategy: The Digital Clubhouse

## 1. Overview & Creative North Star
**Creative North Star: The Private Atelier**
This design system rejects the "utility-first" aesthetic of standard SaaS dashboards in favor of a "hospitality-first" editorial experience. We are not just building a booking tool; we are designing the digital extension of an exclusive, high-end golf club. 

The visual language breaks from the rigid, centered grid to embrace **The Private Atelier** concept—characterized by intentional asymmetry, significant negative space (the "luxury of room"), and a deep, tonal palette that mimics the low-light ambiance of a premium lounge. Every interaction should feel tactile, weighted, and bespoke.

---

## 2. Colors
Our palette is rooted in the "Midnight Fairway"—a combination of deep, earthy charcoals and an authoritative gold accent.

*   **Primary Roles:** Use `primary` (#ffca68) for high-impact brand moments and `primary_container` (#ecab13) for interactive elements like buttons and active states.
*   **The "No-Line" Rule:** To maintain a premium, seamless feel, **1px solid borders are prohibited for sectioning.** Do not use lines to separate the header from the body or the sidebar from the main view. Boundaries must be defined solely through background shifts (e.g., a `surface_container_low` section sitting on a `surface` background).
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of glass and leather.
    *   **Base:** `surface` (#181307) for the main application background.
    *   **Deep Layer:** `surface_container_lowest` for inactive or recessed areas.
    *   **Interactive Layer:** `surface_container` for primary card backgrounds.
    *   **Prominence Layer:** `surface_container_highest` for floating menus or modals.
*   **The "Glass & Gradient" Rule:** Main CTAs should not be flat. Apply a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to give buttons a "metallic" sheen. For secondary cards, use a 20% opacity `surface_variant` with a 16px Backdrop Blur to create a "frosted" depth that lets the background warmth bleed through.

---

## 3. Typography
We utilize **Manrope** for its technical precision and modern, geometric soul.

*   **Display & Headline:** Use `display-lg` and `display-md` for key metrics (like "Handicap" or "Power Score"). These should be set with -2% tracking to feel "locked in" and authoritative.
*   **Title & Body:** `title-lg` is reserved for card headers. `body-lg` should be used for primary content to ensure readability against the dark background.
*   **The Editorial Edge:** Balance large `headline-lg` titles with significant `body-sm` metadata. The extreme contrast between "oversized" and "undersized" type is a hallmark of luxury editorial design. Avoid "medium" sizes for everything; pick a side.

---

## 4. Elevation & Depth
Depth is not achieved through shadows alone, but through **Tonal Layering.**

*   **The Layering Principle:** Stack tiers to create lift. Place a `surface_container_high` card on a `surface_low` section. This creates a soft, natural edge that feels integrated rather than floating.
*   **Ambient Shadows:** When a floating element (like a booking confirmation toast) is required, use a shadow with a 40px blur, 0px offset, and 6% opacity. The shadow color should be a tinted version of `on_surface` (a warm beige) rather than black, mimicking the way light hits a dark, polished surface.
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use a **Ghost Border**: the `outline_variant` token at 20% opacity. This provides a structural hint without "cutting" the layout.
*   **Motion Depth:** When hovering over a card, do not move the card "up." Instead, transition the background from 20% opacity to 30% opacity and slightly increase the backdrop blur. The "lift" should be optical, not structural.

---

## 5. Components

### Buttons
*   **Primary:** `primary_container` background with `on_primary_container` text. Use `rounded-md` (0.375rem). No border.
*   **Secondary/Ghost:** `outline` text with a 10% `outline_variant` ghost border. 

### Cards & Booking Slots
*   **Rule:** Forbid the use of divider lines. Separate content using `spacing-lg` (vertical white space) or by nesting a `surface_container_lowest` box inside a `surface_container` card for "sub-data."
*   **Booking Grid:** Use an asymmetric layout where the time-slot is significantly larger than the trainer's name, creating a clear typographic hierarchy.

### Input Fields
*   **Style:** Minimalist. No background fill; only a bottom "Ghost Border" using `outline_variant` at 20%. Upon focus, the border transitions to 100% `primary` opacity. 

### Chips (Lesson Tags)
*   **Selection Chips:** Use `surface_bright` with `on_surface` text. When selected, switch to `primary` with a 0.5px `primary_fixed` border to create a "jewel-like" glow.

### Additional Luxury Components
*   **The "Progress Orb":** For swing analysis or training completion, use a circular gauge with a `tertiary` (Blue) gradient to offset the gold and charcoal, representing "technical precision."

---

## 6. Do's and Don'ts

### Do:
*   **Do** embrace negative space. If a screen feels "full," it is no longer luxury.
*   **Do** use `on_surface_variant` (#d5c4ad) for secondary text to maintain a soft, low-contrast sophisticated look. 
*   **Do** use "Optical Centering." Elements should feel balanced by eye, even if they aren't mathematically centered on a grid.

### Don't:
*   **Don't** use 100% white (#FFFFFF). It is too harsh for this dark theme. Use `on_surface` (#eee1cd) for all "white" text.
*   **Don't** use standard Material or Bootstrap-style dividers. If you feel the need for a line, try a 1px tall gradient that fades to 0% at both ends.
*   **Don't** use bright, saturated red for errors. Use the `error` (#ffb4ab) token, which is a muted, "premium" coral that alerts without breaking the aesthetic.