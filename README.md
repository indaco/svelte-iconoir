<div align="center">
  <h1>Svelte Iconoir</h1>
  <a href="https://www.npmjs.com/package/@indaco/svelte-iconoir"><img src="https://img.shields.io/npm/v/@indaco/svelte-iconoir.svg?style=flat" /></a>
</div>

# Svelte Iconoir

## Description

This package provide the entire [iconoir](https://github.com/lucaburgio/iconoir) set (941 SVG icons) to be used with Svelte & SvelteKit. It is based on the official [iconoir](https://github.com/lucaburgio/iconoir) project.

See all available icons on the **iconoir** [homepage](https://iconoir.com/)

## Install

```bash
#pnpm
pnpm install @indaco/svelte-iconoir

# npm
npm install @indaco/svelte-iconoir

# yarn
yarn add @indaco/svelte-iconoir
```

## Configuration

### SvelteKit

Add the following to the `svelte.config.js` file to bundle all the icons in a single file.

```javascript
const config = {
  // ...
  kit: {
    // ...
    vite: {
      // ...
      optimizeDeps: {
        include: ["@indaco/svelte-iconoir"],
      },
    },
  },
};
export default config;
```

## Usage Examples

Each icon is available to be used/imported following the **CamelCase** notation.

### 1. Direct

```html
<script>
 import Iconoir, { List, SunLight } from '@indaco/svelte-iconoir';
</script>

<Iconoir icon={List} />

<Iconoir icon={SunLight} class="roundedColor" />

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
 import Iconoir, { View360 } from '@indaco/svelte-iconoir';
</script>

<Iconoir
 icon={View360}
 style="background-color: green; padding: 4px; border-radius: 9999px;"
 color="#ffffff" />
```

### 3. With Tailwind CSS

```html
<script>
 import Iconoir, { Activity } from '@indaco/svelte-iconoir';
</script>

<Iconoir icon={Activity} class="p-1 rounded-full border-2 bg-green-400" size="2.5em" />
```

## Properties

The `Iconoir` component has the following properties to allow you customing the rendered svg:

| Property | Type   | Required | Description                                                          |
| :------- | :----- | :------: | :------------------------------------------------------------------- |
| icon     | Object |   Yes    | Icon data object to render, with 2 properties: name and data).       |
| alt      | String |    No    | Set the alt attribute on the rendered svg (defaults to icon's name). |
| size     | String |    No    | Override the icon's size (defaults to 1.5em).                        |
| color    | String |    No    | Override the icon's colour (defaults to currentColor).               |
| style    | String |    No    | Set the style attribute on the rendered svg.                         |
| class    | String |    No    | Set the class attribute on the rendered svg.                         |

## License

Free and open-source software under the [MIT License](LICENSE)
