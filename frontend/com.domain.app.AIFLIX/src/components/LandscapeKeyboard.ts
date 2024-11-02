import { COLORS } from "static/constants/Colors";
import { Lightning } from "@lightningjs/sdk";
import { Button } from "./Button";

interface LandscapeKeyboardTemplateSpec
  extends Lightning.Component.TemplateSpec {
  Buttons: {
    children: Lightning.Component.TemplateSpec[];
  };
}

export class LandscapeKeyboard extends Lightning.Component<LandscapeKeyboardTemplateSpec> {
  private _currentRow = 0;
  private _currentCol = 0;
  private _columns = 10;
  private _rows = 4;
  private _keyboardLayout: string[][] | undefined;

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
        ref: `Button-${rowIndex}-${colIndex}`,
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

  override _init() {
    this._currentRow = 0;
    this._currentCol = 0;
    this._columns = 10;
    this._rows = 4;
    this._keyboardLayout = [
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
      ["m", "n", "o", "p", "q", "r", "s", "t", "u", "v"],
      ["y", "z", "k", "l", "w", "x", "@", "BS", "SP", "OK"],
    ];
  }

  override _getFocused() {
    return this.currentButton;
  }

  get currentButton() {
    return this.tag("Buttons")?.children[
      this._currentRow * this._columns + this._currentCol
    ] as Button;
  }

  override _handleLeft() {
    if (this._currentCol > 0) {
      this._currentCol--;
      this._updateFocus();
    }
  }

  override _handleRight() {
    if (this._currentCol < this._columns - 1) {
      this._currentCol++;
      this._updateFocus();
    }
  }

  override _handleUp() {
    if (this._currentRow > 0) {
      this._currentRow--;
      this._updateFocus();
    } else {
      // If at the top row, signal to the parent component
      this.signal("upFromKeyboard");
    }
  }

  override _handleDown() {
    if (this._currentRow < this._rows - 1) {
      this._currentRow++;
      this._updateFocus();
    }
  }

  override _handleEnter() {
    const char = this._keyboardLayout?.[this._currentRow]?.[this._currentCol];
    // Handle special keys
    if (char === "BS") {
      this.signal("onKeyPress", "BS");
    } else if (char === "SP") {
      this.signal("onKeyPress", " ");
    } else if (char === "OK") {
      this.signal("onKeyPress", "OK");
    } else {
      this.signal("onKeyPress", char);
    }
  }

  _updateFocus() {
    this._refocus();
  }

  get Buttons() {
    return this.tag("Buttons")?.children;
  }
}
