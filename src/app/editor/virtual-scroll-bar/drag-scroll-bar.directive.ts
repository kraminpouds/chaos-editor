import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, isDevMode, OnDestroy, Output } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

function eventLogger(event: MouseEvent): void {
  if (isDevMode()) {
    console.log('[DragScrollBar]', event.type, event);
  }
}

@Directive({
  selector: '[nceDragScrollBar]',
})
export class DragScrollBarDirective implements OnDestroy {
  @Output() nceDrag = new EventEmitter<MouseEvent>();

  private _document: Document;
  private readonly _destroyed = new Subject<void>();

  constructor(private _elementRef: ElementRef, @Inject(DOCUMENT) _document: any) {
    this._document = _document;
    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mousedown')
      .pipe(
        takeUntil(this._destroyed),
        tap(event => eventLogger(event))
      )
      .subscribe(event => this._initializeDragSequence(event));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _initializeDragSequence(event: MouseEvent) {
    event.stopPropagation();
    const moveEvent = fromEvent<MouseEvent>(this._document, 'mousemove').pipe(
      takeUntil(this._destroyed),
      tap(event => eventLogger(event))
    );
    const upEvent = fromEvent<MouseEvent>(this._document, 'mouseup').pipe(
      takeUntil(this._destroyed),
      take(1),
      tap(event => eventLogger(event))
    );
    moveEvent.pipe(takeUntil(upEvent)).subscribe(event => this.nceDrag.next(event));
  }
}
