import { Lightning, Utils } from "@lightningjs/sdk";
import SettingsColumnItem from "./SettingsColumnItem";

interface SettingsColumnTemplateSpec extends Lightning.Component.TemplateSpec {
  Image: object;
  Items: object;
}

export class SettingsColumn
  extends Lightning.Component<SettingsColumnTemplateSpec>
  implements
    Lightning.Component.ImplementTemplateSpec<SettingsColumnTemplateSpec>
{
  index = 0;

  static override _template(): Lightning.Component.Template<SettingsColumnTemplateSpec> {
    return {
      Image: {
        src: Utils.asset("images/selectedItem.png"),
        w: 45,
        h: 45,
        x: 600,
        y: 0,
        zIndex: 2,
        visible: false,
      },
      Items: {
        y: 0,
        x: 0,
        children: [],
      },
    };
  }
  override _init() {
    // Set default language to English if not already set
    if (!localStorage.getItem("lang")) {
      localStorage.setItem("lang", JSON.stringify("EN"));
    }

    // Set default Parcon option to OFF if not already set
    if (!localStorage.getItem("parcon")) {
      localStorage.setItem("parcon", JSON.stringify("OFF"));
      //delete the password from localStorage
      localStorage.removeItem("password");
    }

    this.index = 0;
  }

  set items(items: { label: string; ref: string }[]) {
    const itemsTag = this.tag("Items");
    if (itemsTag) {
      const storedValue =
        this.ref === "LanguageOptions"
          ? localStorage.getItem("lang")?.replace(/"/g, "")
          : this.ref === "ParconOptions"
          ? localStorage.getItem("parcon")?.replace(/"/g, "")
          : null;

      itemsTag.children = items.map((item, index) => {
        return {
          ref: "SETTING-" + item.ref,
          type: SettingsColumnItem,
          y: index * 120,
          item, //
          selected: item.ref === storedValue,
          signals: {
            itemSelected: true,
          },
        };
      });
    }
  }

  override _getFocused(): SettingsColumnItem | null {
    const itemsTag = this.tag("Items");
    const items = itemsTag ? itemsTag.children : [];
    if (items && items[this.index]) {
      return items[this.index] as SettingsColumnItem;
    }
    return null;
  }

  itemSelected(selectedItem: SettingsColumnItem) {
    const itemsTag = this.tag("Items");
    if (itemsTag) {
      (itemsTag.children as unknown as SettingsColumnItem[]).forEach(
        (item: SettingsColumnItem) => {
          item.updateSelectedState(item === selectedItem);
        }
      );
    }
  
    if (this.ref === "LanguageOptions") {
      localStorage.setItem("lang", JSON.stringify(selectedItem.item?.ref));
    } 
    // else if (this.ref === "ParconOptions") {
    //   localStorage.setItem("parcon", JSON.stringify(selectedItem.item?.ref));
    // }
  }

  setSelectedItem(ref: string) {
    const itemsTag = this.tag("Items");
    if (itemsTag) {
      (itemsTag.children as unknown as SettingsColumnItem[]).forEach(
        (item: SettingsColumnItem) => {
          const isSelected = item.item?.ref === ref;
          item.updateSelectedState(isSelected); // Update the selected state
        }
      );
    }
  }

  override _handleUp() {
    if (this.index > 0) {
      this.index--;
      this._refocus();
    }
  }

  override _handleDown() {
    const itemsTag = this.tag("Items");
    if (itemsTag && this.index < itemsTag.children.length - 1) {
      this.index++;
      this._refocus();
    }
  }
}
