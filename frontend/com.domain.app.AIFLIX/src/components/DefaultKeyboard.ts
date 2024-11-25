import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "./Button";
import { COLORS } from "../../static/constants/Colors";
import eventBus from "./EventBus";

export default class DefaultKeyboard extends Lightning.Component {
  _rowIndex = 0;
  _columnIndex = 0;
  ok = 0;

  static override _template() {
    const keys: string[][] = [
      ["SPACE", "BACK"],
      ["a", "b", "c", "d", "e", "f"],
      ["g", "h", "i", "j", "k", "l"],
      ["m", "n", "o", "p", "q", "r"],
      ["s", "t", "u", "v", "w", "x"],
      ["y", "z", "1", "2", "3", "4"],
      ["5", "6", "7", "8", "9", "0"],
      ["ENTER"],
    ];

    return {
      x: 174,
      y: 279,
      w: 325,
      h: 436,
      color: COLORS.BACKGROUND,
      flex: {
        direction: "column" as const,
        alignItems: "flex-start" as const,
        justifyContent: "space-around" as const,
      },
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 20,
      },
      children: keys.map((row, rowIndex) => ({
        flex: {
          direction: "row" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
        children: row.map((key) => {
          let width = 50;
          let mrgL = 27.5;
          let mrgR = 27.5;
          if (key === "SPACE" || key === "BACK") {
            width = 160;
            mrgL =  27.5;
            mrgR = 137.5;
          } else if (key === "ENTER") {
            width = 325;
          }

          return {
            type: Button,
            w: width,
            h: 50,
            buttonText: key,
            textX: width / 2,
            textY: 25,
            fontSize: 36,
            backgroundColor: COLORS.GREY_DARK,
            flexItem: {
              marginLeft:mrgL,
              marginRight:mrgR
            },
          };
        }),
      })),
    };
  }

  override _init() {
    this.ok = 0;
    this._updateFocus();
  }

  _getCurrentKey(): Lightning.Component | undefined {
    const row = this.children[this._rowIndex] as Lightning.Component | undefined;
    return row ? (row.children[this._columnIndex] as Lightning.Component | undefined) : undefined;
  }

  private _updateFocus() {
    this.children.forEach((row, rowIndex) => {
      row.children.forEach((button, colIndex) => {
        button.patch({
          backgroundColor:
            rowIndex === this._rowIndex && colIndex === this._columnIndex
              ? COLORS.GREEN_FOCUS
              : COLORS.GREY_DARK,
        });
      });
    });
  }

  _setIndex(rowIndex: number, colIndex: number) {
    this._rowIndex = rowIndex;
    this._columnIndex = colIndex;
    this._updateFocus();
  }

  focusDown() {
    if (this._rowIndex === this.children.length - 1) {
      eventBus.emit("focusMicrophone");
      return;
    }

    this._rowIndex = Math.min(this._rowIndex + 1, this.children.length - 1);
    const row = this.children[this._rowIndex] as Lightning.Component;
    this._columnIndex = Math.min(this._columnIndex, row.children.length - 1);
    this._updateFocus();
  }

  focusUp() {
    if (this._rowIndex === 0) {
      eventBus.emit("focusBackButton");
      return;
    }

    this._rowIndex = Math.max(this._rowIndex - 1, 0);
    const row = this.children[this._rowIndex] as Lightning.Component;
    this._columnIndex = Math.min(this._columnIndex, row.children.length - 1);
    this._updateFocus();
  }

  override _handleLeft() {
    if (this._columnIndex === 0) {
      Router.focusWidget("Sidebar");
    } else {
      this._columnIndex--;
      this._updateFocus();
    }
  }

  override _handleRight() {
    const row = this.children[this._rowIndex] as Lightning.Component;
    if (
      (this._columnIndex == 5 ||
        this._rowIndex == 7 ||
        (this._rowIndex == 0 && this._columnIndex == 1)) &&
      this.ok === 1
    ) {
      eventBus.emit("focusCarousel");
    } else if (this._columnIndex < row.children.length - 1) {
      this._columnIndex++;
      this._updateFocus();
    }
  }

  override _handleUp() {
    this.focusUp();
  }

  override _handleDown() {
    this.focusDown();
  }

  override _handleEnter() {
    const currentKey = this._getCurrentKey();
    if (currentKey) {
      const buttonText = (currentKey as any).buttonText;
      if (buttonText === "SPACE") {
        eventBus.emit("inputTextUpdate", " ");
      } else if (buttonText === "BACK") {
        eventBus.emit("inputTextUpdate", "BACK");
      } else if (buttonText === "ENTER") {
        eventBus.emit("inputTextUpdate", "ENTER");
        this.ok = 1;
      } else {
        eventBus.emit("inputTextUpdate", buttonText);
      }
    }
  }

  setKey(key: string) {
    const keys: string[][] = [
      ["SPACE", "BACK"],
      ["a", "b", "c", "d", "e", "f"],
      ["g", "h", "i", "j", "k", "l"],
      ["m", "n", "o", "p", "q", "r"],
      ["s", "t", "u", "v", "w", "x"],
      ["y", "z", "1", "2", "3", "4"],
      ["5", "6", "7", "8", "9", "0"],
      ["ENTER"],
    ];

    for (let i = 0; i < keys.length; i++) {
      const row = keys[i];
      if (row) {
        const colIndex = row.indexOf(key);
        if (colIndex !== -1) {
          this._setIndex(i, colIndex);
          break;
        }
      }
    }
  }
}
