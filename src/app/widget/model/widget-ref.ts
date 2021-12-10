import { Widget } from '../widget.common';
import { WidgetOutline } from './widget-outline';

export class WidgetRef<T = any> {
  outline = new WidgetOutline();

  constructor(public widget: Widget<T>) {
    this._initData();
  }

  private _initData() {
    this.outline
      .updatePosition({ left: this.widget.left, top: this.widget.top })
      .updateSize({ width: this.widget.width, height: this.widget.height });
  }
}
