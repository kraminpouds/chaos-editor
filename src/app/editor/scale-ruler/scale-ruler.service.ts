import { coerceElement } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { PlatformService } from '../../platform.service';
import { AuxiliaryLine } from './entites/auxiliary-line';

@Injectable({
  providedIn: 'root',
})
export class ScaleRulerService implements OnDestroy {
  /** Cached reference to the vessel element. */
  private _vesselElement: HTMLElement | null = null;
  /** Cached reference to the canvas element. */
  private _canvasElement: HTMLElement | null = null;
  private _resizeSubscription = Subscription.EMPTY;
  // 随鼠标移动的辅助线集合
  private _dynamicLine$ = new BehaviorSubject<AuxiliaryLine | null>(null);

  private _horizontalRulerWidth = 0;

  get horizontalRulerWidth(): number {
    return this._horizontalRulerWidth;
  }

  private _verticalRulerHeight = 0;
  get verticalRulerHeight(): number {
    return this._verticalRulerHeight;
  }

  // 固定的横向辅助线集合
  private _horizontalLineList$ = new BehaviorSubject<Array<AuxiliaryLine>>([]);
  // 固定的纵向辅助线集合
  private _verticalLineList$ = new BehaviorSubject<Array<AuxiliaryLine>>([]);

  constructor(private _viewportRuler: ViewportRuler, private _platform: PlatformService) {}

  private _vesselRulerSize = 0;

  get vesselRulerSize(): number {
    return this._vesselRulerSize;
  }

  private _changed = new Subject<void>();

  get changed(): Observable<void> {
    return this._changed.asObservable();
  }

  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
    this._changed.complete();
  }

  /** 注册容器对象 */
  withVesselElement(vesselElement: ElementRef<HTMLElement> | HTMLElement): this {
    this._vesselElement = vesselElement ? coerceElement(vesselElement) : null;
    this._resetScaleRulerSize();
    this._resizeSubscription.unsubscribe();
    this._resizeSubscription = this._viewportRuler.change(10).subscribe(() => this._rulerInsideVesselOnResize());
    return this;
  }

  /** 注册画布对象 */
  withCanvasElement(canvasElement: ElementRef<HTMLElement> | HTMLElement): this {
    this._canvasElement = canvasElement ? coerceElement(canvasElement) : null;
    return this;
  }

  /** 设置大小 */
  setRulerSize(size: number): void {
    if (this._vesselRulerSize !== size) {
      this._vesselRulerSize = size;
      this._resetScaleRulerSize();
    }
  }

  updateOnScroll(): void {
    this._changed.next();
  }

  getCanvasPoint() {
    const { top: vesselTop, left: vesselLeft } = this._getCanvasVesselBoundingClientRect();
    const { top, left } = this._getCanvasBoundingClientRect();
    return { top: top - vesselTop - this._vesselRulerSize, left: left - vesselLeft - this._vesselRulerSize };
  }

  private _resetScaleRulerSize(): void {
    const vesselRect = this._getCanvasVesselBoundingClientRect();
    this._horizontalRulerWidth = vesselRect.width - this._vesselRulerSize;
    this._verticalRulerHeight = vesselRect.height - this._vesselRulerSize;
    this._changed.next();
  }

  private _getCanvasBoundingClientRect = (): ClientRect => {
    if (!this._platform.isBrowser || !this._canvasElement) {
      return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
    }
    const rect = this._canvasElement.getBoundingClientRect();
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  };

  private _getCanvasVesselBoundingClientRect = (): ClientRect => {
    if (!this._platform.isBrowser || !this._vesselElement) {
      return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
    }
    const rect = this._vesselElement.getBoundingClientRect();
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  };

  private _rulerInsideVesselOnResize(): void {}
}
