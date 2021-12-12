import { ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { PlatformService } from '../../platform.service';
import { ScaleRulerService } from './scale-ruler.service';
import { drawLine, getCanvas2DContext } from './utility';

@Component({
  selector: 'chaos-editor-scale-ruler',
  templateUrl: './scale-ruler.component.html',
  styleUrls: ['./scale-ruler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleRulerComponent implements OnInit, OnDestroy {
  @ViewChild('horizontal', { static: true }) horizontalElementRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('vertical', { static: true }) verticalElementRef!: ElementRef<HTMLCanvasElement>;

  protected _rulerSize = 16;

  private readonly _destroyed = new Subject<void>();

  constructor(
    protected _scaleRulerService: ScaleRulerService,
    protected _platform: PlatformService,
    protected _viewportRuler: ViewportRuler
  ) {}

  ngOnInit(): void {
    this._scaleRulerService.setRulerSize(this._rulerSize);
    if (this._platform.isBrowser) {
      this._scaleRulerService.changed.pipe(takeUntil(this._destroyed), auditTime(10)).subscribe(() => {
        this._createHorizontalRuler();
        this._createVerticalRuler();
        // 辅助线
      });
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  protected _createHorizontalRuler(): void {
    const window = this._platform.getWindow();
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
    canvas.fillStyle = '#f9fafb';
    canvas.fillRect(-vesselLeft, 0, rulerWidth, rulerHeight);
    canvas.setTransform(dpr, 0, 0, dpr, vesselLeftDpr, 0);
    canvas.lineWidth = 1;
    const handleDrawLine = (i: number) => {
      drawLine(canvas, { x: i * 10, y: i % 10 == 0 ? 0 : 10 }, { x: i * 10, y: 16 }, '#cccccc');
      if (i % 10 == 0) {
        canvas.font = 'normal 12px arial';
        canvas.fillStyle = '#888888';
        canvas.fillText(i * 10 + '', i * 10 + 4, 10);
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
    const window = this._platform.getWindow();
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
    canvas.fillStyle = '#f9fafb';
    canvas.fillRect(0, -vesselTop, rulerWidth, rulerHeight);
    canvas.setTransform(dpr, 0, 0, dpr, 0, vesselTopDpr);
    canvas.lineWidth = 1;
    const handleDrawLine = (i: number) => {
      drawLine(canvas, { x: i % 10 == 0 ? 0 : 10, y: i * 10 }, { x: 16, y: i * 10 }, '#cccccc');
      if (i % 10 == 0) {
        canvas.save();
        canvas.translate(16, i * 10);
        canvas.rotate((90 * Math.PI) / 180);
        canvas.font = 'normal 12px arial';
        canvas.fillStyle = '#888888';
        canvas.fillText(i * 10 + '', 4, 14);
        canvas.restore();
      }
    };
    for (let i = 0; i < (rulerHeightDpr - vesselTopDpr) / 10 / dpr; i++) {
      handleDrawLine(i);
    }
    for (let i = 0; i > -vesselTopDpr / 10 / dpr; i--) {
      handleDrawLine(i);
    }
  }

  addHorizontalLine(): void {}

  addVerticalLine(): void {}
}
