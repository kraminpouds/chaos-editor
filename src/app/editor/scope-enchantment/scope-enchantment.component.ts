import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { WidgetPosition } from '../../widget/model/widget-config';
import { WidgetDrag } from '../../widget/model/widget-events';
import { WidgetOutline } from '../../widget/model/widget-outline';
import { CanvasService } from '../canvas.service';
import { ReferencePointEvent } from './reference-point.directive';
import { ScopeEnchantmentService } from './scope-enchantment.service';

@Component({
  selector: 'chaos-editor-scope-enchantment',
  templateUrl: './scope-enchantment.component.html',
  styleUrls: ['./scope-enchantment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScopeEnchantmentComponent implements OnInit, OnDestroy {
  @ViewChild('highlightOutline', { static: true }) highlightOutlineRef!: ElementRef<HTMLDivElement>;
  @ViewChild('activatedOutline', { static: true }) activatedOutlineRef!: ElementRef<HTMLDivElement>;
  @ViewChild('guidesWrap', { static: true }) guidesWrapRef!: ElementRef<HTMLDivElement>;
  @ViewChild('widgetContextMenu', { static: true }) widgetContextMenuComponent!: NzDropdownMenuComponent;

  private _highlightOutlineSubscription: Subscription | null = null;
  private _activatedOutlineSubscription: Subscription | null = null;
  private _activatedEventsSubscription: Subscription | null = null;

  private _activatedOutline: WidgetOutline | null = null;
  private _minimum = 24;

  private _widgetOutlines: WidgetOutline[] = [];

  constructor(private _enchantmentService: ScopeEnchantmentService, private _canvasService: CanvasService) {}

  ngOnInit(): void {
    this._enchantmentService.withWidgetContextMenuComponent(this.widgetContextMenuComponent);

    this._enchantmentService.highlightWidgetOutlineChange.subscribe(outline => {
      if (outline) {
        this.highlightOutlineRef.nativeElement.style.visibility = 'visible';
        this._updateHighlightOutline(outline);
        this._highlightOutlineSubscription = outline._stateChanges.subscribe(() => this._updateHighlightOutline(outline));
      } else {
        this.highlightOutlineRef.nativeElement.style.visibility = 'hidden';
        this._highlightOutlineSubscription?.unsubscribe();
      }
    });

    this._enchantmentService.activatedWidgetOutlineChange.subscribe(outline => {
      this._activatedOutline = outline;
      if (outline) {
        this.activatedOutlineRef.nativeElement.style.visibility = 'visible';
        this._updateActivatedOutline(outline);

        this._activatedOutlineSubscription = outline._stateChanges.subscribe(() => {
          this._updateActivatedOutline(outline);
        });

        this._activatedEventsSubscription = outline.widgetRef.events.eventChanges
          .pipe(filter(e => e instanceof WidgetDrag))
          .subscribe(() => this._updateActivatedGuides(outline));
      } else {
        this.activatedOutlineRef.nativeElement.style.visibility = 'hidden';
        this._activatedOutlineSubscription?.unsubscribe();
        this._activatedEventsSubscription?.unsubscribe();
      }
    });

    this._enchantmentService.deactivateWidgetGuides.subscribe(() => this._deactivateWidgetGuides());
  }

  ngOnDestroy(): void {
    this._highlightOutlineSubscription?.unsubscribe();
    this._activatedOutlineSubscription?.unsubscribe();
  }

  onPointDrag(pointPositionX: 'left' | 'center' | 'right', pointPositionY: 'top' | 'center' | 'bottom', event: ReferencePointEvent): void {
    if (!this._activatedOutline) {
      return;
    }

    const position: WidgetPosition = {};
    const size = {
      width: event.origin.width,
      height: event.origin.height,
    };

    switch (pointPositionX) {
      case 'left': // lw
        position.left = Math.min(event.current.leftDelta, event.origin.width - this._minimum) + event.origin.left;
        size.width = -Math.min(event.current.leftDelta, event.origin.width - this._minimum) + event.origin.width;
        break;
      case 'right': // w
        size.width = Math.max(event.current.leftDelta, -event.origin.width + this._minimum) + event.origin.width;
        break;
    }

    switch (pointPositionY) {
      case 'top': // th
        position.top = Math.min(event.current.topDelta, event.origin.height - this._minimum) + event.origin.top;
        size.height = -Math.min(event.current.topDelta, event.origin.height - this._minimum) + event.origin.height;
        break;
      case 'bottom': // h
        size.height = Math.max(event.current.topDelta, -event.origin.height + this._minimum) + event.origin.height;
        break;
    }

    // 拖拽大小是否需要增加吸附功能呢？

    this._activatedOutline.updatePosition(position).updateSize(size);
    this._activatedOutline.widgetRef.events.drag(position);
  }

  // 置顶
  setZIndexToTop(): void {
    if (this._activatedOutline) {
      this._canvasService.setZIndexToTop(this._activatedOutline.widgetRef);
    }
  }

  // 置底
  setZIndexToBottom(): void {
    if (this._activatedOutline) {
      this._canvasService.setZIndexToBottom(this._activatedOutline.widgetRef);
    }
  }

  // 上一层
  setZIndexUp(): void {
    if (this._activatedOutline) {
      this._canvasService.setZIndexUp(this._activatedOutline.widgetRef);
    }
  }

  // 下一层
  setZIndexDown(): void {
    if (this._activatedOutline) {
      this._canvasService.setZIndexDown(this._activatedOutline.widgetRef);
    }
  }

  private _updateHighlightOutline(outline: WidgetOutline) {
    this.highlightOutlineRef.nativeElement.style.top = coerceCssPixelValue(outline.top);
    this.highlightOutlineRef.nativeElement.style.left = coerceCssPixelValue(outline.left);
    this.highlightOutlineRef.nativeElement.style.width = coerceCssPixelValue(outline.width);
    this.highlightOutlineRef.nativeElement.style.height = coerceCssPixelValue(outline.height);
  }

  private _updateActivatedOutline(outline: WidgetOutline) {
    this.activatedOutlineRef.nativeElement.style.top = coerceCssPixelValue(outline.top);
    this.activatedOutlineRef.nativeElement.style.left = coerceCssPixelValue(outline.left);
    this.activatedOutlineRef.nativeElement.style.width = coerceCssPixelValue(outline.width);
    this.activatedOutlineRef.nativeElement.style.height = coerceCssPixelValue(outline.height);
  }

  private _updateActivatedGuides(outline: WidgetOutline): void {
    const guides = this.guidesWrapRef.nativeElement.querySelectorAll<HTMLDivElement>('div.scope-guide');
    guides.forEach(guide => {
      const location = guide.getAttribute('data-guide-location');
      switch (location) {
        case 'top':
          guide.style.top = coerceCssPixelValue(outline.top);
          guide.style.visibility = this._enchantmentService.cacheHGuides.includes(outline.top) ? 'visible' : 'hidden';
          break;
        case 'bottom':
          guide.style.top = coerceCssPixelValue(outline.bottom);
          guide.style.visibility = this._enchantmentService.cacheHGuides.includes(outline.bottom) ? 'visible' : 'hidden';
          break;
        case 'hCenter':
          guide.style.top = coerceCssPixelValue(outline.hCenter);
          guide.style.visibility = this._enchantmentService.cacheHGuides.includes(outline.hCenter) ? 'visible' : 'hidden';
          break;
        case 'left':
          guide.style.left = coerceCssPixelValue(outline.left);
          guide.style.visibility = this._enchantmentService.cacheVGuides.includes(outline.left) ? 'visible' : 'hidden';
          break;
        case 'right':
          guide.style.left = coerceCssPixelValue(outline.right);
          guide.style.visibility = this._enchantmentService.cacheVGuides.includes(outline.right) ? 'visible' : 'hidden';
          break;
        case 'vCenter':
          guide.style.left = coerceCssPixelValue(outline.vCenter);
          guide.style.visibility = this._enchantmentService.cacheVGuides.includes(outline.vCenter) ? 'visible' : 'hidden';
          break;
      }
    });
  }

  private _deactivateWidgetGuides(): void {
    const guides = this.guidesWrapRef.nativeElement.querySelectorAll<HTMLDivElement>('div.scope-guide');
    guides.forEach(guide => (guide.style.visibility = 'hidden'));
  }
}
