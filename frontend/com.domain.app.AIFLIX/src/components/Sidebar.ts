import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";

interface SidebarItem {
  name: string;
  icon: string;
  route: string;
}

class SidebarItemComponent extends Lightning.Component {
  private _data?: SidebarItem;

  static override _template() {
    return {
      w: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
      h: 100,
      rect: true,
      color: COLORS.TRANSPARENT,
      Icon: {
        type: Lightning.Component,
        src: "", // Set dynamically
        w: 70,
        h: 70,
        x: 35,
        y: 270,
        color: COLORS.WHITE,
      },
      Label: {
        type: Lightning.Component,
        text: {
          text: "",
          fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
          textColor: COLORS.WHITE,
        },
        x: 144,
        y: 287,
      },
    };
  }

  set itemData(data: SidebarItem) {
    this._data = data;
    this.tag("Icon").src = Utils.asset(data.icon);
    this.tag("Label").text = data.name;
  }

  override _focus() {
    this.tag("Label").text.textColor = COLORS.GREEN_FOCUS;
    this.tag("Icon").color = COLORS.GREEN_FOCUS;
  }

  override _unfocus() {
    this.tag("Label").text.textColor = COLORS.WHITE;
    this.tag("Icon").color = COLORS.WHITE;
  }

  showLabel(show: boolean) {
    this.tag("Label").visible = show;
  }
}

export class Sidebar extends Lightning.Component {
  private _focusIndex: number = 0;
  private sidebarConfig: SidebarItem[] = Sidebar.getSidebarConfig();

  static getSidebarConfig(): SidebarItem[] {
    return [
      { name: "Search", icon: "images/search.png", route: "search" },
      { name: "Home", icon: "images/home.png", route: "home" },
      { name: "Movies", icon: "images/movies.png", route: "movies" },
      { name: "Series", icon: "images/series.png", route: "series" },
      { name: "Settings", icon: "images/settings.png", route: "settings" },
    ];
  }

  static override _template() {
    const items = Sidebar.getSidebarConfig();
    return {
      w: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
      h: SCREEN_SIZES.HEIGHT,
      rect: true,
      color: COLORS.BLACK,
      shader: { type: Lightning.shaders.FadeOut, right: 0 },
      zIndex: 2,
      Profile: {
        src: Utils.asset("images/guest.png"),
        x: 35,
        y: 65,
        w: 70,
        h: 70,
        GuestLabel: {
          type: Lightning.Component,
          text: {
            text: "Guest",
            fontStyle: "bold",
            fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
            textColor: COLORS.WHITE,
          },
          x: 110, // Adjusted relative position
          y: 20,
          visible: false,
        },
      },
      SidebarItems: {
        y: 65,
        children: items.map((item, index) => ({
          type: SidebarItemComponent,
          name: item.name,
          y: index * 103,
          x: 0,
          itemData: item,
        })),
      },
      Image: {
        src: Utils.asset("images/AI.png"),
        x: 35,
        y: 967,
        w: 70,
        h: 70,
      },
    };
  }

  override _getFocused() {
    return this.tag("SidebarItems").children[this._focusIndex];
  }

  override _handleDown() {
    this._focusIndex = (this._focusIndex + 1) % this.sidebarConfig.length;
    this._updateFocus();
  }

  override _handleUp() {
    this._focusIndex =
      (this._focusIndex - 1 + this.sidebarConfig.length) %
      this.sidebarConfig.length;
    this._updateFocus();
  }

  override _handleEnter() {
    const selectedItem = this.sidebarConfig[this._focusIndex];
    if (selectedItem) Router.navigate(selectedItem.route);
    Router.focusPage();
  }

  private _updateFocus() {
    this.tag("SidebarItems").children.forEach((child: SidebarItemComponent) => {
      child._unfocus();
    });

    const focusedItem = this.tag("SidebarItems").children[
      this._focusIndex
    ] as SidebarItemComponent;
    focusedItem._focus();
  }

  override _handleRight() {
    Router.focusPage();
    return true;
  }

  override _handleLeft() {
    return;
  }

  override _enable() {
    this._applyUnfocusedPatch();
  }

  override _focus() {
    console.log("Focusing sidebar");
    this.patch({
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      color: COLORS.BLACK,
    });

    this.tag("SidebarItems").children.forEach((child: SidebarItemComponent) => {
      child.showLabel(true);
    });

    this.tag("Profile").tag("GuestLabel").patch({
      visible: true,
    });

    this.tag("Image").patch({
      src: Utils.asset("images/logoName.png"),
      h: 70,
      w: 215,
    });

    this._focusIndex = 0;
    this._updateFocus();
  }

  override _unfocus() {
    this._applyUnfocusedPatch();
    this.tag("Profile").tag("GuestLabel").patch({
      visible: false,
    });
  }

  private _applyUnfocusedPatch() {
    console.log("Unfocusing sidebar");
    this.patch({
      w: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
      color: COLORS.BLACK,
    });

    this.tag("SidebarItems").children.forEach((child: SidebarItemComponent) => {
      child.showLabel(false);
    });

    this.tag("Image").patch({
      src: Utils.asset("images/AI.png"),
      h: 70,
      w: 70,
    });
  }
}
