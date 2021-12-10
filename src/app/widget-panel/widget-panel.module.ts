import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicModule } from 'ng-dynamic-component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { WidgetPanelComponent } from './widget-panel.component';

@NgModule({
  declarations: [WidgetPanelComponent],
  imports: [CommonModule, NzGridModule, DynamicModule],
  exports: [WidgetPanelComponent],
})
export class WidgetPanelModule {}
