import { Observable, Subject } from 'rxjs';
import { WidgetPosition, WidgetSize } from './widget-config';
import { WidgetRef } from './widget-ref';

export class WidgetEvent {
  constructor(public widgetRef: WidgetRef) {}
}

export class WidgetDrag extends WidgetEvent {
  constructor(widgetRef: WidgetRef, public position: WidgetPosition) {
    super(widgetRef);
  }
}

export class WidgetResize extends WidgetEvent {
  constructor(widgetRef: WidgetRef, public size: WidgetSize) {
    super(widgetRef);
  }
}

export type Event = WidgetEvent | WidgetDrag | WidgetResize;

export class WidgetEvents {
  private _events = new Subject<Event>();

  get eventChanges(): Observable<Event> {
    return this._events.asObservable();
  }

  constructor(public widgetRef: WidgetRef) {}

  drag(position: WidgetPosition): void {
    this._events.next(new WidgetDrag(this.widgetRef, position));
  }

  resize(size: WidgetSize): void {
    this._events.next(new WidgetResize(this.widgetRef, size));
  }
}
