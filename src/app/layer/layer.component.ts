import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { mapSort } from '../collection/map-sort';
import { CanvasService } from '../editor/canvas.service';
import { ScopeEnchantmentService } from '../editor/scope-enchantment/scope-enchantment.service';
import { WidgetRef } from '../widget/model/widget-ref';

@Component({
  selector: 'chaos-editor-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent implements OnInit {
  readonly widgets = new Subject<WidgetRef[]>();

  constructor(private _canvasService: CanvasService, private _enchantmentService: ScopeEnchantmentService) {}

  ngOnInit(): void {
    this._canvasService.widgets.subscribe(widgets => {
      const _widgets = [...widgets];
      _widgets.sort(mapSort(value => value.outline.zIndex)).reverse();
      this.widgets.next(_widgets);
    });
  }
}
