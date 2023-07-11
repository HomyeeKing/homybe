import { registerCanvasListener } from '../src/qrdecode.js';
export async function main() {
  // const jsQrUrl = chrome.runtime.getURL('content_scripts/jsqr.js');
  // await import(jsQrUrl);
  registerCanvasListener();
}
