const { getDefaultConfig } = require('expo/metro-config');

// Expo's default config auto-detects the pnpm workspace and sets
// per-package watchFolders; only symlink resolution needs an explicit
// override for pnpm's node_modules layout.
const config = getDefaultConfig(__dirname);

module.exports = config;
