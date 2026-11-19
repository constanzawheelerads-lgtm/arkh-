import type { CapacitorConfig } from '@capacitor/cli';

// The app id must be unique in each store and cannot change after the first
// publication. Review it before publishing (see docs/PUBLICAR-EN-TIENDAS.md).
const config: CapacitorConfig = {
  appId: 'com.arkhestudy.tarot',
  appName: 'Arkhé',
  webDir: 'dist',
  backgroundColor: '#2a1f4e',
  android: {
    backgroundColor: '#2a1f4e',
  },
  ios: {
    backgroundColor: '#2a1f4e',
    contentInset: 'never',
  },
};

export default config;
