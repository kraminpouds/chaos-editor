export function getCanvas2DContext(element: HTMLCanvasElement): CanvasRenderingContext2D {
  const canvas = element.getContext('2d');
  if (canvas) {
    return canvas;
  }
  throw new Error('error on canvas get2DContext');
}

export function drawLine(context: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }, color: string): void {
  context.beginPath();
  context.strokeStyle = color;
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}
