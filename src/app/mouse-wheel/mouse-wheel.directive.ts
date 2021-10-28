import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MouseWheel } from './mouse-wheel';

@Directive({
  selector: '[nceMouseWheel]',
})
export class MouseWheelDirective implements OnDestroy {
  @Output()
  mouseWheelEvent: EventEmitter<MouseWheel> = new EventEmitter<MouseWheel>();

  private _destroy = new Subject<void>();

  constructor(private _elementRef: ElementRef) {
    this._listenMouseWheelEvent();
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  private _listenMouseWheelEvent(): void {
    fromEvent<WheelEvent>(this._elementRef.nativeElement, 'mousewheel')
      .pipe(takeUntil(this._destroy))
      .subscribe(event => {
        event.preventDefault();
        this.mouseWheelEvent.next({
          deltaX: event.deltaX,
          deltaY: event.deltaY,
        });
      });
  }
}
