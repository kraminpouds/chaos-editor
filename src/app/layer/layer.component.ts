import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  readonly widgets = this._canvasService.widgets;

  constructor(private _canvasService: CanvasService) {}

  ngOnInit(): void {}

}
