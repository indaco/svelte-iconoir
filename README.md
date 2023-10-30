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

> `svelte-iconoir@5.0.0` matches `iconoir@7.0.0`

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
  import { <ComponentName>Icon } from '@indaco/svelte-iconoir/regular/<icon_name>';
</script>
```

where:

- `<ComponentName>`: named as _PascalCase_ variations of the icon name
- `<icon_name>`: the original icon name as per iconoir.com

### Example

```html
<script>
  import { MinusCircleIcon } from '@indaco/svelte-iconoir/solid/minus-circle';
  // or...
  import MinusCircleIcon from '@indaco/svelte-iconoir/components/solid/MinusCircleIcon.svelte';
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
  import { SunLightIcon } from '@indaco/svelte-iconoir/regular/sun-light';
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
  import { SunLightIcon } from '@indaco/svelte-iconoir/regular/sun-light';
</script>

<SunLightIcon
 style="background-color: green; padding: 4px; border-radius: 9999px;"
 color="#ffffff" />
```

### 3. With Tailwind CSS

```html
<script>
  import { SunLightIcon } from '@indaco/svelte-iconoir/regular/sun-light';
</script>

<SunLightIcon class="p-1 rounded-full border-2 bg-green-400" size="2xl" />
```

## Properties

Each icon component can take any property of a normal SVG Element, for example:

| Property    | Type       | Default   | Description                                           |
| :---------- | :--------- | :-------- | :---------------------------------------------------- |
| color       | `string`   | `none`    | Set the fill colour to be applied to the icon         |
| strokeWidth | `number`   | `1.5`     | Set the width of the stroke to be applied to the icon |
| style       | `string`   |           | Set the `style` attribute on the rendered svg         |
| class       | `string`   |           | Set the `class` attribute on the rendered svg         |
| ... |

In addition to these, each component can take the following properties:

| Property    | Type       | Default   | Description                                           |
| :---------- | :--------- | :-------- | :---------------------------------------------------- |
| size        | `IconSize` | `base`    | Set the attributes `width` and `height`                              |
| altText     | `string`   | icon name | Set the `aria-labelledby` attribute on the svg        |

The underlying properties can also be set and overriden manually, e.g. setting `width` explicitly takes precedence over `size`.

```javascript
/**
 * The size of the icon.
 * @typedef {(‘xs’|’sm’|’base’|’lg’|’xl’|number|string)} IconSize
 */
```

| Size | Value     |
| :--- | --------: |
| xs   | `1rem`    |
| sm   | `1.25rem` |
| base | `1.5rem`  |
| lg   | `1.75rem` |
| xl   | `2rem`    |

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
  import { SunLightIcon } from '@indaco/svelte-iconoir/regular/sun-light';
</script>

<SunLightIcon on:click={() => alert("hi!")} />
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
