<div align="center">
    <h1>Svelte Iconoir</h1>
    <a href="https://github.com/indaco/svelte-iconoir/actions/workflows/release.yml" target="_blank">
        <img src="https://github.com/indaco/svelte-iconoir/actions/workflows/release.yml/badge.svg" alt="CI" />
    </a>
    &nbsp;
    <a href="https://github.com/indaco/svelte-iconoir/blob/main/LICENSE" target="_blank">
        <img src="https://img.shields.io/badge/license-mit-blue?style=flat-square&logo=none" alt="license" />
    </a>
    &nbsp;
    <a href="https://www.npmjs.com/package/@indaco/svelte-iconoir" target="_blank"><img src="https://img.shields.io/npm/v/@indaco/svelte-iconoir.svg?style=flat" alt="NPM Package" /></a>
</div>

# Svelte Iconoir

The entire [iconoir](https://github.com/lucaburgio/iconoir) set (1300+ SVG icons) as Svelte components.

See all available icons on the **iconoir** [homepage](https://iconoir.com/)

> `svelte-iconoir@4.6.0` matches `iconoir@6.11.0`

## Install

```bash
# npm
npm install @indaco/svelte-iconoir

# pnpm
pnpm add @indaco/svelte-iconoir

# yarn
yarn add @indaco/svelte-iconoir
```

## Usage

```html
<script>
  import { <ComponentName>Icon } from '@indaco/svelte-iconoir/<icon_name>';
</script>
```

where:

- **<ComponentName>**: icon name as _CamelCase_ notation
- **<icon_name>**: the original icon name as per iconoir.com

### Example

```html
<script>
  import { SunLightIcon } from '@indaco/svelte-iconoir/sun-light';
  // or...
  import SunLightIcon from '@indaco/svelte-iconoir/components/SunLightIcon.svelte';
</script>
```

> **Note:** you can still import and use the icon as `import { <component_name>Icon } from '@indaco/svelte-iconoir';` but this will have performace issue when the server run due to the import of the entire icons set.

### Exceptions

The naming convention above has few exceptions breaking it:

1. icons whose name starts with a number:
    - to be a valid Svelte component it must start with capital letter, refer to [Template Syntax Tags];
2. icons for companies (github, youtube etc.):
    - to reflect the real company names (GitHub, YouTube, etc.).

| Icon Name                | Component Name           |
| :----------------------- | :----------------------- |
| 1st-medal                | Medal1stIcon             |
| 2x2-cell                 | Cell2x2Icon              |
| 3d-add-hole              | AddHole3dIcon            |
| 3d-arc-center-pt         | ArcCenterPt3dIcon        |
| 3d-arc                   | Arc3dIcon                |
| 3d-bridge                | Bridge3dIcon             |
| 3d-center-box            | CenterBox3dIcon          |
| 3d-draft-face            | DraftFace3dIcon          |
| 3d-ellipse-three-pts     | EllipseThreePts3dIcon    |
| 3d-ellipse               | Ellipse3dIcon            |
| 3d-pt-box                | PtBox3dIcon              |
| 3d-rect-corner-to-corner | RectCornerToCorner3dIcon |
| 3d-rect-from-center      | RectFromCenter3dIcon     |
| 3d-rect-three-pts        | RectThreePts3dIcon       |
| 3d-select-edge           | SelectEdge3dIcon         |
| 3d-select-face           | SelectFace3dIcon         |
| 3d-select-point          | SelectPoint3dIcon        |
| 3d-select-solid          | SelectSolid3dIcon        |
| 3d-three-pts-box         | ThreePtsBoxe3dIcon       |
| 4k-display               | Display4kIcon            |
| 360-view                 | View360Icon              |
| github                   | GitHubIcon               |
| github-circle            | GitHubCircleIcon         |
| gitlab-full              | GitLabFullIcon           |
| linkedin                 | LinkedInIcon             |
| tiktok                   | TikTokIcon               |
| youtube                  | YouTubeIcon              |

## Styling Icons

You can apply your own styles to the icon components in different ways:

### 1. Direct

```html
<script>
  import { SunLightIcon } from '@indaco/svelte-iconoir/sun-light';
</script>

<SunLightIcon class="roundedColor" />

<style>
 .roundedColor {
  padding: 4px;
  background-color: yellow;
  border-style: solid;
  border-color: #d1d5db;
 }
</style>
```

### 2. Inline styles

```html
<script>
 import { View360Icon } from '@indaco/svelte-iconoir/360-view';
</script>

<View360Icon
 style="background-color: green; padding: 4px; border-radius: 9999px;"
 color="#ffffff" />
```

### 3. With Tailwind CSS

```html
<script>
 import { ActivityIcon } from '@indaco/svelte-iconoir/activity';
</script>

<ActivityIcon class="p-1 rounded-full border-2 bg-green-400" size="2xl" />
```

## Properties

Each icon component has the following properties to allow you customing the rendered svg:

| Property    | Type       | Default   | Description                                           |
| :---------- | :--------- | :-------- | :---------------------------------------------------- |
| size        | `IconSize` | `base`    | Set the size of the icon                              |
| color       | `string`   | `none`    | Set the fill colour to be applied to the icon         |
| strokeWidth | `number`   | `1.5`     | Set the width of the stroke to be applied to the icon |
| alt         | `string`   | icon name | Set the `aria-label` attribute on the rendered svg    |
| style       | `string`   |           | Set the `style` attribute on the rendered svg         |
| class       | `string`   |           | Set the `class` attribute on the rendered svg         |

```javascript
/**
 * The size of the icon.
 * @typedef {('sm'|'base'|'lg'|'xl'|'2xl'|number)} IconSize
 */
```

| Size | Value      |
| :--- | ---------: |
| sm   | `0.875rem` |
| base | `1rem`     |
| lg   | `1.125rem` |
| xl   | `1.25rem`  |
| 2xl  | `1.5rem`   |

## Event Forwarding

You can also override the `click, dblclick` events on an element.

```html
<script>
 import { ActivityIcon } from '@indaco/svelte-iconoir/activity';
</script>

<ActivityIcon class="p-1 rounded-full border-6 bg-blue-300" on:click={() => alert("hi!")} size="2.5em" />
```

## Dev Flow

```bash
git clone https://github.com/indaco/svelte-iconoir.git

cd svelte-iconoir

# Install all dependencies
pnpm install # (or npm, yarn)

# Generate Svelte components for each icon
pnpm generate:icons

# Package
pnpm build

## Run postbuild script
pnpm postbuild
```

## License

Free and open-source software under the [MIT License](LICENSE)

<!-- -->
[Template Syntax Tags]: https://svelte.dev/docs#template-syntax-tags
