import { Lightning } from "@lightningjs/sdk";
import { Button } from "./Button"; // Adjust this path
import { COLORS } from "../../static/constants/Colors"; // Adjust path
import eventBus from "./EventBus"; // Adjust path

export default class DefaultKeyboardForAvatar extends Lightning.Component {
  private _rowIndex = 0;
  private _columnIndex = 0;
  private _okPressed = false; // If needed, to track 'ENTER' usage

  static override _template() {
    // Define your keyboard layout here
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
          direction: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        children: row.map((key) => {
          let width = 50;
          let marginLeft = 27.5;
          let marginRight = 27.5;

          if (key === "SPACE" || key === "BACK") {
            width = 160;
            marginLeft = 27.5;
            marginRight = 137.5;
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
              marginLeft,
              marginRight,
            },
          };
        }),
      })),
    };
  }

  override _init() {
    this._okPressed = false;
    this._updateFocus();
  }

  /**
   * Helper to get the current key being focused
   */
  private _getCurrentKey(): Lightning.Component | undefined {
    const row = this.children[this._rowIndex] as Lightning.Component | undefined;
    if (!row) return undefined;
    return row.children[this._columnIndex] as Lightning.Component | undefined;
  }

  /**
   * Apply the focus highlights based on _rowIndex / _columnIndex
   */
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

  /**
   * Move focus to a specific (row, col)
   */
  private _setIndex(rowIndex: number, colIndex: number) {
    this._rowIndex = rowIndex;
    this._columnIndex = colIndex;
    this._updateFocus();
  }

  /**
   * Move focus down to the next row
   */
  private _focusDown() {
    if (this._rowIndex === this.children.length - 1) {
      // Example: if you want to move focus to the microphone after the last row
      eventBus.emit("focusMicrophone");
      return;
    }

    this._rowIndex = Math.min(this._rowIndex + 1, this.children.length - 1);
    const row = this.children[this._rowIndex] as Lightning.Component;
    this._columnIndex = Math.min(this._columnIndex, row.children.length - 1);
    this._updateFocus();
  }

  /**
   * Move focus up to the previous row
   */
  private _focusUp() {
    // Example: if you want to do something special at the top row, you can do it here.
    if (this._rowIndex === 0) {
      // Possibly emit an event to focus something else if required
      return;
    }

    this._rowIndex = Math.max(this._rowIndex - 1, 0);
    const row = this.children[this._rowIndex] as Lightning.Component;
    this._columnIndex = Math.min(this._columnIndex, row.children.length - 1);
    this._updateFocus();
  }

  /* -------------------------------------------------------------------------
   * Key Handling
   * -------------------------------------------------------------------------
   */

  override _handleLeft() {
    // Simplified: just move left if possible
    if (this._columnIndex > 0) {
      this._columnIndex--;
      this._updateFocus();
    }
  }

  override _handleRight() {
    // Simplified: just move right if possible
    const row = this.children[this._rowIndex] as Lightning.Component;
    if (this._columnIndex < row.children.length - 1) {
      this._columnIndex++;
      this._updateFocus();
    }
  }

  override _handleUp() {
    this._focusUp();
  }

  override _handleDown() {
    this._focusDown();
  }

  override _handleEnter() {
    const currentKey = this._getCurrentKey();
    if (!currentKey) return;

    const buttonText = (currentKey as any).buttonText;
    if (buttonText === "SPACE") {
      eventBus.emit("inputTextUpdate", " ");
    } else if (buttonText === "BACK") {
      eventBus.emit("inputTextUpdate", "BACK");
    } else if (buttonText === "ENTER") {
      eventBus.emit("inputTextUpdate", "ENTER");
      this._okPressed = true;
    } else {
      eventBus.emit("inputTextUpdate", buttonText);
    }
  }

  /**
   * If you need to programmatically set the keyboard focus to a certain key
   */
  public setKey(key: string) {
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
      if (!row) continue;
      const colIndex = row.indexOf(key);
      if (colIndex !== -1) {
        this._setIndex(i, colIndex);
        break;
      }
    }
  }
}
