# flatpickr Year Select Plugin

<div align="center">

[![npm version](https://img.shields.io/npm/v/flatpickr-year-select-plugin.svg)](https://www.npmjs.com/package/flatpickr-year-select-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern flatpickr plugin that replaces the default year input with a customizable dropdown select.

[Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [API](#api)

</div>

---

## ✨ Features

- 🎯 **Easy Integration** - Drop-in replacement for the default year selector
- 🎨 **Theme Compatible** - Works seamlessly with all flatpickr themes
- ⚡ **Lightweight** - Minimal overhead (~2.5KB gzipped)
- ♿ **Accessible** - Fully keyboard navigable with ARIA labels
- 🔧 **Configurable** - Customize the year range to your needs
- 📦 **TypeScript Support** - Full type definitions included
- 🌐 **Multi-Instance Safe** - Use multiple instances on the same page
- 🔄 **Constraint-Aware** - Clamps options to `minDate`/`maxDate` (even when changed at runtime) and syncs with current/selected/default year; supports array `defaultDate` by using the first valid entry

## 📦 Installation

```bash
npm install flatpickr flatpickr-year-select-plugin
```

or with yarn:

```bash
yarn add flatpickr flatpickr-year-select-plugin
```

or with a CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/flatpickr-year-select-plugin/dist/yearSelectPlugin.min.css"
/>

<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr-year-select-plugin/dist/flatpickr-year-select-plugin.umd.js"></script>
```

## 🚀 Usage

### Basic Example

```javascript
import flatpickr from 'flatpickr';
import yearSelectPlugin from 'flatpickr-year-select-plugin';
import 'flatpickr-year-select-plugin/dist/yearSelectPlugin.min.css';

flatpickr('#myInput', {
  plugins: [yearSelectPlugin()],
});
```

### With Custom Range

```javascript
flatpickr('#myInput', {
  plugins: [
    yearSelectPlugin({
      start: 5, // Show 5 years before current year
      end: 5, // Show 5 years after current year
    }),
  ],
});
```

### With Date Constraints

```javascript
flatpickr('#myInput', {
  minDate: '2020-01-01',
  maxDate: '2030-12-31',
  plugins: [yearSelectPlugin()],
  // The plugin automatically respects minDate and maxDate
});
```

### TypeScript

```typescript
import flatpickr from 'flatpickr';
import yearSelectPlugin from 'flatpickr-year-select-plugin';
import type { YearDropdownPluginConfig } from 'flatpickr-year-select-plugin';

const config: YearDropdownPluginConfig = {
  start: 10,
  end: 10,
};

flatpickr('#myInput', {
  plugins: [yearSelectPlugin(config)],
});
```

## 🎨 Demo

### Basic Year Selector

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/flatpickr-year-select-plugin/dist/yearSelectPlugin.min.css"
    />
  </head>
  <body>
    <input type="text" id="demo" placeholder="Select a date" />

    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr-year-select-plugin/dist/flatpickr-year-select-plugin.umd.js"></script>
    <script>
      flatpickr('#demo', {
        plugins: [yearSelectPlugin()],
      });
    </script>
  </body>
</html>
```

- GitHub Pages demo: this repository ships a Pages workflow (`.github/workflows/pages.yml`) that builds the package and publishes `demo/index.html` with the built assets from `dist/`. Once Pages is enabled in repository settings, the workflow will deploy on pushes to `main`.

## 📖 API

### Plugin Configuration

| Option  | Type     | Default | Description                                     |
| ------- | -------- | ------- | ----------------------------------------------- |
| `start` | `number` | `3`     | Number of years to show before the current year |
| `end`   | `number` | `3`     | Number of years to show after the current year  |

### Behavior

- If `minDate` is set in flatpickr config, the year range start is automatically adjusted
- If `maxDate` is set in flatpickr config, the year range end is automatically adjusted
- The plugin respects all flatpickr date constraints, clamps options to current `minDate`/`maxDate` (including values changed at runtime), and anchors/synchronizes the dropdown with the picker’s current/selected/default year (falls back to today). Options regenerate on open/year change to stay in sync with constraints and the calendar view.
- `defaultDate` arrays (multi/range) are supported; the first valid date is used to anchor the initial dropdown range.
- Internal clamping avoids redundant `changeYear` calls; calendar view and dropdown stay aligned without extra hook noise.
- Multiple instances on the same page work independently

## 🔧 Compatibility

- **flatpickr**: v4.6.0 or higher
- **Browsers**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Frameworks**: Works with React, Vue, Angular, Svelte, and vanilla JS

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Build JavaScript only
npm run build-js

# Build CSS only
npm run build-css

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Testing

This plugin includes comprehensive unit tests using Jest. The test suite covers:

- ✅ Plugin configuration and initialization
- ✅ DOM element creation and attributes
- ✅ Multiple instance support
- ✅ Date constraint handling (minDate/maxDate)
- ✅ Event handlers (onChange, onOpen, onYearChange)
- ✅ Error handling and edge cases
- ✅ Year option management

Current test coverage:

- **Statements**: 98.38%
- **Branches**: 86.11%
- **Functions**: 100%
- **Lines**: 100%

### Project Structure

```
flatpickr-year-select-plugin/
├── src/
│   ├── plugin.ts       # Main plugin source
│   └── plugin.scss     # Plugin styles
├── tests/
│   ├── plugin.test.cjs # Unit tests (Jest + jsdom)
│   └── setup.cjs       # Test configuration
├── dist/               # Built files
├── build-css.cjs       # CSS build script
├── vite.config.ts      # Vite configuration
├── jest.config.js      # Jest configuration
├── eslint.config.js    # ESLint configuration
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes and add tests if applicable
4. Run the test suite (`npm test`)
5. Ensure linting passes (`npm run lint`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

Please ensure your code:

- Passes all existing tests
- Includes tests for new functionality
- Follows the existing code style (enforced by ESLint and Prettier)
- Maintains or improves code coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**bearholmes**

- Email: bearholmes@gmail.com
- GitHub: [@bearholmes](https://github.com/bearholmes)

## 🙏 Acknowledgments

- Built for [flatpickr](https://flatpickr.js.org/) by Gregory
- Inspired by the need for better year selection UX

---

<div align="center">

Made with ❤️ by bearholmes

</div>
