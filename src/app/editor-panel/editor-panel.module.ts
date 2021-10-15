import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditorPanelComponent } from './editor-panel.component';
import { ScaleRulerWideComponent } from './scale-ruler/scale-ruler-wide.component';
import { ScaleRulerComponent } from './scale-ruler/scale-ruler.component';

@NgModule({
  declarations: [EditorPanelComponent, ScaleRulerComponent, ScaleRulerWideComponent],
  imports: [CommonModule],
  exports: [EditorPanelComponent],
})
export class EditorPanelModule {}
