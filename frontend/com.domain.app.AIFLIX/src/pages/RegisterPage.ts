  import { Lightning, Router } from "@lightningjs/sdk";
  import { Button } from "src/components/Button";
  import { COLORS } from "static/constants/Colors";
  import { SCREEN_SIZES } from "static/constants/ScreenSizes";
  import { LandscapeKeyboard } from "src/components/LandscapeKeyboard";
  import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    serverTimestamp,
  } from "firebase/firestore";
  import { app, auth, db, registerUser, setGlobalUserId } from "../services/firebaseService";

  interface RegisterPageTemplateSpec extends Lightning.Component.TemplateSpec {
    Name: object;
    Container: {
      EmailContainer: {
        EmailLabel: object;
      };
      WrongEmailMessage: object;
      PasswordContainer1: {
        PasswordLabel1: object;
      };
      PasswordContainer2: {
        PasswordLabel2: object;
      };
      WeakPasswordMessage: object;
      DontMatchPasswordMessage: object;
      LoginButton: typeof Button;
      AccountAlreadyRegisteredMessage: object;
      RegisterButton: typeof Button;
    };
    LandscapeKeyboard: typeof LandscapeKeyboard;
  }

  export default class RegisterPage extends Lightning.Component<RegisterPageTemplateSpec> {
    private _currentInputField:
      | "Email"
      | "Password"
      | "Password1"
      | "Password2"
      | null = null;

    static override _template(): Lightning.Component.Template<RegisterPageTemplateSpec> {
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
            w: 300,
            h: 30,
            text: {
              text: "Invalid email address",
              fontSize: 20,
              fontFace: "Regular",
              textColor: COLORS.RED_ERROR,
            },
            visible: false,
          },

          PasswordContainer1: {
            ref: "PasswordContainer1",
            x: 15,
            y: 214,
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
            PasswordLabel1: {
              ref: "PasswordLabel1",
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

          PasswordContainer2: {
            ref: "PasswordContainer2",
            x: 15,
            y: 339,
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
            PasswordLabel2: {
              ref: "PasswordLabel2",
              x: 16,
              y: 25,
              w: 420,
              h: 45,
              text: {
                text: "Confirm Password",
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

          WeakPasswordMessage: {
            x: 18,
            y: 307,
            w: 300,
            h: 30,
            text: {
              text: "Please enter a strong password",
              fontSize: 20,
              fontFace: "Regular",
              textColor: COLORS.RED_ERROR,
            },
            visible: false,
          },

          DontMatchPasswordMessage: {
            x: 18,
            y: 429,
            w: 300,
            h: 30,
            text: {
              text: "Password does not match",
              fontSize: 20,
              fontFace: "Regular",
              textColor: COLORS.RED_ERROR,
            },
            visible: false,
          },

          RegisterButton: {
            ref: "RegisterButton",
            type: Button,
            x: 15,
            y: 474,
            w: 450,
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

          AccountAlreadyRegisteredMessage: {
            x: 15,
            y: 557,
            w: 461,
            h: 30,
            text: {
              text: "Already have an account? Sign in!",
              fontSize: 25,
              fontFace: "Regular",
              textColor: COLORS.WHITE,
              textAlign: "center",
            },
          },

          LoginButton: {
            ref: "LoginButton",
            type: Button,
            x: 140,
            y: 603,
            w: 200,
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

    get WeakPasswordMessage() {
      return this.Container?.getByRef("WeakPasswordMessage");
    }

    get PasswordContainer1() {
      return this.Container?.getByRef("PasswordContainer1");
    }

    get PasswordLabel1() {
      return this.PasswordContainer1?.getByRef("PasswordLabel1");
    }

    get PasswordContainer2() {
      return this.Container?.getByRef("PasswordContainer2");
    }

    get PasswordLabel2() {
      return this.PasswordContainer2?.getByRef("PasswordLabel2");
    }

    get DontMatchPasswordMessage() {
      return this.Container?.getByRef("DontMatchPasswordMessage");
    }

    get LoginButton() {
      return this.Container?.getByRef("LoginButton");
    }

    get AccountAlreadyRegisteredMessage() {
      return this.Container?.getByRef("AccountAlreadyRegisteredMessage");
    }

    get RegisterButton() {
      return this.Container?.getByRef("RegisterButton");
    }

    get LandscapeKeyboard() {
      return this.getByRef("LandscapeKeyboard");
    }

    override _init() {
      this._setState("RegisterButton");
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

    errorPasswordContainer1() {
      this.PasswordContainer1?.patch({
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 10,
          stroke: 3,
          strokeColor: COLORS.RED_ERROR,
        },
      });
    }

    errorPasswordContainer2() {
      this.PasswordContainer2?.patch({
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
      } else if (this._currentInputField === "Password1") {
        label = this.PasswordLabel1;
      } else if (this._currentInputField === "Password2") {
        label = this.PasswordLabel2;
      }

      if (label) {
        let currentText = label.text?.text || "";
        if (
          currentText === "Email" ||
          currentText === "Password" ||
          currentText === "Confirm Password"
        ) {
          currentText = "";
        }
        if (char === "BS") {
          currentText = currentText.slice(0, -1);
        } else if (char === "OK" && this._currentInputField === "Password2") {
          if (this.LandscapeKeyboard) {
            this.LandscapeKeyboard.visible = false;
          }
          this._unfocusCurrentInput();
          this._setState("RegisterButton");
        }else if ( char === "OK" && this._currentInputField === "Email") {
          this._unfocusCurrentInput();
          this._setState("PasswordContainer1");
        } else if (char === "OK" && this._currentInputField === "Password1") {
          this._unfocusCurrentInput();
          this._setState("PasswordContainer2");
        }  else {
          currentText += char;
        }
        label.patch({ text: { text: currentText } });
      }
    }

    upFromKeyboard() {
      if (this._currentInputField === "Password2") {
        this._unfocusCurrentInput();
        this._setState("PasswordContainer1");
      } else if (this._currentInputField === "Password1") {
        this._unfocusCurrentInput();
        this._setState("EmailContainer");
      } else if (this._currentInputField === "Email") {
        this._unfocusCurrentInput();
        this._setState("RegisterButton");
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
      } else if (this._currentInputField === "Password1") {
        this.PasswordContainer1?.patch({
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 10,
            stroke: 3,
            strokeColor: COLORS.GREY_LIGHT,
          },
        });
      } else if (this._currentInputField === "Password2") {
        this.PasswordContainer2?.patch({
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
            this._setState("PasswordContainer1");
          }
          override _handleEnter() {
            this._unfocus();
            this._setState("PasswordContainer1");
          }
        },
        class PasswordContainer1 extends this {
          override _getFocused() {
            this._currentInputField = "Password1";
            this.PasswordContainer1?.patch({
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
            this._setState("PasswordContainer2");
          }
        },
        class PasswordContainer2 extends this {
          override _getFocused() {
            this._currentInputField = "Password2";
            this.PasswordContainer2?.patch({
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
            this._setState("PasswordContainer1");
          }
          override _handleDown() {
            this._unfocus();
            this._setState("RegisterButton");
          }
        },
        class RegisterButton extends this {
          override _getFocused() {
            return this.RegisterButton;
          }
          override _handleUp() {
            this._setState("PasswordContainer2");
          }
          override _handleDown() {
            this._setState("LoginButton");
          }
          override _handleEnter() {
            const email = this.EmailLabel?.text?.text || "";
            const password1 = this.PasswordLabel1?.text?.text || "";
            const password2 = this.PasswordLabel2?.text?.text || "";

            console.log("Registering with:", { email, password1, password2 });

            if (this.WeakPasswordMessage)
              this.WeakPasswordMessage.visible = false;
            if (this.DontMatchPasswordMessage)
              this.DontMatchPasswordMessage.visible = false;
            if (this.AccountAlreadyRegisteredMessage)
              this.AccountAlreadyRegisteredMessage.visible = false;

            if (password1.length < 6) {
              if (this.WeakPasswordMessage) {
                this.WeakPasswordMessage.visible = true;
              }
              this.errorPasswordContainer1();
              return;
            }

            if (password1 !== password2) {
              if (this.DontMatchPasswordMessage) {
                this.DontMatchPasswordMessage.visible = true;
              }
              this.errorPasswordContainer2();
              return;
            }

            registerUser(email, password1)
              .then((result) => {
                if (result.success && result.user) {
                  const userId = result.user.uid;

                  console.log("Successfully registered!");
                  setGlobalUserId(userId);
                  localStorage.setItem("userId", userId);
                  console.log("User ID set globally:", userId);

                  if (this.EmailLabel) {
                    this.EmailLabel.patch({
                      text: { text: "Email" },
                    });
                  }
                  if (this.PasswordLabel1) {
                    this.PasswordLabel1.patch({
                      text: { text: "Password" },
                    });
                  }
                  if (this.PasswordLabel2) {
                    this.PasswordLabel2.patch({
                      text: { text: "Confirm Password" },
                    });
                  }
                  
                  Router.navigate("chooseprofileimage", { userId: userId });
                  // Router.navigate("profile", { userId: userId });
                } else if (result.error) {
                }
              })
              .catch((error) => {
                console.error(
                  "Unhandled promise rejection during registration:",
                  error
                );
              });
          }
        },
        class LoginButton extends this {
          override _getFocused() {
            return this.LoginButton;
          }
          override _handleUp() {
            this._setState("RegisterButton");
          }
          override _handleEnter() {
            Router.navigate("signin");
          }
        },
      ];
    }
  }