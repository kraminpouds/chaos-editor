import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WidgetOutline } from 'src/app/widget/model/widget-outline';
import { sortBy, unique } from '../../collection';
import { WidgetPosition } from '../../widget/model/widget-config';
import { CanvasService } from '../canvas.service';

@Injectable({
  providedIn: 'root',
})
export class ScopeEnchantmentService {
  private _highlightWidgetOutline$ = new BehaviorSubject<WidgetOutline | null>(null);
  private _activatedWidgetOutline$ = new BehaviorSubject<WidgetOutline | null>(null);
  // 用于通知效果层无效化组件参考线
  deactivateWidgetGuides = new Subject<void>();

  get highlightWidgetOutlineChange() {
    return this._highlightWidgetOutline$.asObservable();
  }

  get activatedWidgetOutlineChange() {
    return this._activatedWidgetOutline$.asObservable();
  }

  // 组件参考线横向
  private _cacheHGuides: number[] = [];
  // 组件参考线纵向
  private _cacheVGuides: number[] = [];

  get cacheHGuides() {
    return [...this._cacheHGuides];
  }

  get cacheVGuides() {
    return [...this._cacheVGuides];
  }

  constructor(private _canvasService: CanvasService) {}

  setHighlightWidgetOutline(outline: WidgetOutline | null): void {
    this._highlightWidgetOutline$.next(outline);
  }

  activateWidgetOutline(outline: WidgetOutline | null): void {
    this._activatedWidgetOutline$.next(outline);
  }

  // 缓存组件形成的辅助线，用于对齐吸附
  cacheWidgetGuides(): void {
    const cacheHGuides = [];
    const cacheVGuides = [];
    const activatedWidgetOutline = this._activatedWidgetOutline$.value;
    this._canvasService.getWidgets().forEach(widget => {
      // 排除当前激活的组件，自己不能参考自己
      if (widget.outline === activatedWidgetOutline) {
        return;
      }
      cacheHGuides.push(widget.outline.top);
      cacheHGuides.push(widget.outline.bottom);
      cacheHGuides.push(widget.outline.hCenter);
      cacheVGuides.push(widget.outline.left);
      cacheVGuides.push(widget.outline.right);
      cacheVGuides.push(widget.outline.vCenter);
    });
    // 画布辅助线
    const { width, height } = this._canvasService.getCanvasRect();
    cacheHGuides.push(0);
    cacheHGuides.push(height);
    cacheHGuides.push(height / 2);
    cacheVGuides.push(0);
    cacheVGuides.push(width);
    cacheVGuides.push(width / 2);
    // 去掉重复
    this._cacheHGuides = unique(cacheHGuides);
    this._cacheVGuides = unique(cacheVGuides);
  }

  /**
   * 吸附计算
   *
   * 吸附辅助线只会显示在轮廓的4条边以及2条中线
   * 遍历时寻找最接近6跳线的数值，且不超过阀值
   * 横竖各取最小值后自动吸附过去
   */
  calcPositionForSnapToGuides(outline: WidgetOutline): WidgetPosition {
    let leftDelta = Array<number>();
    let topDelta = Array<number>();
    const delta = 16; // 吸附阀值，可以提升到全局设置
    const isSimilar = (source: number, reference: number): boolean => Math.abs(source) <= reference;
    // 横向线吸附
    this._cacheHGuides.forEach(guide => {
      ['top', 'bottom', 'hCenter'].forEach(location => {
        if (isSimilar(guide - (outline as any)[location], delta)) {
          topDelta.push(guide - (outline as any)[location]);
        }
      });
    });
    topDelta.sort(sortBy((key, value) => Math.abs(value)));
    // 竖向线吸附
    this._cacheVGuides.forEach(guide => {
      ['left', 'right', 'vCenter'].forEach(location => {
        if (isSimilar(guide - (outline as any)[location], delta)) {
          leftDelta.push(guide - (outline as any)[location]);
        }
      });
    });
    leftDelta.sort(sortBy((key, value) => Math.abs(value)));
    return {
      left: leftDelta[0] ? outline.left + leftDelta[0] : outline.left,
      top: topDelta[0] ? outline.top + topDelta[0] : outline.top,
    };
  }
}
