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
  protected _rulerSize = 50;

  protected _createHorizontalRuler(): void {
    const horizontalRuler = this.horizontalElementRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    const vesselLeft = this._scaleRulerService.getCanvasPoint().left;
    const vesselLeftDpr = vesselLeft * dpr;
    const rulerWidth = this._scaleRulerService.horizontalRulerWidth;
    const rulerWidthDpr = rulerWidth * dpr;
    const rulerHeight = this._scaleRulerService.vesselRulerSize;
    const rulerHeightDpr = rulerHeight * dpr;
    horizontalRuler.width = rulerWidthDpr;
    horizontalRuler.height = rulerHeightDpr;
    horizontalRuler.style.width = rulerWidth + 'px';
    horizontalRuler.style.height = rulerHeight + 'px';
    const canvas = getCanvas2DContext(horizontalRuler);
    canvas.transform(dpr, 0, 0, dpr, vesselLeftDpr, 0);
    canvas.fillStyle = '#f0f2f5';
    canvas.fillRect(-vesselLeft, 0, rulerWidth, rulerHeight);
    canvas.setTransform(dpr, 0, 0, dpr, vesselLeftDpr, 0);
    canvas.lineWidth = 1;
    const handleDrawLine = (i: number) => {
      drawLine(canvas, { x: i * 10, y: 0 }, { x: i * 10, y: i % 10 == 0 ? 16 : 10 }, '#cccccc');
      if (i % 10 == 0) {
        canvas.font = 'normal 14px arial';
        canvas.fillStyle = '#888888';
        canvas.fillText(i * 10 + '', i * 10 - 4, 16 + 14 + 4);
      }
    };
    for (let i = 0; i < (rulerWidthDpr - vesselLeftDpr) / 10 / dpr; i++) {
      handleDrawLine(i);
    }
    for (let i = 0; i > -vesselLeftDpr / 10 / dpr; i--) {
      handleDrawLine(i);
    }
  }

  protected _createVerticalRuler(): void {
    const verticalRuler = this.verticalElementRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    const vesselTop = this._scaleRulerService.getCanvasPoint().top;
    const vesselTopDpr = vesselTop * dpr;
    const rulerWidth = this._scaleRulerService.vesselRulerSize;
    const rulerWidthDpr = rulerWidth * dpr;
    const rulerHeight = this._scaleRulerService.verticalRulerHeight;
    const rulerHeightDpr = rulerHeight * dpr;
    verticalRuler.width = rulerWidthDpr;
    verticalRuler.height = rulerHeightDpr;
    verticalRuler.style.width = rulerWidth + 'px';
    verticalRuler.style.height = rulerHeight + 'px';
    const canvas = getCanvas2DContext(verticalRuler);
    canvas.transform(dpr, 0, 0, dpr, 0, vesselTopDpr);
    canvas.fillStyle = '#f0f2f5';
    canvas.fillRect(0, -vesselTop, rulerWidth, rulerHeight);
    canvas.setTransform(dpr, 0, 0, dpr, 0, vesselTopDpr);
    canvas.lineWidth = 1;
    const handleDrawLine = (i: number) => {
      drawLine(canvas, { x: 0, y: i * 10 }, { x: i % 10 == 0 ? 16 : 10, y: i * 10 }, '#cccccc');
      if (i % 10 == 0) {
        canvas.font = 'normal 14px arial';
        canvas.fillStyle = '#888888';
        canvas.fillText(i * 10 + '', 16 + 4, i * 10 + 4);
      }
    };
    for (let i = 0; i < (rulerHeightDpr - vesselTopDpr) / 10 / dpr; i++) {
      handleDrawLine(i);
    }
    for (let i = 0; i > -vesselTopDpr / 10 / dpr; i--) {
      handleDrawLine(i);
    }
  }
}
