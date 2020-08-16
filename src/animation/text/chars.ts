/*
Each char is represented by an array of binary encoded rows.

Example for a:

 x  = 010 = 2
x x = 101 = 5
xxx = 111 = 7
x x = 101 = 5
x x = 101 = 5

*/

export type EncodedCharacter = [number, number, number, number, number];

const chars: Record<string, EncodedCharacter> = {
  a: [2, 5, 7, 5, 5],
  b: [6, 5, 6, 5, 6],
  c: [2, 5, 4, 5, 2],
  d: [6, 5, 5, 5, 6],
  e: [7, 4, 6, 4, 7],
  f: [7, 4, 6, 4, 4],
  g: [3, 5, 3, 1, 6],
  h: [5, 5, 7, 5, 5],
  i: [2, 2, 2, 2, 2],
  j: [3, 1, 1, 5, 2],
  k: [5, 5, 6, 5, 5],
  l: [4, 4, 4, 4, 7],
  m: [5, 7, 5, 5, 5],
  n: [1, 5, 7, 5, 4],
  o: [2, 5, 5, 5, 2],
  p: [6, 5, 6, 4, 4],
  q: [3, 5, 3, 1, 1],
  r: [6, 5, 6, 5, 5],
  s: [3, 4, 2, 1, 6],
  t: [7, 2, 2, 2, 2],
  u: [5, 5, 5, 5, 7],
  v: [5, 5, 5, 5, 2],
  w: [5, 5, 5, 7, 5],
  x: [5, 5, 2, 5, 5],
  y: [5, 5, 2, 2, 2],
  z: [7, 1, 2, 4, 7],
};

export default chars;
