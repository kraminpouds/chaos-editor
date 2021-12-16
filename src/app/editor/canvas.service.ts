import { coerceElement } from '@angular/cdk/coercion';
import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlatformService } from '../platform.service';
import { WidgetRef } from '../widget/model/widget-ref';

/**
 * 画布服务
 */
@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private widgets$ = new BehaviorSubject<WidgetRef[]>([]);
  /** Cached reference to the vessel element. */
  private _vesselElement: HTMLElement | null = null;
  /** Cached reference to the canvas element. */
  private _canvasElement: HTMLElement | null = null;

  get vesselElement(): HTMLElement | null {
    return this._vesselElement;
  }

  get canvasElement(): HTMLElement | null {
    return this._canvasElement;
  }

  get widgets(): Observable<WidgetRef[]> {
    return this.widgets$.asObservable();
  }

  constructor(private _platform: PlatformService) {}

  getWidgets(): WidgetRef[] {
    return this.widgets$.value;
  }

  /** 注册容器对象 */
  withVesselElement(vesselElement: ElementRef<HTMLElement> | HTMLElement): this {
    this._vesselElement = vesselElement ? coerceElement(vesselElement) : null;
    return this;
  }

  /** 注册画布对象 */
  withCanvasElement(canvasElement: ElementRef<HTMLElement> | HTMLElement): this {
    this._canvasElement = canvasElement ? coerceElement(canvasElement) : null;
    return this;
  }

  getCanvasRect(): ClientRect {
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

  getCanvasVesselRect(): ClientRect {
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

  addWidget(widgetRef: WidgetRef): void {
    const widgets = this.widgets$.value;

    // todo 简单处理，这里还需要计算zIndex等
    widgetRef.outline.updateZIndex(this._getMaxZIndex() + 1);
    this.widgets$.next([...widgets, widgetRef]);
  }

  removeWidget(widgetRef: WidgetRef): void {
    const widgets = this.widgets$.value;
    this.widgets$.next([...widgets.filter(widget => widget !== widgetRef)]);
  }

  private _getMaxZIndex(): number {
    const widgets = this.widgets$.value;
    return widgets.reduce((p, c) => (c.outline.zIndex > p ? c.outline.zIndex : p), 10);
  }
}
