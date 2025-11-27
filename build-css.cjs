const fs = require('fs').promises;
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('postcss');

/**
 * Compiles SCSS to CSS and generates both minified and unminified versions
 */
async function compileCss() {
  try {
    const filePath = './src/plugin.scss';

    // Compile SCSS to CSS using modern API
    const result = sass.compile(filePath);
    const css = result.css;

    // Process CSS with autoprefixer and cssnano
    const unminifiedCssPromise = postcss([autoprefixer]).process(css, { from: undefined });
    const minifiedCssPromise = postcss([cssnano, autoprefixer]).process(css, { from: undefined });

    const [unminifiedCss, minifiedCss] = await Promise.all([
      unminifiedCssPromise,
      minifiedCssPromise,
    ]);

    // Write output files
    await Promise.all([
      fs.writeFile('./dist/yearSelectPlugin.css', unminifiedCss.css),
      fs.writeFile('./dist/yearSelectPlugin.min.css', minifiedCss.css),
    ]);

    console.log('✓ CSS compiled successfully');
  } catch (error) {
    console.error('✗ CSS compilation failed:', error.message);
    process.exit(1);
  }
}

compileCss();
