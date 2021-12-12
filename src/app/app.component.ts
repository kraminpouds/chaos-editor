import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  @HostBinding('class') appRootClass = 'app-root';
  private _document: Document;

  constructor(private readonly renderer: Renderer2, private readonly router: Router, @Inject(DOCUMENT) _document: any) {
    this._document = _document;
    // 监听路由变化
    this.router.events.subscribe(evt => this._resolveRouter(evt));
  }

  private _resolveRouter(evt: unknown): void {
    if (evt instanceof NavigationEnd) {
      const ele = this._document.querySelector('#main-loading');
      this.renderer.setStyle(ele, 'display', 'none');
    } else if (evt instanceof NavigationStart) {
      const ele = this._document.querySelector('#main-loading');
      this.renderer.removeStyle(ele, 'display');
    }
  }
}
