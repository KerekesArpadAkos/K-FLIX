import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "src/components/Button";
import { COLORS } from "static/constants/Colors";
import { SCREEN_SIZES } from "static/constants/ScreenSizes";
import { LandscapeKeyboard } from "src/components/LandscapeKeyboard";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app, auth, db, setGlobalUserId } from "../services/firebaseService";

interface LoginPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Name: object;
  Container: {
    EmailContainer: {
      EmailLabel: object;
    };
    WrongEmailMessage: object;
    PasswordContainer: {
      PasswordLabel: object;
    };
    WrongPasswordMessage: object;
    LoginButton: typeof Button;
    NoAccountMessage: object;
    RegisterButton: typeof Button;
  };
  LandscapeKeyboard: typeof LandscapeKeyboard;
}

export default class LoginPage extends Lightning.Component<LoginPageTemplateSpec> {
  private _currentInputField: "Email" | "Password" | null = null;

  static override _template(): Lightning.Component.Template<LoginPageTemplateSpec> {
    return {
      rect: true,
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      color: COLORS.BACKGROUND,

      Name: {
        x: 785,
        y: 31,
        text: {
          text: "AIFLIX",
          fontSize: 100,
          fontFace: "Regular",
          textColor: COLORS.WHITE,
        },
        zIndex: 1,
      },

      Container: {
        ref: "Container",
        x: 722,
        y: 125,
        w: 476,
        h: 614,
        rect: true,
        color: COLORS.BACKGROUND,
        EmailContainer: {
          ref: "EmailContainer",
          x: 15,
          y: 89,
          w: 450,
          h: 90,
          color: COLORS.BLACK,
          rect: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 10,
            stroke: 3,
            strokeColor: COLORS.GREY_LIGHT,
          },
          EmailLabel: {
            ref: "EmailLabel",
            x: 15,
            y: 25,
            w: 420,
            h: 45,
            text: {
              text: "Email",
              fontSize: 25,
              fontFace: "Regular",
              textColor: COLORS.WHITE,
            },
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 6,
              stroke: 0,
            },
          },
        },

        WrongEmailMessage: {
          x: 18,
          y: 185,
          w: 405,
          h: 30,
          text: {
            text: "Please enter a registered email address",
            fontSize: 20,
            fontFace: "Regular",
            textColor: COLORS.RED_ERROR,
          },
          visible: false,
        },

        PasswordContainer: {
          ref: "PasswordContainer",
          x: 15,
          y: 233,
          w: 450,
          h: 90,
          color: COLORS.BLACK,
          rect: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 10,
            stroke: 3,
            strokeColor: COLORS.GREY_LIGHT,
          },
          PasswordLabel: {
            ref: "PasswordLabel",
            x: 16,
            y: 25,
            w: 420,
            h: 45,
            text: {
              text: "Password",
              fontSize: 25,
              fontFace: "Regular",
              textColor: COLORS.WHITE,
            },
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 6,
              stroke: 0,
            },
          },
        },

        WrongPasswordMessage: {
          x: 18,
          y: 335,
          w: 191,
          h: 30,
          text: {
            text: "Wrong password",
            fontSize: 20,
            fontFace: "Regular",
            textColor: COLORS.RED_ERROR,
          },
          visible: false,
        },

        LoginButton: {
          ref: "LoginButton",
          type: Button,
          x: 15,
          y: 440,
          w: 450,
          h: 50,
          buttonText: "Sign In",
          fontSize: 30,
          textColor: COLORS.WHITE,
          backgroundColor: COLORS.RED_BUTTON,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 6,
          },
        },

        NoAccountMessage: {
          x: 15,
          y: 514,
          w: 461,
          h: 30,
          text: {
            text: "Don't have an account yet?",
            fontSize: 25,
            fontFace: "Regular",
            textColor: COLORS.WHITE,
            textAlign: "center",
          },
        },

        RegisterButton: {
          ref: "RegisterButton",
          type: Button,
          x: 140,
          y: 564,
          w: 200,
          h: 50,
          buttonText: "Sign Up",
          fontSize: 30,
          textColor: COLORS.WHITE,
          backgroundColor: COLORS.RED_BUTTON,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 6,
          },
        },
      },
      LandscapeKeyboard: {
        ref: "LandscapeKeyboard",
        type: LandscapeKeyboard,
        visible: false,
        signals: {
          onKeyPress: true,
          upFromKeyboard: true,
        },
      },

    };
  }

  get Container() {
    return this.getByRef("Container");
  }

  get EmailContainer() {
    return this.Container?.getByRef("EmailContainer");
  }

  get EmailLabel() {
    return this.EmailContainer?.getByRef("EmailLabel");
  }

  get WrongEmailMessage() {
    return this.Container?.getByRef("WrongEmailMessage");
  }

  get PasswordContainer() {
    return this.Container?.getByRef("PasswordContainer");
  }

  get PasswordLabel() {
    return this.PasswordContainer?.getByRef("PasswordLabel");
  }

  get WrongPasswordMessage() {
    return this.Container?.getByRef("WrongPasswordMessage");
  }

  get LoginButton() {
    return this.Container?.getByRef("LoginButton");
  }

  get RegisterButton() {
    return this.Container?.getByRef("RegisterButton");
  }

  get LandscapeKeyboard() {
    return this.getByRef("LandscapeKeyboard");
  }

  override _init() {
    this._setState("LoginButton");
  }

  errorEmailContainer() {
    this.EmailContainer?.patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 10,
        stroke: 3,
        strokeColor: COLORS.RED_ERROR,
      },
    });
  }

  errorPasswordContainer() {
    this.PasswordContainer?.patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 10,
        stroke: 3,
        strokeColor: COLORS.RED_ERROR,
      },
    });
  }

  onKeyPress(char: string) {
    let label;
    if (this._currentInputField === "Email") {
      label = this.EmailLabel;
    } else if (this._currentInputField === "Password") {
      label = this.PasswordLabel;
    }

    if (label) {
      let currentText = label.text?.text || "";
      if (currentText === "Email" || currentText === "Password") {
        currentText = "";
      }
      if (char === "BS") {
        currentText = currentText.slice(0, -1);
      } else if (char === "OK" && this._currentInputField === "Password") {
        if (this.LandscapeKeyboard) {
          this.LandscapeKeyboard.visible = false;
        }
        this._unfocusCurrentInput();
        this._setState("LoginButton");
      } else if (char === "OK" && this._currentInputField === "Email") {
        this._unfocusCurrentInput();
        this._setState("PasswordContainer");
      } else {
        currentText += char;
      }
      label.patch({ text: { text: currentText } });
    }
  }

  upFromKeyboard() {
    if (this._currentInputField === "Password") {
      this._unfocusCurrentInput();
      this._setState("EmailContainer");
    } else if (this._currentInputField === "Email") {
      this._unfocusCurrentInput();
      this._setState("LoginButton");
    }
  }

  private _unfocusCurrentInput() {
    if (this._currentInputField === "Email") {
      this.EmailContainer?.patch({
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 10,
          stroke: 3,
          strokeColor: COLORS.GREY_LIGHT,
        },
      });
    } else if (this._currentInputField === "Password") {
      this.PasswordContainer?.patch({
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 10,
          stroke: 3,
          strokeColor: COLORS.GREY_LIGHT,
        },
      });
    }
    if (this.LandscapeKeyboard) {
      this.LandscapeKeyboard.visible = false;
    }
    this._currentInputField = null;
  }

  static override _states() {
    return [
      class LoginButton extends this {
        override _getFocused() {
          return this.LoginButton;
        }
        override _handleUp() {
          this._setState("PasswordContainer");
        }
        override _handleDown() {
          this._setState("RegisterButton");
        }
        override _handleEnter() {
          const email = this.EmailLabel?.text?.text || "";
          const password = this.PasswordLabel?.text?.text || "";

          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", email));

          getDocs(q)
            .then((querySnapshot) => {
              if (querySnapshot.empty) {
                if (this.WrongEmailMessage) {
                  this.WrongEmailMessage.visible = true;
                  this.errorEmailContainer();
                }
                if (this.WrongPasswordMessage) {
                  this.WrongPasswordMessage.visible = false;
                }
              } else {
                signInWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    console.warn("User:", user);
                    const userId = user.uid;
                    user.getIdToken().then((accessToken) => {
                      localStorage.setItem("access_token", accessToken); // Save access token
                      localStorage.setItem("userId", userId); // Save userId
                
                      console.log("User ID set globally:", userId);
                      console.log("Access Token saved:", accessToken);
                      console.log("Successfully signed in!");
                
                      setGlobalUserId(userId);
                      if (this.EmailLabel) {
                        this.EmailLabel.patch({
                          text: { text: "Email" },
                        });
                      }
                      if (this.PasswordLabel) {
                        this.PasswordLabel.patch({
                          text: { text: "Password" },
                        });
                      }
                
                      if (this.WrongEmailMessage) {
                        this.WrongEmailMessage.visible = false;
                      }
                      if (this.WrongPasswordMessage) {
                        this.WrongPasswordMessage.visible = false;
                      }
                
                      Router.navigate("profileselection", { userId: userId });
                    }).catch((error) => {
                      console.error("Error fetching access token:", error);
                    });
                  })
                  .catch((error) => {
                    console.error("Error during login process:", error.message);

                    if (this.WrongEmailMessage)
                      this.WrongEmailMessage.visible = false;
                    if (this.WrongPasswordMessage)
                      this.WrongPasswordMessage.visible = false;

                    switch (error.code) {
                      case "auth/user-not-found":
                        console.log("User not found.");
                        if (this.WrongEmailMessage) {
                          this.WrongEmailMessage.visible = true;
                        }
                        this.errorEmailContainer();
                        break;

                      case "auth/wrong-password":
                      case "auth/invalid-credential":
                        console.log("Incorrect password.");
                        if (this.WrongPasswordMessage) {
                          this.WrongPasswordMessage.visible = true;
                        }
                        this.errorPasswordContainer();
                        break;

                      default:
                        console.log("Other error:", error.message);
                        break;
                    }
                  });
              }
            })
            .catch((error) => {
              console.error("Error during login process:", error);
            });
        }
      },
      class RegisterButton extends this {
        override _getFocused() {
          return this.RegisterButton;
        }
        override _handleUp() {
          this._setState("LoginButton");
        }
        override _handleEnter() {
          Router.navigate("signup");
        }
      },
      class PasswordContainer extends this {
        override _getFocused() {
          this._currentInputField = "Password";
          this.PasswordContainer?.patch({
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 6,
              stroke: 6,
              strokeColor: COLORS.GREEN_FOCUS,
            },
          });
          if (this.LandscapeKeyboard) {
            this.LandscapeKeyboard.visible = true;
          }
          return this.LandscapeKeyboard;
        }
        override _unfocus() {
          this._unfocusCurrentInput();
        }
        override _handleUp() {
          this._unfocus();
          this._setState("EmailContainer");
        }
        override _handleDown() {
          this._unfocus();
          this._setState("LoginButton");
        }
      },
      class EmailContainer extends this {
        override _getFocused() {
          this._currentInputField = "Email";
          this.EmailContainer?.patch({
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 6,
              stroke: 6,
              strokeColor: COLORS.GREEN_FOCUS,
            },
          });
          if (this.LandscapeKeyboard) {
            this.LandscapeKeyboard.visible = true;
          }
          return this.LandscapeKeyboard;
        }
        override _unfocus() {
          this._unfocusCurrentInput();
        }
        override _handleDown() {
          this._unfocus();
          this._setState("PasswordContainer");
        }
      },
    ];
  }
}