// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
	commonjs: true,
	jquery: true
  },
  globals: {
    'BOLDGRID': true,
    'BoldGrid': true,
    'BOLDGRID.Sass': true,
    'BOLDGRIDColorPalettes': true,
    'BOLDGRIDSass': true,
    'Sass': true,
    'kirkiPostMessageFields': true,
    '_wpCustomizePreviewNavMenusExports': true,
    '_wpCustomizeSettings': true,
    'net': true,
    '__webpack_public_path__': true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [ 'eslint:recommended', 'wordpress' ],
  plugins: [
    'html'
  ],
  // Add your custom rules here
  'rules': {
	'space-in-parens': ['error', 'always'],
	"wrap-iife": [2, "any"],
    // Allow async-await
    'generator-star-spacing': 0,
    // Allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};
