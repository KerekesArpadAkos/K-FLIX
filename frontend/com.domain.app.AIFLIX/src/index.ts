import { Launch } from '@lightningjs/sdk';
import { App } from './App';


// const tag = document.createElement('script');
// tag.src = './devtools/lightning-inspect.js';
// tag.onload = () => console.log('Inspector script loaded successfully');
// tag.onerror = () => console.error('Failed to load inspector script');
// document.body.appendChild(tag);


const app = Launch(App, {
  stage: {},
  debug: true,
  enablePointer: true,
  keys: {
    38: 'Up',
    40: 'Down',
    37: 'Left',
    39: 'Right',
    13: 'Enter',
    8: 'Back',
    27: 'Exit',
  },
}, {
  showFps: true,
  inspector: true,
  // "showVersion": true,
});

const canvas = app.stage.getCanvas();
document.body.appendChild(canvas);