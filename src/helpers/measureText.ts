const DEFAULT_FONT = 'rubik';

const CANVAS = document.createElement('canvas');
const CTX = CANVAS.getContext('2d') as CanvasRenderingContext2D;

function measureText(text: string, fontSize: number, font = DEFAULT_FONT) {
  CTX.font = `${fontSize}px ${font}`;
  return CTX.measureText(text).width;
}

export { measureText };
