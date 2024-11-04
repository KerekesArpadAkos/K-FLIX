import { SCREEN_SIZES } from "static/constants/ScreenSizes";
import { COLORS } from "static/constants/Colors";
import Lightning from "@lightningjs/core";
import LoadingSpinner from "src/components/LoadingSpinner";

interface LoadingPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Name: object;
  LoadingSpinner: typeof LoadingSpinner;
}

export default class LoadingPage extends Lightning.Component<LoadingPageTemplateSpec> {
  static override _template(): Lightning.Component.Template<LoadingPageTemplateSpec> {
    return {
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      rect: true,
      color: COLORS.BACKGROUND,
      Name: {
        x: 785,
        y: 180,
        text: {
          text: "AIFLIX",
          fontSize: 100,
          fontFace: "Regular",
          textColor: COLORS.WHITE,
        },
        zIndex: 1,
      },
      LoadingSpinner: {
        type: LoadingSpinner,
        x: 900,
        y: 669,
      },
    };
  }
}
