// LoadingSpinner.js
import { Lightning, Utils } from "@lightningjs/sdk";

export default class LoadingSpinner extends Lightning.Component {
  static override _template() {
    return {
      Spinner: {
        w: 120,
        h: 120,
        src: Utils.asset("images/spinner.png"),
      },
    };
  }

  override _init() {
    this._rotateSpinner();
  }

  _rotateSpinner() {
    this.tag("Spinner")
      .animation({
        duration: 1, // 1 second per rotation
        repeat: -1, // Infinite repetitions
        actions: [
          { p: "rotation", v: { 0: 0, 1: Math.PI * 2 } }, // Rotate from 0 to 360 degrees
        ],
      })
      .start();
  }
}
