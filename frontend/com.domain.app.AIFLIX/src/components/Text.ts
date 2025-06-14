import { Lightning } from "@lightningjs/sdk";

interface TextTemplateSpec extends Lightning.Component.TemplateSpec {
  Text: object;
  props: { key: string };
}

export class Text
  extends Lightning.Component<TextTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<TextTemplateSpec>
{
  static override _template(): Lightning.Component.Template<TextTemplateSpec> {
    return {
      Text: {},
    };
  }

  set props(props: { key: string }) {
    const { key } = props;
    this.Text.patch({
      text: { text: key, fontFace: "NetflixSans-Light"},
    });
  }

  get Text() {
    return this.getByRef("Text")!;
  }
}
