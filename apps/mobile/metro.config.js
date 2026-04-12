const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

// Comprehensive blocklist to exclude build tools and dev-only packages
// that use import.meta from the web bundle
config.resolver.blockList = [
  /node_modules\/@react-native\/debugger-frontend\/.*/,
  /node_modules\/playwright-core\/.*/,
  /node_modules\/playwright\/.*/,
  /node_modules\/vite\/.*/,
  /node_modules\/@vitejs\/.*/,
  /node_modules\/esbuild\/.*/,
  /node_modules\/rollup\/.*/,
  /node_modules\/terser\/.*/,
];

// Disable experimental features that can cause issues
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

module.exports = config;
