import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MouseWheelModule } from '../mouse-wheel/mouse-wheel.module';
import { EditorPanelComponent } from './editor-panel.component';
import { ScaleRulerWideComponent } from './scale-ruler/scale-ruler-wide.component';
import { ScaleRulerComponent } from './scale-ruler/scale-ruler.component';
import { VirtualScrollBarModule } from './virtual-scroll-bar/virtual-scroll-bar.module';

@NgModule({
  imports: [CommonModule, MouseWheelModule, VirtualScrollBarModule],
  declarations: [EditorPanelComponent, ScaleRulerComponent, ScaleRulerWideComponent],
  exports: [EditorPanelComponent],
})
export class EditorPanelModule {}
