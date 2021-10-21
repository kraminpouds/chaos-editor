import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { PlatformService } from '../../platform.service';
import { OffsetChangedEvent } from './scale-ruler';
import { ScaleRulerService } from './scale-ruler.service';
import { drawLine, getCanvas2DContext } from './utility';

@Component({
  selector: 'chaos-editor-scale-ruler',
  templateUrl: './scale-ruler.component.html',
  styleUrls: ['./scale-ruler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleRulerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('horizontalCanvas', { static: true }) horizontalCanvasElementRef?: ElementRef;
  @ViewChild('verticalCanvas', { static: true }) verticalCanvasElementRef?: ElementRef;

  private _initialize$ = new Subject<void>();
  private readonly _destroyed = new Subject<void>();

  private _vesselLeft = 50;
  private _vesselTop = 50;

  constructor(
    protected _elementRef: ElementRef,
    protected _scaleRulerService: ScaleRulerService,
    private _platform: PlatformService,
    private _viewportRuler: ViewportRuler
  ) {}

  ngOnInit(): void {
    if (this._platform.isServer) {
      return;
    }
    this._bindEvents();
  }

  ngAfterViewInit(): void {
    if (this._platform.isServer) {
      return;
    }
    setTimeout(() => this._initialize$.next());
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  protected _calcScaleRulerSize() {
    const rect = this._elementRef.nativeElement.getBoundingClientRect();
    this._scaleRulerService.horizontalRulerWidth = rect.width - 16;
    this._scaleRulerService.verticalRulerHeight = rect.height - 16;
  }

  protected _createHorizontalRuler(event?: OffsetChangedEvent): void {
    if (!this.horizontalCanvasElementRef) {
      return;
    }
    const horizontalRuler = this.horizontalCanvasElementRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    // todo 需要用明确值，delta值只做测试临时使用，且delta值会因为debounceTime而错误
    this._vesselLeft -= -(event?.deltaX ?? 0);
    const vesselLeft = this._vesselLeft * dpr;
    const rulerWidth = this._scaleRulerService.horizontalRulerWidth * dpr;
    const rulerHeight = 16 * dpr;
    horizontalRuler.width = rulerWidth;
    horizontalRuler.height = rulerHeight;
    horizontalRuler.style.width = this._scaleRulerService.horizontalRulerWidth + 'px';
    horizontalRuler.style.height = '16px';
    const canvas = getCanvas2DContext(horizontalRuler);
    canvas.transform(dpr, 0, 0, dpr, this._scaleRulerService.offsetX * dpr, 0);
    canvas.fillStyle = '#f9fafb';
    canvas.fillRect(-this._scaleRulerService.offsetX, 0, this._scaleRulerService.horizontalRulerWidth, 16);
    canvas.setTransform(dpr, 0, 0, dpr, vesselLeft, 0);
    canvas.lineWidth = 1;
    const handleDrawLine = (i: number) => {
      drawLine(canvas, { x: i * 10, y: i % 10 == 0 ? 0 : 10 }, { x: i * 10, y: 16 }, '#cccccc');
      if (i % 10 == 0) {
        canvas.font = 'normal 12px arial';
        canvas.fillStyle = '#888888';
        canvas.fillText(i * 10 + '', i * 10 + 4, 10);
      }
    };
    for (let i = 0; i < (rulerWidth - vesselLeft) / 10 / dpr; i++) {
      handleDrawLine(i);
    }
    for (let i = 0; i > -vesselLeft / 10 / dpr; i--) {
      handleDrawLine(i);
    }
  }

  protected _createVerticalRuler(event?: OffsetChangedEvent): void {
    if (!this.verticalCanvasElementRef) {
      return;
    }
    const verticalRuler = this.verticalCanvasElementRef.nativeElement as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    // todo 需要用明确值，delta值只做测试临时使用，且delta值会因为debounceTime而错误
    this._vesselTop -= event?.deltaY ?? 0;
    const vesselTop = this._vesselTop * dpr;
    const rulerWidth = 16 * dpr;
    const rulerHeight = this._scaleRulerService.verticalRulerHeight * dpr;
    verticalRuler.width = rulerWidth;
    verticalRuler.height = rulerHeight;
    verticalRuler.style.width = '16px';
    verticalRuler.style.height = this._scaleRulerService.verticalRulerHeight + 'px';
    const canvas = getCanvas2DContext(verticalRuler);
    canvas.transform(dpr, 0, 0, dpr, 0, this._scaleRulerService.offsetY * dpr);
    canvas.fillStyle = '#f9fafb';
    canvas.fillRect(0, -this._scaleRulerService.offsetY, 16, this._scaleRulerService.verticalRulerHeight);
    canvas.setTransform(dpr, 0, 0, dpr, 0, vesselTop);
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
    for (let i = 0; i < (rulerHeight - vesselTop) / 10 / dpr; i++) {
      handleDrawLine(i);
    }
    for (let i = 0; i > -vesselTop / 10 / dpr; i--) {
      handleDrawLine(i);
    }
  }

  private _bindEvents() {
    merge(this._initialize$.pipe(take(1)), this._viewportRuler.change(150))
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._calcScaleRulerSize();
        this._createHorizontalRuler();
        this._createVerticalRuler();
        // 辅助线
      });

    this._scaleRulerService.offsetChanged.pipe(takeUntil(this._destroyed)).subscribe(event => {
      this._createHorizontalRuler(event);
      this._createVerticalRuler(event);
      // 辅助线
    });
  }

  addHorizontalLine(): void {}

  addVerticalLine(): void {}
}
