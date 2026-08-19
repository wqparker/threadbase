// client/src/tests/setup.js
import '@testing-library/jest-dom';

// jsdom doesn't implement matchMedia - useTheme() calls it to detect the
// OS/browser colour-scheme preference, so every test rendering <App/>
// would throw without this stub. Defaults to "no dark preference".
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
