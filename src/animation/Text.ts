import chars from './text/chars';
import Animation, { AnimationOptions, Show } from './Animation';
import ControllerInterface from '../ControllerInterface';

export type TextPayload = string;

export type TextOptions = AnimationOptions<{
  offset?: [number, number];
}>;

class Text extends Animation<TextPayload, TextOptions> {
  private offset: number[];
  private text: number[][] = [[]];

  constructor(controller: ControllerInterface) {
    super(controller);

    this.setFramesDefault = controller.rows;
    // offset is in x, y format
    this.offset = [0, 0];
  }

  show: Show<TextPayload, TextOptions> = (text, { backgroundColor, foregroundColor, offset = [0, 0] } = {}) => {
    if (backgroundColor !== undefined) {
      this.backgroundColor = backgroundColor;
    }
    if (foregroundColor !== undefined) {
      this.foregroundColor = foregroundColor;
    }
    this.setFrames = this.setFramesDefault;
    if (offset && offset.length === 2) {
      this.offset = this.offset.map((_, index) => offset[index] | 0);
    }
    this.text = this.convertText(`${text}`);
  };

  nextFrame = () => {
    const {
      backgroundColor,
      foregroundColor,
      nextFrame,
      text,
      setFrames,
      controller: { rows, setPixel },
    } = this;
    if (setFrames > 0) {
      const row = rows - setFrames;
      text[row].forEach((pixel, col) => {
        setPixel(row, col, pixel === 1 ? foregroundColor : backgroundColor);
      });
      this.setFrames--;
      return nextFrame;
    }
  };

  blank = () =>
    ' '
      .repeat(this.controller.rows)
      .split('')
      .map(() =>
        ' '
          .repeat(this.controller.cols * this.controller.panels)
          .split('')
          .map(() => 0),
      );

  convertText = (text: string) => {
    const lines = this.blank();
    text
      .toLowerCase()
      .split('')
      .forEach((char, index) => {
        const charRows = this.charToRows(char);

        if (charRows !== null) {
          const colStart = index * 4 + this.offset[0];
          const rowStart = this.offset[1];
          charRows.forEach((binArray, row) =>
            binArray.forEach((bin, col) => bin === 1 && this.activatePixel(lines, rowStart + row, colStart + col)),
          );
        }
      });
    return lines;
  };

  activatePixel = (lines: number[][], y: number, x: number) => {
    const { rows, cols, panels } = this.controller;
    if (y >= 0 && y < rows && x >= 0 && x < cols * panels) {
      lines[y][x] = 1;
    }
  };

  charToRows = (char: string) => {
    if (chars.hasOwnProperty(char)) {
      return chars[char].map((bin) => this.binToRow(bin));
    }
    return null;
  };

  binToRow = (bin: number) => [(bin & 7) >> 2, (bin & 3) >> 1, bin & 1];
}

export default Text;
