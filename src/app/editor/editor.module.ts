import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicModule } from 'ng-dynamic-component';
import { MouseWheelModule } from '../mouse-wheel/mouse-wheel.module';
import { WidgetModule } from '../widget/widget.module';
import { EditorComponent } from './editor.component';
import { ScaleRulerWideComponent } from './scale-ruler/scale-ruler-wide.component';
import { ScaleRulerComponent } from './scale-ruler/scale-ruler.component';
import { ReferencePointDirective } from './scope-enchantment/reference-point.directive';
import { ScopeEnchantmentComponent } from './scope-enchantment/scope-enchantment.component';
import { VirtualScrollBarModule } from './virtual-scroll-bar/virtual-scroll-bar.module';

@NgModule({
  imports: [CommonModule, MouseWheelModule, VirtualScrollBarModule, WidgetModule, DynamicModule],
  declarations: [EditorComponent, ScaleRulerComponent, ScaleRulerWideComponent, ScopeEnchantmentComponent, ReferencePointDirective],
  exports: [EditorComponent],
})
export class EditorModule {}
