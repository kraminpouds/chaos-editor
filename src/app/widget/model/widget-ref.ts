import { v4 } from 'uuid';
import { Widget } from '../widget.common';
import { WidgetOutline } from './widget-outline';

let uniqueId = 0;

export class WidgetRef<T = any> {
  outline = new WidgetOutline();

  name = '';
  readonly uuid = v4();

  constructor(private widget: Widget<T>) {
    this._initData();
  }

  private _initData() {
    this.name = `${this.widget.name} ${++uniqueId}`;
    this.outline
      .updatePosition({ left: this.widget.left, top: this.widget.top })
      .updateSize({ width: this.widget.width, height: this.widget.height });
  }
}
