export type Color = [number, number, number];

export type SetPixel = (row: number, col: number, rgb: Color) => void;

type ControllerInterface = {
  readonly panels: number;
  readonly cols: number;
  readonly rows: number;

  setPixel: SetPixel;
};

export default ControllerInterface;
