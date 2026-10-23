# DESIGN.md — WOD Explorer 2.0

## 1. Visual Direction

**Approved direction:** Mobile-First Performance Dashboard ("Pizarra de Rendimiento Mobile-First").

`DESIGN.md` defines shared visual decisions, tokens, components, and responsive behavior. It does not define business rules, permissions, or API contracts.

- Identity: precise, restrained, athletic, personal performance tool.
- Visual language: dark blue surfaces, indigo accents, numerical hierarchy.
- Theme: dark only.
- UI language: Spanish.
- Avoid social, competitive, gamified, or ranking-oriented aesthetics.

Shared visual changes must be documented here before widespread implementation.

Use `21st` only as optional design support when available. Its proposals never override the active spec, this document, accessibility, or existing design decisions.

## 2. Color Tokens

| Role                | Value       |
| ------------------- | ----------- |
| Base background     | `#030712`   |
| Elevated background | `#111827`   |
| Surface             | `#1E2634`   |
| Elevated surface    | `#1F2937`   |
| Interactive overlay | `#FFFFFF08` |
| Border              | `#1F2937`   |
| Primary text        | `#FFFFFFCC` |
| Secondary text      | `#9CA3AF`   |
| Muted text          | `#6B7280`   |
| Primary             | `#3758F9`   |
| Primary hover       | `#2237EE`   |
| Information         | `#0EA5E9`   |
| Success             | `#22C55E`   |
| Warning             | `#EAB308`   |
| Error               | `#EF4444`   |

- Maintain contrast across dark surfaces.
- Never communicate meaning through color alone.
- Primary color does not inherently represent achievement or personal records.
- Reuse existing CSS tokens instead of introducing equivalent local values.

## 3. Typography

**Font:** `"DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Load DM Sans through its official Google Fonts stylesheet, preserving system fallbacks.

**Weights:** 400 body, 500 controls, 600 headings, 700 metrics.

| Token       | Size / Line Height |
| ----------- | ------------------ |
| `text-xs`   | `12px / 16px`      |
| `text-sm`   | `14px / 20px`      |
| `text-base` | `16px / 24px`      |
| `text-lg`   | `20px / 28px`      |
| `text-xl`   | `24px / 32px`      |
| `metric-lg` | `32px / 36px`      |
| `metric-xl` | `40px / 44px`      |

- Use tabular figures for numerical metrics, times, dates, rounds, and repetitions when supported.
- Reserve uppercase text for short labels with subtle tracking.
- Never use text smaller than `12px`.

## 4. Spacing and Surfaces

**Base spacing unit:** `4px`

Scale: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64` px.

- Minimum control padding: `12px`.
- Card padding: `16px` mobile, `20px` desktop.
- Section spacing: `24px` mobile, `32px` desktop.

### Radius and Borders

| Token            | Value               |
| ---------------- | ------------------- |
| `radius-sm`      | `6px`               |
| `radius-md`      | `10px`              |
| `radius-lg`      | `14px`              |
| `border-default` | `1px solid #394345` |

Use small radii for badges and chips, medium for controls and cards, and large for panels and modals.

Avoid thick borders except for focus or error states.

### Shadows

| Token            | Value                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| `shadow-surface` | `0 1px 2px rgb(16 24 40 / 5%)`                                          |
| `shadow-raised`  | `0 4px 8px -2px rgb(16 24 40 / 10%), 0 2px 4px -2px rgb(16 24 40 / 6%)` |
| `shadow-modal`   | `0 32px 64px rgb(16 24 40 / 14%)`                                       |

Shadows communicate elevation, not status. Avoid decorative glow effects.

## 5. Layout and Breakpoints

- Application canvas: `#111827`.
- Sidebar and bottom navigation: `#030712`.
- Main container max-width: `1280px`.
- Gutters: `16px` mobile, `24px` tablet, `32px` desktop.

| Breakpoint   | Width        | Grid       | Gap    |
| ------------ | ------------ | ---------- | ------ |
| Mobile       | `0–599px`    | 4 columns  | `16px` |
| Tablet       | `600–899px`  | 8 columns  | `20px` |
| Desktop      | `900–1199px` | 12 columns | `24px` |
| Wide desktop | `1200px+`    | 12 columns | `24px` |

- Mobile uses a single-column content flow.
- Desktop uses persistent navigation and optional contextual content.
- Secondary context follows primary content on mobile.
- Metric cards span available width on mobile and 2–4 grid columns on desktop.
- Forms remain single-column below `600px`.
- Breakpoints must not hide essential information.

## 6. Navigation and Responsive Behavior

**Mobile-first:** prioritize vertical reading, touch controls, and one primary task per screen.

### Mobile

- Fixed bottom navigation with at most five destinations.
- Always display navigation labels.
- Active destination uses primary text, translucent background, and a bottom indicator.
- Use cards or stacked rows for lists.
- Move filters into accessible expandable panels when necessary.

### Desktop

- Persistent sidebar with icons and labels.
- Tables may replace cards when comparison benefits.
- Additional contextual information must not duplicate functionality.

### General

- Keep numerical values visible without truncation.
- Preserve keyboard access to secondary actions.
- Place resource actions near their corresponding content.
- Display private-resource status through consistent labels.
- Adapt layouts without duplicating controls.

## 7. Buttons and Forms

### Buttons

- Standard height: `44px`.
- Minimum touch target: `44px × 44px`.
- Primary: `#3758F9`, hover `#2237EE`, white text, weight 600.
- Secondary: `#111827` background, `#1F2937` border, `#E5E7EB` text.
- Tertiary: transparent, muted text; hover `#111827` and `#D1D5DB`.
- Destructive: `#DC2626`, hover `#B91C1C`, white text.

Required states: default, hover, focus-visible, disabled, loading.

Focus ring: `3px #91AEFF`, `2px` offset. Primary controls additionally use `rgb(55 88 249 / 20%)` halo.

### Inputs

- Minimum height: `44px`.
- Background: `#FFFFFF0D`.
- Border: `border-default`.
- Focus: `#91AEFF` border and visible primary halo.
- Persistent labels; placeholders provide supplementary guidance.
- Help text: `text-xs`.
- Errors require an icon, color, and explanatory text.
- Group fields by purpose without inventing new domain fields.

Display `FOR_TIME` results as time and `AMRAP` results as completed rounds plus additional repetitions.

## 8. Components

### Cards

- Standard: surface background, default border, medium radius, surface shadow.
- Interactive: subtle elevation, `#374151` border, `#FFFFFF08` hover overlay.
- Metric: prominent value with explanatory text below.
- WOD: name, modality, origin, and available composition summary.
- Exercise composition: numbered sequence preserving order.

Avoid mandatory stock sports imagery or decorative charts.

### Liquid Glass

Use only for interior panels displaying an existing ambient background.

- Dark-blue translucent tint.
- Moderate `backdrop-filter`.
- Subtle primary border, upper reflection, soft shadow.
- No independent glass filters on internal rows.
- Inputs use more opaque surfaces.
- Provide opaque fallback and reduced-transparency alternatives.

### Lists and Tables

- Mobile: stacked rows or cards, title before metadata.
- Desktop: tables when comparison is clearer.
- Table rows: minimum `48px`.
- Basic information must remain accessible without horizontal scrolling.
- Right-align numerical values and use tabular figures.
- Prefer borders over row shadows.
- Prioritize name, modality-specific result, date, and origin when available.

### Badges

- `text-xs`, `radius-sm`, horizontal padding `8px`.
- Neutral: `#4B5563` background, `#E5E7EB` text.
- May indicate modality, origin, category, measurement type, completion, or archive status.
- Never serve as the only explanation of important information.

## 9. Interface States

- **Loading:** skeletons matching approximate final dimensions.
- **Empty:** simple icon, title, explanation, and only existing valid actions.
- **Error:** error-bordered panel, clear description, retry when supported.
- **Success:** brief confirmation using text and success color.

Never invent unavailable results, records, actions, or content for empty states.

## 10. Metrics and Charts

- Use prominent, tabular numerical figures with explicit labels.
- Preserve `FOR_TIME` and `AMRAP` result structures.
- Personal-record cards prioritize value, WOD identity, and context.
- Charts are optional and must remain simple.
- Never imply unsupported comparisons or conclusions.
- Provide accessible textual equivalents.

## 11. Accessibility

- Maintain sufficient contrast and visible focus.
- Support keyboard navigation and logical focus order.
- Use semantic HTML and properly associated labels.
- Prefer native controls; use ARIA only when necessary.
- Keep touch targets at least `44px × 44px`.
- Never rely exclusively on color.
- Keep motion subtle and respect reduced-motion preferences.
- Provide meaningful labels and summaries for charts.

## 12. Cross-Screen Consistency

- Reuse colors, spacing, typography, radii, borders, and shadows.
- Maintain consistent domain terminology in Spanish.
- Represent origin, modality, completion, and archive status consistently.
- Use identical result formats across details, lists, history, and records.
- Maintain primary, secondary, then destructive action hierarchy.
- Reuse existing components before introducing local variants.
- Document new shared visual decisions before global adoption.

## 13. Visual Guardrails

Require authorization before:

- Replacing the approved visual direction.
- Introducing a global light theme.
- Adopting an external design system.
- Fundamentally changing product identity.
- Applying external design proposals that contradict approved decisions.

Never:

- Treat MCP proposals as mandatory requirements.
- Introduce business features or permissions through visual decisions.
- Modify domain rules to accommodate UI designs.
- Ignore accessibility or responsive requirements.
- Expand an active spec based on visual recommendations.
- Introduce alternative styling systems without approval.
