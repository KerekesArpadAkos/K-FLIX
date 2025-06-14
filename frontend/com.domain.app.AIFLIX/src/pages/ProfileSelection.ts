import { Lightning, Router, Utils } from "@lightningjs/sdk";
import ProfileCard from "src/components/ProfileCard";
import { COLORS } from "static/constants/Colors";
import { SCREEN_SIZES } from "static/constants/ScreenSizes";
import { fetchProfiles, addProfile } from "../services/firebaseService";
import { getAuth } from "firebase/auth";

export default class ProfileSelection extends Lightning.Component {
  private _focusIndex = 0;
  private _userId: string | null = null;
  private _profiles: any[] = [];

  static override _template() {
    return {
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      rect: true,
      color: COLORS.BACKGROUND,
      Title: {
        x: 80,
        y: 185,
        w: 1760,
        h: 130,
        text: {
          text: "Who's Watching?",
          fontSize: 100,
          fontFace: "NetflixSans-Medium",
          textColor: COLORS.WHITE,
          textAlign: "center",
        },
      },
      Container: {
        x: 256,
        y: 462,
        w: 1407,
        h: 333,
        flex: {
          direction: "row",
          wrap: false,
          justifyContent: "space-around",
          alignItems: "center",
        },
        children: [],
      },
    };
  }

  get Container() {
    return this.getByRef("Container");
  }

  override set params(params: { userId: string }) {
    this._userId = params.userId || null;
  }

  override async _active() {
    if (!this._userId) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        this._userId = user.uid;
      } else {
        console.error("User not authenticated.");
        Router.navigate("signin");
        return;
      }
    }
    await this.loadProfiles();
    if (this.Container.children.length > 0) {
      this._applyFocus();
    }
  }

  async loadProfiles() {
    try {
      if (this._userId) {
        const profiles = await fetchProfiles(this._userId);
        this.displayProfiles(profiles);
      } else {
        console.error("User ID is null.");
      }
    } catch (error) {
      console.error("Error loading profiles:", error);
    }
  }

  private getImageSrc(image: string): string {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image; // Remote URL
    } else {
      return Utils.asset(image); // Local asset
    }
  }

  displayProfiles(profiles: any) {
    const profileCards = profiles.map((profile: any) => ({
      y: -130,
      x: -110,
      type: ProfileCard,
      profileImage: this.getImageSrc(profile.image || "images/profiles/profile1.png"),
      profileName: profile.name,
      profileId: profile.id,
    }));

    if (profileCards.length <= 4) {
      profileCards.push({
        y: -130,
        x: -110,
        type: ProfileCard,
        profileImage: Utils.asset("images/addProfile.png"),
        profileName: "Add Profile",
        onEnter: () => this.handleAddProfile(),
      });
    }

    this.Container.children = profileCards;
  }

  async handleAddProfile() {
    try {
      if (this._userId) {
        await addProfile(this._userId);
        await this.loadProfiles();
      } else {
        console.error("User ID is null.");
      }
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  }

  _applyFocus() {
    const focusedCard = this.Container.children[this._focusIndex];
    if (focusedCard && focusedCard.tag && focusedCard.tag("ProfileImage")) {
      focusedCard.tag("ProfileImage").patch({
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 10,
          stroke: 9,
          strokeColor: COLORS.GREEN_FOCUS,
        },
      });
    }
  }

  _removeFocus() {
    const focusedCard = this.Container.children[this._focusIndex];
    if (focusedCard && focusedCard.tag && focusedCard.tag("ProfileImage")) {
      focusedCard.tag("ProfileImage").patch({
        shader: null,
      });
    }
  }

  override _handleRight() {
    if (this._focusIndex < this.Container.children.length - 1) {
      this._removeFocus();
      this._focusIndex++;
      this._applyFocus();
    }
  }

  override _handleLeft() {
    if (this._focusIndex > 0) {
      this._removeFocus();
      this._focusIndex--;
      this._applyFocus();
    }
  }

  override _handleDown() {
    Router.navigate("deleteprofile", { userId: this._userId, profileId: localStorage.getItem("profileId") || "" });
  }

  override _handleEnter() {
    const focusedCard = this.Container.children[this._focusIndex];
    if (focusedCard && focusedCard.tag && focusedCard.tag("ProfileName")) {
      const profileName = focusedCard.tag("ProfileName").text.text;

      if (profileName === "Add Profile") {
        if (this._userId) {
          Router.navigate(`createprofile/${this._userId}`);
        } else {
          console.error("User ID is null. Cannot navigate to create profile.");
        }
      } else {
        // Fetch profiles to identify the selected profile
        fetchProfiles(this._userId!)
          .then((profiles) => {
            const selectedProfile = profiles.find(
              (profile: any) => profile.name === profileName
            );

            if (selectedProfile) {
              const profileId = selectedProfile.id;
              const profileImage = selectedProfile.image;
              console.log("Navigating to Home with:", {
                userId: this._userId,
                profileId,
              });


              // Store values in localStorage as well
              localStorage.setItem("profileId", profileId);
              localStorage.setItem("profileName", profileName);
              localStorage.setItem("profileImage", profileImage);

              // Navigate to home
              Router.navigate("home");
            } else {
              console.error(
                "Profile not found for the selected name:",
                profileName
              );
            }
          })
          .catch((error) => {
            console.error("Error fetching profiles for navigation:", error);
          });
      }
    }
  }

  override _getFocused() {
    return this.Container.children[this._focusIndex];
  }
}
