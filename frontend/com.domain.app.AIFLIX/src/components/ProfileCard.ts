import { Lightning, Utils } from "@lightningjs/sdk";
import { COLORS } from "static/constants/Colors";

interface ProfileCardTemplateSpec extends Lightning.Component.TemplateSpec {
  Card: {
    ProfileImage: object;
    ProfileName: object;
  };
}

export default class ProfileCard extends Lightning.Component<ProfileCardTemplateSpec> {
  static override _template(): Lightning.Component.Template<ProfileCardTemplateSpec> {
    return {
      Card: {
        ref: "Card",
        w: 220,
        h: 282,
        color: COLORS.BACKGROUND,
        ProfileImage: {
          ref: "ProfileImage",
          w: 220,
          h: 220,
          src: Utils.asset("images/profile1.png"), //user will select a profile image
        },
        ProfileName: {
          ref: "ProfileName",
          w: 220,
          h: 40,
          y: 240,
          text: {
            text: "Jennifer",
            fontSize: 30,
            fontFace: "Regular",
            textColor: COLORS.WHITE,
            fontStyle: "bold",
            textAlign: "center",
          },
        },
      },
    };
  }

  get Card() {
    return this.getByRef("Card");
  }
  get ProfileImage() {
    return this.Card?.getByRef("ProfileImage");
  }

  get ProfileName() {
    return this.Card?.getByRef("ProfileName");
  }

  //implement setters for ProfileImage and ProfileName

  set profileImage(value: string) {
    if (this.ProfileImage) this.ProfileImage.patch({ src: value });
  }

  set profileName(value: string) {
    if (this.ProfileName && this.ProfileName.text)
      this.ProfileName.patch({ text: value });
  }
}
