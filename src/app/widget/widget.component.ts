import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { WidgetRef } from './model/widget-ref';

@Component({
  selector: 'chaos-editor-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent implements OnInit, OnDestroy, OnChanges {
  // 组件主体实例的引用
  @Input() widgetRef!: WidgetRef;

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet!: CdkPortalOutlet;

  // private _disablePointerEvents = false;
  private readonly _destroyed = new Subject<void>();

  constructor(private _elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
    this._portalOutlet.dispose();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.widgetRef && changes.widgetRef.currentValue) {
      const widgetRef = changes.widgetRef.currentValue;
      this._attachComponentPortal(new ComponentPortal(widgetRef.widget.component));
    }
  }

  private _attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      this._portalOutlet.detach();
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }
}
