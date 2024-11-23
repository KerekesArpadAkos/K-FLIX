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
    const animation = this.tag("Spinner")
      .animation({
        duration: 1, 
        repeat: -1, 
        actions: [
          { p: "rotation", v: { 0: 0, 1: Math.PI * 2 } }, 
        ],
      })
      .start();
  
    setTimeout(() => {
      animation.stop();
    }, 3000); 
  }
  
}