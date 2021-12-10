import { Subject } from 'rxjs';
import { WidgetPosition, WidgetSize } from './widget-config';

/**
 * 组件外轮廓
 */
export class WidgetOutline {
  private _left = 0;
  private _top = 0;
  private _width = 0;
  private _height = 0;
  private _rotate = 0;
  private _opacity = 100;
  private _zIndex = 0;

  readonly _stateChanges = new Subject<WidgetOutline>();

  get left(): number {
    return this._left;
  }

  get top(): number {
    return this._top;
  }

  get right(): number {
    return this._left + this._width;
  }

  get bottom(): number {
    return this._top + this._height;
  }

  get hCenter(): number {
    return this._top + this._height / 2;
  }

  get vCenter(): number {
    return this._left + this._width / 2;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get rotate(): number {
    return this._rotate;
  }

  get opacity(): number {
    return this._opacity;
  }

  get zIndex(): number {
    return this._zIndex;
  }

  constructor() {}

  updatePosition(position: WidgetPosition) {
    let stateChanged = false;
    if (position.top !== undefined) {
      this._top = position.top;
      stateChanged = true;
    }

    if (position.left !== undefined) {
      this._left = position.left;
      stateChanged = true;
    }

    if (stateChanged) {
      this._stateChanges.next(this);
    }

    return this;
  }

  updateSize(size: WidgetSize) {
    let stateChanged = false;

    if (size.width !== undefined) {
      this._width = size.width;
      stateChanged = true;
    }

    if (size.height !== undefined) {
      this._height = size.height;
      stateChanged = true;
    }

    if (stateChanged) {
      this._stateChanges.next(this);
    }

    return this;
  }
}
