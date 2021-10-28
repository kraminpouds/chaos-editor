import { coerceElement } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { PlatformService } from '../../platform.service';

@Injectable({ providedIn: 'root' })
export class VirtualScrollBarService implements OnDestroy {
  private _horizontalWidth = 0;
  private _verticalHeight = 0;
  private _position = { top: 0, left: 0 };
  private _offsetX = 0;
  private _offsetY = 0;
  /** Cached reference to the vessel element. */
  private _vesselElement: HTMLElement | null = null;
  /** Cached reference to the canvas element. */
  private _canvasElement: HTMLElement | null = null;
  private _vesselRulerSize = 0;
  private _scrollBarSize = 10;
  private _resizeSubscription = Subscription.EMPTY;
  private _changed = new Subject<void>();

  get changed(): Observable<void> {
    return this._changed.asObservable();
  }

  get horizontalWidth(): number {
    return this._horizontalWidth;
  }

  get verticalHeight(): number {
    return this._verticalHeight;
  }

  get position() {
    return this._position;
  }

  get offsetX(): number {
    return this._offsetX;
  }

  get offsetY(): number {
    return this._offsetY;
  }

  constructor(private _viewportRuler: ViewportRuler, private _platform: PlatformService) {}

  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
    this._changed.complete();
  }

  move(deltaX: number = 0, deltaY: number = 0): void {
    const vesselRect = this._getCanvasVesselRect();

    const minX = this._vesselRulerSize;
    const maxX = vesselRect.width - this.horizontalWidth - this._scrollBarSize;
    const minY = this._vesselRulerSize;
    const maxY = vesselRect.height - this.verticalHeight - this._scrollBarSize;
    const { left, top } = this._position;

    const offsetX = clamp(left + this._offsetX + deltaX, minX, maxX);
    const offsetY = clamp(top + this._offsetY + deltaY, minY, maxY);

    if (offsetX - left !== this._offsetX || offsetY - top !== this._offsetY) {
      this._offsetX = offsetX - left;
      this._offsetY = offsetY - top;
      this._changed.next();
    }
  }

  resetOffset() {
    if (!this._vesselElement || !this._canvasElement) {
      return;
    }
    const vesselRect = this._getCanvasVesselRect();
    const canvasRect = this._getCanvasRect();
    const canvasRelativePosition = {
      top: canvasRect.top - vesselRect.top - this._vesselRulerSize,
      right: vesselRect.right - canvasRect.right - this._scrollBarSize,
      bottom: vesselRect.bottom - canvasRect.bottom - this._scrollBarSize,
      left: canvasRect.left - vesselRect.left - this._vesselRulerSize,
    };
    const topIsOverflow = canvasRect.top - vesselRect.top - this._vesselRulerSize < 0;
    const leftIsOverflow = canvasRect.left - vesselRect.left - this._vesselRulerSize < 0;
    // 画布位于面板的相对位置
    const relativePosition = {
      top: canvasRelativePosition.top >= 0 ? Math.max(0, canvasRelativePosition.bottom) : -canvasRelativePosition.top,
      right: canvasRelativePosition.right >= 0 ? Math.max(0, canvasRelativePosition.left) : -canvasRelativePosition.right,
      bottom: canvasRelativePosition.bottom >= 0 ? Math.max(0, canvasRelativePosition.top) : -canvasRelativePosition.bottom,
      left: canvasRelativePosition.left >= 0 ? Math.max(0, canvasRelativePosition.right) : -canvasRelativePosition.left,
    };
    // 滚动条的左滚动量等于画布左相对位置加表尺宽度
    // 滚动条的上滚动量等于画布上相对位置加表尺宽度
    this._position = {
      top: relativePosition.top + this._vesselRulerSize,
      left: relativePosition.left + this._vesselRulerSize,
    };
    this._horizontalWidth = vesselRect.width - this._vesselRulerSize - this._scrollBarSize - relativePosition.left - relativePosition.right;
    this._verticalHeight = vesselRect.height - this._vesselRulerSize - this._scrollBarSize - relativePosition.top - relativePosition.bottom;
    this._changed.next();
  }

  /** 注册容器对象 */
  withVesselElement(vesselElement: ElementRef<HTMLElement> | HTMLElement, vesselRulerSize: number = 0): this {
    this._vesselElement = vesselElement ? coerceElement(vesselElement) : null;
    this._vesselRulerSize = vesselRulerSize;
    this._resizeSubscription.unsubscribe();
    this._resizeSubscription = this._viewportRuler.change(10).subscribe(() => this._scrollBarInsideVesselOnResize());
    return this;
  }

  /** 注册画布对象 */
  withCanvasElement(canvasElement: ElementRef<HTMLElement> | HTMLElement): this {
    this._canvasElement = canvasElement ? coerceElement(canvasElement) : null;
    return this;
  }

  private _getCanvasRect(): ClientRect {
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
  }

  private _getCanvasVesselRect(): ClientRect {
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
  }

  /**
   * 检查当窗口放生大小变化后，滚动条的位置是否还在容器内部
   * 如果不是，需要调整滚动条位置
   */
  private _scrollBarInsideVesselOnResize() {}
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
