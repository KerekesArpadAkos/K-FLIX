import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "./Button";
import { COLORS } from "../../static/constants/Colors";
import eventBus from "./EventBus";

export default class DefaultKeyboard extends Lightning.Component {
  _rowIndex = 0;
  _columnIndex = 0;

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
      x: 199,
      y: 279,
      w: 325,
      h: 436,
      rect: true,
      flex: {
        direction: "column" as const,
        alignItems: "center" as const,
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
          if (key === "SPACE" || key === "BACK") {
            width = 160;
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
            textColor: COLORS.WHITE,
            flexItem: {
              margin: 2.5,
            },
          };
        }),
      })),
    };
  }

  override _init() {
    this._updateFocus();
  }

  _getCurrentKey(): Lightning.Component | undefined {
    const row = this.children[this._rowIndex] as
      | Lightning.Component
      | undefined;
    return row
      ? (row.children[this._columnIndex] as Lightning.Component | undefined)
      : undefined;
  }

  private _updateFocus() {
    console.log(this._rowIndex);
    this.children.forEach((row, rowIndex) => {
      row.children.forEach((button, colIndex) => {
        button.patch({
          color:
            rowIndex === this._rowIndex && colIndex === this._columnIndex
              ? 0xffaaaaaa
              : 0xff333333,
        });
      });
    });
  }

  _setIndex(index: number) {
    this._rowIndex = Math.floor(index / 6);
    this._columnIndex = index % 6;
    this._updateFocus();
  }

  focusNext() {
    const row = this.children[this._rowIndex] as
      | Lightning.Component
      | undefined;
    if (row) {
      this._columnIndex = (this._columnIndex + 1) % row.children.length;
      this._updateFocus();
    }
  }

  focusPrevious() {
    const row = this.children[this._rowIndex] as
      | Lightning.Component
      | undefined;
    if (row) {
      this._columnIndex =
        (this._columnIndex - 1 + row.children.length) % row.children.length;
      this._updateFocus();
    }
  }

  focusDown() {
    if (this._rowIndex === this.children.length - 1) {
      return; // If on the last row ("ENTER"), do nothing on further down presses
    }

    this._rowIndex = Math.min(this._rowIndex + 1, this.children.length - 1);
    const row = this.children[this._rowIndex] as Lightning.Component;
    this._columnIndex = Math.min(this._columnIndex, row.children.length - 1);
    this._updateFocus();
  }

  focusUp() {
    if (this._rowIndex === 0) {
      //change the color of the search button
      //   eventBus.emit("focusSearchInput");
      //change the color of the button where i was, if possible

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
    if (this._columnIndex < row.children.length - 1) {
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

  triggerEnter(): string | undefined {
    const currentKey = this._getCurrentKey();
    if (currentKey) {
      const buttonText = (currentKey as any).buttonText;
      if (buttonText) {
        console.log(buttonText);
        return buttonText;
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
      if (row !== undefined) {
        const colIndex = row.indexOf(key);
        if (colIndex !== -1) {
          this._rowIndex = i;
          this._columnIndex = colIndex;
          this._updateFocus();
          break;
        }
      }
    }
  }
}
