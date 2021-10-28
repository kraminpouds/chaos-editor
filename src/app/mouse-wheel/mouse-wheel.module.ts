import { NgModule } from '@angular/core';
import { MouseWheelDirective } from './mouse-wheel.directive';

@NgModule({
  declarations: [MouseWheelDirective],
  exports: [MouseWheelDirective],
})
export class MouseWheelModule {}
