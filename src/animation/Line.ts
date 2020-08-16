import Animation, { AnimationOptions, Show } from './Animation';
import ControllerInterface from '../ControllerInterface';

export type LinePayload = number;

export type LineOptions = AnimationOptions<{}>;

class Line extends Animation<LinePayload, LineOptions> {
  private readonly resetColsPerFrame: number;
  private currentLength: number;
  private targetLength: number;

  constructor(controller: ControllerInterface) {
    super(controller);

    this.resetFrames = controller.cols;
    this.resetColsPerFrame = controller.panels;
    this.currentLength = 0;
    this.targetLength = 0;
  }

  show: Show<LinePayload, LineOptions> = (length, { backgroundColor, foregroundColor } = {}) => {
    this.applyColors(backgroundColor, foregroundColor);
    this.targetLength = Math.max(0, Math.min(this.controller.cols * this.controller.panels, length));
  };

  nextFrame = () => {
    if (this.resetFrames > 0) {
      this.resetFrame();

      return this.nextFrame;
    } else if (this.targetLength !== this.currentLength) {
      this.setFrame();

      return this.nextFrame;
    }
  };

  resetFrame = () => {
    for (let y = 0; y < this.controller.rows; y++) {
      for (let i = 0; i < this.resetColsPerFrame; i++) {
        const x = this.resetFrames * this.resetColsPerFrame - i - 1;
        this.controller.setPixel(y, x, this.backgroundColor);
      }
    }
    this.resetFrames--;
  };

  setFrame = () => {
    if (this.currentLength < this.targetLength) {
      for (let y = 0; y < this.controller.rows; y++) {
        this.controller.setPixel(y, this.currentLength, this.foregroundColor);
      }
      this.currentLength++;
    } else {
      for (let y = 0; y < this.controller.rows; y++) {
        this.controller.setPixel(y, this.currentLength, this.backgroundColor);
      }
      this.currentLength--;
    }
  };
}

export default Line;
