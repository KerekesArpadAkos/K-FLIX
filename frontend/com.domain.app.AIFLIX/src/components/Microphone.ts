import { Lightning, Utils } from "@lightningjs/sdk";
import eventBus from "./EventBus";
import { COLORS } from "../../static/constants/Colors";

interface MicrophoneTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: object;
  Icon: {
    w: number;
    h: number;
    src: string;
  };
  Label: object;
}

export class Microphone
  extends Lightning.Component<MicrophoneTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<MicrophoneTemplateSpec>
{
  private recognition: any;
  private recognizedText: string = "";

  static override _template(): Lightning.Component.Template<MicrophoneTemplateSpec> {
    return {
      x: 289,
      y: 783,
      w: 150,
      h: 150,
      zIndex: 2,
      Background: {
        rect: true,
        w: (w) => w,
        h: (h) => h,
        color: COLORS.GREY_DARK,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 20,
        },
      },
      Icon: {
        mount: 0.5,
        x: (w) => w / 2,
        y: (h) => h / 2,
        w: 100,
        h: 100,
        src: Utils.asset("images/microphoneSilent.png"),
      },
      Label: {
        mountX: 0.5,
        x: (w) => w / 2,
        y: (h) => h + 20,
        text: {
          text: "Listening...",
          fontSize: 40,
          textColor: COLORS.WHITE,
        },
        visible: false,
        zIndex: 3,
      },
    };
  }

  get Label() {
    return this.tag("Label");
  }
  get Microphone() {
    return this.tag("Icon") as Lightning.Component;
  }
  override _init() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = this.onResult.bind(this);
    this.recognition.onspeechend = this.onSpeechEnd.bind(this);
    this.recognition.onerror = this.onError.bind(this);
    this.recognition.onstart = this.onStart.bind(this);
  }

  override _handleUp() {
    eventBus.emit("focusDefaultKeyboard");
  }
  override _handleEnter() {
    if (this.recognition) {
      if (this.Label) {
        this.Label.visible = true;
      }
      this.recognition.start();
      console.log("Listening...");
    }
  }

  private onStart() {
    console.log("Speech recognition started.");
  }

  private onResult(event: any) {
    const transcript = event.results[0][0].transcript;
    console.log("Recognized text:", transcript);
    this.recognizedText = transcript;
    eventBus.emit("recognizedText", this.recognizedText);
  }

  private onSpeechEnd() {
    if (this.recognition) {
      if (this.Label) {
        this.Label.visible = false;
      }
      this.recognition.stop();
      console.log("Speech recognition ended.");
    }
  }

  private onError(event: any) {
    console.error("Speech recognition error:", event.error);
  }

  override _getFocused() {
    return this;
  }
  override _focus() {
    const background = this.tag("Background");
    if (background) {
      background.color = COLORS.GREEN_FOCUS;
    }
  }

  override _unfocus() {
    const background = this.tag("Background");
    if (background) {
      background.color = COLORS.GREY_DARK;
    }
  }
}
