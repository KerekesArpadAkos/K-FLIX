import { Lightning, VideoPlayer } from "@lightningjs/sdk";

export class Player extends Lightning.Component {
  private _videoURL = "";

  override _firstActive() {
    VideoPlayer.consumer(this);
  }

  get videoURL(): string {
    return this._videoURL;
  }

  set videoURL(url: string) {
    this._videoURL = url;
    VideoPlayer.open(url);
  }

  setPosition(x: number, y: number) {
    VideoPlayer.position(x, y);
  }

  setSize(w: number, h: number) {
    VideoPlayer.size(w, h);
  }

  initializePlayback(url: string) {
    this._videoURL = url;

    if (this._videoURL) {
      VideoPlayer.open(this._videoURL);
    }
  }

  reload() {
    VideoPlayer.reload();
  }

  close() {
    VideoPlayer.close();
  }

  clear() {
    VideoPlayer.clear();
  }

  pause() {
    VideoPlayer.pause();
  }

  play() {
    VideoPlayer.play();
  }

  playPause() {
    VideoPlayer.playPause();
  }

  mute(optionalBool?: boolean) {
    if (optionalBool === undefined) {
      VideoPlayer.mute();
    } else {
      VideoPlayer.mute(optionalBool);
    }
  }

  seek(seconds: number) {
    VideoPlayer.seek(seconds);
  }


  skip(seconds: number) {
    VideoPlayer.skip(seconds);
  }

  show() {
    VideoPlayer.show();
  }

  hide() {
    VideoPlayer.hide();
  }

  getDuration() {
    return VideoPlayer.duration;
  }

  getCurrentTime() {
    return VideoPlayer.currentTime;
  }

  isPlaying() {
    return VideoPlayer.playing;
  }
}
