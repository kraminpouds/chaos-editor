import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScaleRulerComponent } from './scale-ruler.component';
import { drawLine, getCanvas2DContext } from './utility';

@Component({
  selector: 'chaos-editor-scale-ruler-wide',
  templateUrl: './scale-ruler.component.html',
  styleUrls: ['./scale-ruler-wide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleRulerWideComponent extends ScaleRulerComponent {
  protected _calcScaleRulerSize() {
    const rect = this._elementRef.nativeElement.getBoundingClientRect();
    this._scaleRulerService.horizontalRulerWidth = rect.width - 50;
    this._scaleRulerService.verticalRulerHeight = rect.height - 50;
  }

  protected _createHorizontalRuler(): void {
    if (!this.horizontalCanvasElementRef) {
      return;
    }
    const horizontalRuler = this.horizontalCanvasElementRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    const vesselLeft = 100 * dpr;
    const rulerWidth = this._scaleRulerService.horizontalRulerWidth * dpr;
    const rulerHeight = 50 * dpr;
    horizontalRuler.width = rulerWidth;
    horizontalRuler.height = rulerHeight;
    horizontalRuler.style.width = this._scaleRulerService.horizontalRulerWidth + 'px';
    horizontalRuler.style.height = '50px';
    const canvas = getCanvas2DContext(horizontalRuler);
    canvas.transform(dpr, 0, 0, dpr, this._scaleRulerService.offsetX, 0);
    canvas.fillStyle = '#f0f2f5';
    canvas.fillRect(-this._scaleRulerService.offsetX, 0, this._scaleRulerService.horizontalRulerWidth, 50);
    canvas.setTransform(dpr, 0, 0, dpr, vesselLeft, 0);
    canvas.lineWidth = 1;
    const handleDrawLine = (i: number) => {
      drawLine(canvas, { x: i * 10, y: 0 }, { x: i * 10, y: i % 10 == 0 ? 16 : 10 }, '#cccccc');
      if (i % 10 == 0) {
        canvas.font = 'normal 14px arial';
        canvas.fillStyle = '#888888';
        canvas.fillText(i * 10 + '', i * 10 - 4, 16 + 14 + 4);
      }
    };
    for (let i = 0; i < (rulerWidth - vesselLeft) / 10 / dpr; i++) {
      handleDrawLine(i);
    }
    for (let i = 0; i > -vesselLeft / 10 / dpr; i--) {
      handleDrawLine(i);
    }
  }

  protected _createVerticalRuler(): void {
    if (!this.verticalCanvasElementRef) {
      return;
    }
    const verticalRuler = this.verticalCanvasElementRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    const vesselTop = 100 * dpr;
    const rulerWidth = 50 * dpr;
    const rulerHeight = this._scaleRulerService.verticalRulerHeight * dpr;
    verticalRuler.width = rulerWidth;
    verticalRuler.height = rulerHeight;
    verticalRuler.style.width = '50px';
    verticalRuler.style.height = this._scaleRulerService.verticalRulerHeight + 'px';
    const canvas = getCanvas2DContext(verticalRuler);
    canvas.transform(dpr, 0, 0, dpr, 0, this._scaleRulerService.offsetY);
    canvas.fillStyle = '#f0f2f5';
    canvas.fillRect(0, -this._scaleRulerService.offsetY, 50, this._scaleRulerService.verticalRulerHeight);
    canvas.setTransform(dpr, 0, 0, dpr, 0, vesselTop);
    canvas.lineWidth = 1;
    const handleDrawLine = (i: number) => {
      drawLine(canvas, { x: 0, y: i * 10 }, { x: i % 10 == 0 ? 16 : 10, y: i * 10 }, '#cccccc');
      if (i % 10 == 0) {
        canvas.font = 'normal 14px arial';
        canvas.fillStyle = '#888888';
        canvas.fillText(i * 10 + '', 16 + 4, i * 10 + 4);
      }
    };
    for (let i = 0; i < (rulerHeight - vesselTop) / 10 / dpr; i++) {
      handleDrawLine(i);
    }
    for (let i = 0; i > -vesselTop / 10 / dpr; i--) {
      handleDrawLine(i);
    }
  }
}
