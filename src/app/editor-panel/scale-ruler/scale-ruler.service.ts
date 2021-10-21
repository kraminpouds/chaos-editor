import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuxiliaryLine } from './entites/auxiliary-line';
import { OffsetChangedEvent } from './scale-ruler';

@Injectable({
  providedIn: 'root',
})
export class ScaleRulerService {
  private _offsetChanged$ = new Subject<OffsetChangedEvent>();
  // 随鼠标移动的辅助线集合
  private _dynamicLine$ = new BehaviorSubject<AuxiliaryLine | null>(null);
  // 固定的横向辅助线集合
  private _horizontalLineList$ = new BehaviorSubject<Array<AuxiliaryLine>>([]);
  // 固定的纵向辅助线集合
  private _verticalLineList$ = new BehaviorSubject<Array<AuxiliaryLine>>([]);

  private _horizontalRulerWidth = 0;

  get horizontalRulerWidth(): number {
    return this._horizontalRulerWidth;
  }

  set horizontalRulerWidth(width: number) {
    this._horizontalRulerWidth = width;
  }

  private _verticalRulerHeight = 0;

  constructor() {}

  get verticalRulerHeight(): number {
    return this._verticalRulerHeight;
  }

  set verticalRulerHeight(height: number) {
    this._verticalRulerHeight = height;
  }

  // 横向偏移
  private _offsetX = 0;

  get offsetX(): number {
    return this._offsetX;
  }

  set offsetX(offset: number) {
    const delta = this._offsetX - offset;
    this._offsetX = offset;
    this._emitOffsetChangeEvent(delta, undefined);
  }

  // 纵向偏移
  private _offsetY = 0;

  get offsetY(): number {
    return this._offsetY;
  }

  set offsetY(offset: number) {
    const delta = this._offsetY - offset;
    this._offsetY = offset;
    this._emitOffsetChangeEvent(undefined, delta);
  }

  get transformStyleByOffset(): { transform: string } {
    return { transform: `translate(${this._offsetX}px,${this._offsetY}px)` };
  }

  get offsetChanged(): Observable<OffsetChangedEvent> {
    return this._offsetChanged$.asObservable();
  }

  moveto(deltaX: number = 0, deltaY: number = 0): void {
    this._offsetX -= deltaX;
    this._offsetY -= deltaY;
    this._emitOffsetChangeEvent(deltaX, deltaY);
  }

  resetOffset(): void {
    this._offsetX = 0;
    this._offsetY = 0;
  }

  private _emitOffsetChangeEvent(deltaX: number = 0, deltaY: number = 0): void {
    this._offsetChanged$.next({
      offsetX: this._offsetX,
      offsetY: this._offsetY,
      deltaX,
      deltaY,
    });
  }
}
