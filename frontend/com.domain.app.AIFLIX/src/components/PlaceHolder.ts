import { Lightning, Utils } from "@lightningjs/sdk";

interface PlaceHolderTemplateSpec extends Lightning.Component.TemplateSpec {
  PlaceholderSvg: object;
  props: PlaceHolderProps;
}

type PlaceHolderProps = {
  x: number;
  y: number;
};

export class PlaceHolder extends Lightning.Component<PlaceHolderTemplateSpec> {
  static override _template() {
    return {
      PlaceholderSvg: {
        mount: 0.5,
        visible: false,
      },
    };
  }

  get PlaceholderSvg() {
    return this.getByRef("PlaceholderSvg");
  }

  set props(props: PlaceHolderProps) {
    const { x, y } = props;
    this.PlaceholderSvg!.patch({
      x: x,
      y: y,
      w: 50,
      h: 50,
      texture: Lightning.Tools.getSvgTexture(
        Utils.asset("images/noData.svg"),
        100,
        30
      ),
      zIndex: 2,
      visible: true,
    });
  }
}

export default PlaceHolder;
