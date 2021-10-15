import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PlatformService } from '../../platform.service';
import { ScaleRuler } from './entites/ruler';
import { ScaleRulerService } from './scale-ruler.service';
import { drawLine, getCanvas2DContext } from './utility';

@Component({
  selector: 'chaos-editor-scale-ruler-wide',
  templateUrl: './scale-ruler.component.html',
  styleUrls: ['./scale-ruler-wide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleRulerWideComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('horizontalCanvas', { static: true }) horizontalCanvasElementRef?: ElementRef;
  @ViewChild('verticalCanvas', { static: true }) verticalCanvasElementRef?: ElementRef;

  private _destroy$ = new Subject<void>();

  private get scaleRuler(): ScaleRuler {
    return this._scaleRulerService.scaleRuler;
  }

  constructor(private _elementRef: ElementRef, private _scaleRulerService: ScaleRulerService, private _platform: PlatformService) {}

  ngOnInit(): void {
    if (this._platform.isServer) {
      return;
    }
    this._calcScaleRulerSize();
  }

  private _calcScaleRulerSize() {
    const rect = this._elementRef.nativeElement.getBoundingClientRect();
    this.scaleRuler.horizontalRulerWidth = rect.width - 50;
    this.scaleRuler.verticalRulerHeight = rect.height - 50;
  }

  ngAfterViewInit(): void {
    if (this._platform.isServer) {
      return;
    }
    setTimeout(() => {
      this._createHorizontalRuler();
      this._createVerticalRuler();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _createHorizontalRuler(): void {
    if (!this.horizontalCanvasElementRef) {
      // todo should throw error
      return;
    }
    const horizontalRuler = this.horizontalCanvasElementRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    const vesselLeft = 100 * dpr;
    const rulerWidth = this.scaleRuler.horizontalRulerWidth * dpr;
    const rulerHeight = 50 * dpr;
    horizontalRuler.width = rulerWidth;
    horizontalRuler.height = rulerHeight;
    horizontalRuler.style.width = this.scaleRuler.horizontalRulerWidth + 'px';
    horizontalRuler.style.height = '50px';
    const canvas = getCanvas2DContext(horizontalRuler);
    canvas.transform(dpr, 0, 0, dpr, 0, 0);
    canvas.fillStyle = '#f0f2f5';
    canvas.fillRect(-0, 0, this.scaleRuler.horizontalRulerWidth, 50);
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

  private _createVerticalRuler(): void {
    if (!this.verticalCanvasElementRef) {
      // todo should throw error
      return;
    }
    const verticalRuler = this.verticalCanvasElementRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    const vesselTop = 100 * dpr;
    const rulerWidth = 50 * dpr;
    const rulerHeight = this.scaleRuler.verticalRulerHeight * dpr;
    verticalRuler.width = rulerWidth;
    verticalRuler.height = rulerHeight;
    verticalRuler.style.width = '50px';
    verticalRuler.style.height = this.scaleRuler.verticalRulerHeight + 'px';
    const canvas = getCanvas2DContext(verticalRuler);
    canvas.transform(dpr, 0, 0, dpr, 0, 0);
    canvas.fillStyle = '#f0f2f5';
    canvas.fillRect(0, -0, 50, this.scaleRuler.verticalRulerHeight);
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

  addHorizontalLine(): void {}

  addVerticalLine(): void {}
}
