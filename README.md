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

The entire [iconoir](https://github.com/lucaburgio/iconoir) set (1600+ SVG icons) as Svelte components.

See all available icons on the **iconoir** [homepage](https://iconoir.com/).

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
  import { <ComponentName>Icon } from '@indaco/svelte-iconoir/<icon_variant>/<icon_name>';
</script>
```

where:

- `<ComponentName>`: named as _PascalCase_ variations of the icon name
- `<icon_variant>`:
  - `regular` variant is the **default one and does not need to be specified**
  - `solid` (check on [iconoir.com](https://iconoir.com) if available)
- `<icon_name>`: the original icon name as per iconoir.com

### Example

```html
<script>
  import { SunLightIcon } from '@indaco/svelte-iconoir/sun-light';

  // variant `solid`
  import { MinusCircleIcon } from '@indaco/svelte-iconoir/solid/minus-circle';
</script>
```

### Exceptions

The naming convention above has few exceptions breaking it:

1. icons for companies (github, youtube etc.):
   - to reflect the real company names (GitHub, YouTube, etc.).

| Icon Name     | Component Name   |
| :------------ | :--------------- |
| github        | GitHubIcon       |
| github-circle | GitHubCircleIcon |
| gitlab-full   | GitLabFullIcon   |
| linkedin      | LinkedInIcon     |
| tiktok        | TikTokIcon       |
| youtube       | YouTubeIcon      |

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
  import { SunLightIcon } from '@indaco/svelte-iconoir/sun-light';
</script>

<SunLightIcon
  style="background-color: green; padding: 4px; border-radius: 9999px;"
  color="#ffffff"
/>
```

### 3. With Tailwind CSS

```html
<script>
  import { SunLightIcon } from '@indaco/svelte-iconoir/sun-light';
</script>

<SunLightIcon class="p-1 rounded-full border-2 bg-green-400" size="xl" />
```

## Properties

Each icon component can take any attribute of a normal SVG Element, for example:

```html
<ZoomOutIcon fill="red" stroke-width="3" />
```

In addition to these, each component can take the following properties:

| Property | Type       | Default   | Description                                    |
| :------- | :--------- | :-------- | :--------------------------------------------- |
| size     | `IconSize` | `base`    | Set the attributes `width` and `height`        |
| altText  | `string`   | icon name | Set the `aria-labelledby` attribute on the svg |

The underlying properties can also be set and overridden manually, e.g. setting `width` explicitly takes precedence over `size`.

```javascript
/**
 * The size of the icon.
 * @typedef {(‘xs’|’sm’|’base’|’lg’|’xl’|number|string)} IconSize
 */
```

| Size |    Value |
| :--- | -------: |
| xs   |    `1em` |
| sm   | `1.25em` |
| base |  `1.5em` |
| lg   | `1.75em` |
| xl   |    `2em` |

## Event Forwarding

The following events are _forwarded_.

| Name            |
| :-------------- |
| `on:click`      |
| `on:dblclick`   |
| `on:keyup`      |
| `on:keydown`    |
| `on:mouseenter` |
| `on:mouseleave` |

For example, you can set the `on:click` event on all icons.

```html
<script>
  import { SunLightIcon } from '@indaco/svelte-iconoir/sun-light';
</script>

<SunLightIcon on:click="{()" =""> alert("hi!")} /></SunLightIcon>
```

## Dev Flow

```bash
git clone https://github.com/indaco/svelte-iconoir.git

cd svelte-iconoir

# Install all dependencies
pnpm install # (or npm, yarn)

# Update Iconoir submodule
git submodule update --remote

# Generate Svelte components for each icon
pnpm generate:icons

# Package
pnpm build

## Run postbuild script
pnpm postbuild
```

## License

Free and open-source software under the [MIT License](LICENSE)
