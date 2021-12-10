import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextWidgetComponent } from './text-widget/text-widget.component';
import { WidgetShellComponent } from './widget-shell.component';
import { WidgetComponent } from './widget.component';

@NgModule({
  declarations: [WidgetComponent, TextWidgetComponent, WidgetShellComponent],
  exports: [WidgetComponent, WidgetShellComponent],
  imports: [CommonModule, PortalModule],
})
export class WidgetModule {}
