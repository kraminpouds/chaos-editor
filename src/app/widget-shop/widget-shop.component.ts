import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { CanvasService } from '../editor/canvas.service';
import { WidgetRef } from '../widget/model/widget-ref';
import { TextWidgetComponent } from '../widget/text-widget/text-widget.component';
import { Widget } from '../widget/widget.common';

@Component({
  selector: 'chaos-editor-widget-shop',
  templateUrl: './widget-shop.component.html',
  styleUrls: ['./widget-shop.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetShopComponent implements OnInit, OnDestroy {
  test = <Widget>{
    name: '文本',
    width: 200,
    height: 200,
    component: TextWidgetComponent,
  };

  private readonly _destroyed = new Subject<void>();

  private _document: Document;
  private _portal: ComponentPortal<any> | null = null;
  private _overlayRef!: OverlayRef;

  constructor(private _overlay: Overlay, @Inject(DOCUMENT) _document: any, private _canvasService: CanvasService) {
    this._document = _document;
  }

  ngOnInit(): void {
    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay.position().global(),
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();

    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
  }

  dragWidget(widget: Widget, event: MouseEvent): void {
    this._portal = new ComponentPortal(widget.component);
    const positionStrategy = this._overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
    positionStrategy.left(coerceCssPixelValue(event.pageX - widget.width / 2)).top(coerceCssPixelValue(event.pageY - widget.height / 2));
    this._overlayRef.updatePosition();
    this._overlayRef.addPanelClass('widget-preparation-overlay');
    this._overlayRef.attach(this._portal);

    const moveEvent = fromEvent<MouseEvent>(this._document, 'mousemove').pipe(takeUntil(this._destroyed));
    const upEvent = fromEvent<MouseEvent>(this._document, 'mouseup').pipe(
      takeUntil(this._destroyed),
      take(1),
      tap(event => {
        if (this._overlayRef.hasAttached()) {
          this._overlayRef.detach();
          this._dropWidget(widget, event);
        }
      })
    );
    moveEvent.pipe(takeUntil(upEvent)).subscribe(event => this._updatePosition(widget, event));
  }

  private _updatePosition(widget: Widget, event: MouseEvent): void {
    const positionStrategy = this._overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
    positionStrategy.left(coerceCssPixelValue(event.pageX - widget.width / 2)).top(coerceCssPixelValue(event.pageY - widget.height / 2));
    this._overlayRef.updatePosition();
  }

  private _dropWidget(widget: Widget, event: MouseEvent) {
    const { left, top } = this._canvasService.getCanvasVesselRect();
    const { left: canvasLeft, top: canvasTop } = this._canvasService.getCanvasRect();
    if (event.pageX > left && event.pageY > top) {
      const widgetRef = new WidgetRef(widget);
      widgetRef.outline.updatePosition({
        left: event.pageX - canvasLeft - widgetRef.outline.width / 2,
        top: event.pageY - canvasTop - widgetRef.outline.height / 2,
      });
      this._canvasService.addWidget(widgetRef);
    }
  }
}
