import Bars from './animation/Bars';
import Line from './animation/Line';
import Text from './animation/Text';
import ControllerInterface, { Color, SetPixel } from './ControllerInterface';
import { AnimationInterface, NextFrame } from './animation/Animation';

export type OutgoingMessage = {
  payload: string;
};

export type GenericIncomingMessage<T, P, O> = {
  visualizationType: T;
  payload?: P;
  backgroundColor?: Color;
  foregroundColor?: Color;
} & O;

type Node = {
  send: (msg: OutgoingMessage) => unknown;
};

export type Animations = Bars | Line | Text;
export type AnimationTypes = 'bars' | 'line' | 'text';

const types = {
  bars: Bars,
  line: Line,
  text: Text,
};

const MAX_PIXELS_PER_TICK = 16;
const TICK_TIME = 20;

type Config = {
  panels: string;
  cols: string;
  rows: string;
  fps: string;
  visualizationType: 'bars' | 'line' | 'text';
  backgroundColor: string;
  foregroundColor: string;
};

class Controller implements ControllerInterface {
  public readonly panels: number;
  public readonly cols: number;
  public readonly rows: number;
  private node: Node;
  private readonly fps: number;
  private readonly animationTimeout: number;
  private currentType: AnimationTypes | null;
  private current: Animations | null;
  private to: number;
  private qto: number;
  private queue: OutgoingMessage[];
  private visualizationType: AnimationTypes;
  private backgroundColor: number[];
  private foregroundColor: number[];

  constructor(
    node: Node,
    {
      panels,
      cols,
      rows,
      fps,
      backgroundColor,
      foregroundColor,
      visualizationType,
    }: Config,
  ) {
    this.node = node;
    this.panels = parseInt(panels) || 1;
    this.cols = parseInt(cols) || 8;
    this.rows = parseInt(rows) || 8;
    this.fps = parseInt(fps) || 5;
    this.visualizationType = visualizationType;
    this.backgroundColor = this.parseColor(backgroundColor);
    this.foregroundColor = this.parseColor(foregroundColor);
    this.animationTimeout = Math.floor(1000 / this.fps);
    this.currentType = null;
    this.current = null;
    this.to = 0;
    this.qto = 0;
    this.queue = [];
  }

  handleInput = <T extends AnimationTypes, P, O>({
    visualizationType,
    payload,
    backgroundColor,
    foregroundColor,
    ...options
  }: GenericIncomingMessage<T, P, O>): void => {
    const type = visualizationType || this.visualizationType;
    if (type && types[type]) {
      if (this.currentType !== type) {
        this.currentType = type;
        this.current = new types[type](this);
      }
      clearTimeout(this.to);
      if (payload && this.current !== null) {
        const animationOptions = ({
          backgroundColor: backgroundColor || this.backgroundColor || undefined,
          foregroundColor: foregroundColor || this.foregroundColor || undefined,
          ...options,
        } as unknown) as O;

        this.queue = [];
        ((this.current as unknown) as AnimationInterface<P, O>).show(
          payload,
          animationOptions,
        );
        this.animate();
      }
    }
  };

  animate = (): void => {
    const runNextFrame = (currentAnimation: NextFrame) => {
      try {
        const nextFrame = currentAnimation();
        if (nextFrame) {
          this.to = (setTimeout(
            runNextFrame,
            this.animationTimeout,
            nextFrame,
          ) as unknown) as number;
        }
      } catch (e) {
        console.log('An error occurred during execution', e);
      }
    };

    if (this.current !== null) {
      runNextFrame(this.current.nextFrame);
    }
  };

  convertCoordinates = (row: number, col: number): number => {
    const panel = Math.floor(col / this.cols);
    const panel_col = col % this.cols;
    return panel * this.cols * this.rows + row * this.cols + panel_col;
  };

  setPixel: SetPixel = (row, col, rgb): void => {
    if (
      row >= 0 &&
      row < this.rows &&
      col >= 0 &&
      col < this.cols * this.panels
    ) {
      const payload = [this.convertCoordinates(row, col), ...rgb].join(',');
      this.queue.push({
        payload,
      });
      this.runQueue();
    }
  };

  runQueue = (): void => {
    clearTimeout(this.qto);
    this.queue
      .splice(0, MAX_PIXELS_PER_TICK)
      .forEach((msg) => this.node.send(msg));

    if (this.queue.length > 0) {
      this.qto = (setTimeout(this.runQueue, TICK_TIME) as unknown) as number;
    }
  };

  parseColor = (color: string): number[] =>
    color.split(',').map((value) => parseInt(value.trim()));
}

export default Controller;
