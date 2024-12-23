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
        texture: {
          type: Lightning.textures.ImageTexture,
        },
        w: 70,
        h: 70,
        x: 35,
        y: 15, // Adjusted y-position for Icon
        color: COLORS.WHITE,
      },
      Label: {
        type: Lightning.Component,
        text: {
          text: "",
          fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
          textColor: COLORS.WHITE,
        },
        x: 144, // Adjusted x-position for Label
        mountY: 0.5,
        y: 50, // Adjusted y-position for Label to align with Icon
      },
    };
  }

  set itemData(data: SidebarItem) {
    this._data = data;
    this.setIcon(data.icon);
    this.tag("Label").text = data.name;
  }

  private setIcon(icon: string) {
    if (icon.startsWith("http://") || icon.startsWith("https://")) {
      // Use remote image as texture
      this.tag("Icon").patch({
        texture: {
          type: Lightning.textures.ImageTexture,
          src: icon,
        },
      });
    } else {
      // Use local image asset
      this.tag("Icon").patch({
        texture: {
          type: Lightning.textures.ImageTexture,
          src: Utils.asset(icon),
        },
      });
    }
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
  private _isExpanded: boolean = false; // Track sidebar state

  static getSidebarConfig(): SidebarItem[] {
    return [
      { name: localStorage.getItem("profileName") || "Guest", icon: `${localStorage.getItem("profileImage") || "images/guest.png"}`, route: "profile" },
      { name: "Search", icon: "images/search.png", route: "search" },
      { name: "Home", icon: "images/home.png", route: "home" },
      { name: "Movies", icon: "images/movies.png", route: "movies" },
      { name: "Series", icon: "images/series.png", route: "series" },
      { name: "Settings", icon: "images/settings.png", route: "settings" },
      { name: "Logout", icon: "images/logout.png", route: "logout" },
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
      SidebarItems: {
        y: 165,
        children: items.map((item, index) => ({
          type: SidebarItemComponent,
          name: item.name,
          y: index * 100,
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

  override _active() {
    this.refreshSidebarProfile();
  }

  refreshSidebarProfile() {
    const profileName = localStorage.getItem("profileName") || "Guest";
    const profileImage = localStorage.getItem("profileImage") || "images/guest.png";
    const icon = profileImage.startsWith("http://") || profileImage.startsWith("https://")
      ? profileImage
      : Utils.asset(profileImage);

    this.tag("SidebarItems").children[0].itemData = {
      name: profileName,
      icon: icon,
      route: "profile",
    };
  }

  override _getFocused() {
    return this.tag("SidebarItems").children[this._focusIndex];
  }

  override _handleDown() {
    this._focusIndex = (this._focusIndex + 1) % Sidebar.getSidebarConfig().length;
    this._updateFocus();
  }

  override _handleUp() {
    this._focusIndex =
      (this._focusIndex - 1 + Sidebar.getSidebarConfig().length) % Sidebar.getSidebarConfig().length;
    this._updateFocus();
  }

  override _handleEnter() {
    const selectedItem = Sidebar.getSidebarConfig()[this._focusIndex];
    if (selectedItem) {
      if (selectedItem.name === "Logout") {
        Router.navigate(selectedItem.route, { pageRoute: Router.getActiveHash() });
      } else {
        Router.navigate(selectedItem.route);
      }
    }
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
    // Ensure all labels are hidden on initialization
    this.tag("SidebarItems").children.forEach((child: SidebarItemComponent) => {
      child.showLabel(false);
    });

    this._applyUnfocusedPatch();
  }

  override _focus() {
    console.log("Focusing sidebar");
    this.tag("Image").patch({
      src: Utils.asset("images/logoName.png"),
      h: 70,
      w: 215,
    });
    this._isExpanded = true; // Sidebar is now expanded
    this.patch({
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      color: COLORS.BLACK,
    });

    this.tag("SidebarItems").children.forEach((child: SidebarItemComponent) => {
      child.showLabel(true); // Show labels when expanded
    });


    this._focusIndex = 0;
    this._updateFocus();
  }

  private _applyUnfocusedPatch() {
    console.log("Unfocusing sidebar");
    this.patch({
      w: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
      color: COLORS.BLACK,
    });
  
    this.tag("SidebarItems").children.forEach((child: SidebarItemComponent) => {
      child.showLabel(false); // Hide labels when sidebar is collapsed
    });
  
    this.tag("Image").patch({
      src: Utils.asset("images/AI.png"),
      h: 70,
      w: 70,
    });
  }

  override _unfocus() {
    console.log("Unfocusing sidebar");
    this._isExpanded = false; // Sidebar is now collapsed
    this.patch({
      w: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
      color: COLORS.BLACK,
    });
  
    this.tag("SidebarItems").children.forEach((child: SidebarItemComponent) => {
      child.showLabel(false); // Hide labels when collapsed
    });
  
    this.tag("Image").patch({
      src: Utils.asset("images/AI.png"),
      h: 70,
      w: 70,
    });
  }
  
}
