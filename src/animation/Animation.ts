import ControllerInterface, { Color } from '../ControllerInterface';

export type NextFrame = () => NextFrame | void;

export type AnimationOptions<O> = O & {
  backgroundColor?: Color;
  foregroundColor?: Color;
};

export type Show<P, O> = (value: P, options?: AnimationOptions<O>) => void;

export type AnimationInterface<P, O> = {
  show: Show<P, O>;
  nextFrame: NextFrame;
};

abstract class Animation<P, O> implements AnimationInterface<P, O> {
  protected controller: ControllerInterface;
  protected backgroundColor: [number, number, number] = [0, 0, 0];
  protected foregroundColor: [number, number, number] = [255, 255, 255];
  protected resetFrames: number;
  protected setFramesDefault: number;
  protected setFrames: number;
  protected resetFramesDefault: number;

  protected constructor(controller: ControllerInterface) {
    this.controller = controller;

    // frames left for reset animation
    this.resetFramesDefault = this.controller.rows;
    this.resetFrames = this.resetFramesDefault;

    // frames left for set animation
    this.setFramesDefault = this.controller.rows;
    this.setFrames = this.setFramesDefault;
  }

  nextFrame: NextFrame = () => {};
  show: Show<P, O> = () => {};
}

export default Animation;
