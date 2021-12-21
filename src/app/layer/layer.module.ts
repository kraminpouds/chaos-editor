import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeleteOutline, PictureOutline } from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LayerComponent } from './layer.component';
import { WidgetTriggerComponent } from './widget-trigger/widget-trigger.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LayerComponent, WidgetTriggerComponent],
  exports: [LayerComponent],
})
export class LayerModule {}
