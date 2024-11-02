import { COLORS } from "static/constants/Colors";
import { Lightning } from "@lightningjs/sdk";
import { Button } from "./Button";

interface LandscapeKeyboardTemplateSpec
  extends Lightning.Component.TemplateSpec {
  Buttons: {
    type: typeof Button;
  }[];
}

export class LandscapeKeyboard extends Lightning.Component<LandscapeKeyboardTemplateSpec> {
  static override _template(): Lightning.Component.Template<LandscapeKeyboardTemplateSpec> {
    const totalWidth = 681;
    const totalHeight = 267;

    const buttonWidth = totalWidth / 10;
    const buttonHeight = totalHeight / 4;
    const buttonFontSize = 33;

    const keyboardLayout = [
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
      ["m", "n", "o", "p", "q", "r", "s", "t", "u", "v"],
      ["y", "z", "k", "l", "w", "x", "@", "BS", "SP", "OK"],
    ];

    const buttonGrid = keyboardLayout.flatMap((row, rowIndex) =>
      row.map((buttonText, colIndex) => ({
        type: Button,
        x: colIndex * buttonWidth,
        y: rowIndex * buttonHeight,
        w: buttonWidth - 5,
        h: buttonHeight - 5,
        buttonText: buttonText,
        fontSize: buttonFontSize,
        backgroundColor: COLORS.GREY_DARK,
        textColor: COLORS.WHITE,
      }))
    );

    return {
      x: 620,
      y: 790,
      Buttons: {
        children: buttonGrid,
      },
    };
  }

  // Access buttons if needed
  get Buttons() {
    return this.tag("Buttons")?.children;
  }
}
