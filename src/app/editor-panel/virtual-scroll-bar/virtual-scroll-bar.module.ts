import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragScrollBarDirective } from './drag-scroll-bar.directive';
import { VirtualScrollBarComponent } from './virtual-scroll-bar.component';

@NgModule({
  declarations: [VirtualScrollBarComponent, DragScrollBarDirective],
  exports: [VirtualScrollBarComponent],
  imports: [CommonModule],
})
export class VirtualScrollBarModule {}
