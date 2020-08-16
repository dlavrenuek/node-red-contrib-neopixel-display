import Animation, { AnimationOptions, Show } from './Animation';
import ControllerInterface from '../ControllerInterface';

export type BarsPayload = number[];

export type BarsOptions = AnimationOptions<{}>;

class Bars extends Animation<BarsPayload, BarsOptions> {
  private targetValues: number[];
  private readonly currentValues: number[];

  constructor(controller: ControllerInterface) {
    super(controller);

    this.targetValues = '-'
      .repeat(controller.panels * controller.cols)
      .split('')
      .map((_) => 0);
    this.currentValues = [...this.targetValues];
  }

  show: Show<BarsPayload, BarsOptions> = (values, { backgroundColor, foregroundColor } = {}) => {
    this.applyColors(backgroundColor, foregroundColor);
    this.setFrames = this.setFramesDefault;
    this.targetValues = this.targetValues.map((value, index) => (values.length > index ? values[index] : 0));
  };

  nextFrame = () => {
    switch (true) {
      case this.resetFrames > 0:
        this.resetFrame();
        return this.nextFrame;
      case this.setFrames > 0:
        this.setFrame();
        return this.nextFrame;
      default:
        return;
    }
  };

  resetFrame = () => {
    for (let x = 0; x < this.controller.cols * this.controller.panels; x++) {
      this.controller.setPixel(this.controller.rows - this.resetFrames, x, this.backgroundColor);
    }
    this.resetFrames--;
  };

  setFrame = () => {
    this.targetValues.forEach((value, x) => {
      const intValue = Math.floor(value);
      const stepValue = Math.ceil(this.controller.rows / this.setFramesDefault);
      if (intValue > this.currentValues[x]) {
        const change = Math.min(stepValue, intValue - this.currentValues[x]);

        for (let dy = 0; dy < change; dy++) {
          this.controller.setPixel(this.controller.rows - 1 - this.currentValues[x] - dy, x, this.foregroundColor);
        }
        this.currentValues[x] += change;
      } else if (intValue < this.currentValues[x]) {
        const change = Math.max(-stepValue, intValue - this.currentValues[x]);

        for (let dy = 0; dy > change; dy--) {
          this.controller.setPixel(this.controller.rows - 1 - this.currentValues[x] + dy, x, this.backgroundColor);
        }
        this.currentValues[x] += change;
      }
    });
    this.setFrames--;
  };
}

export default Bars;
