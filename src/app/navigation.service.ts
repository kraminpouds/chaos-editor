import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router, private route: ActivatedRoute, private _platform: PlatformService) {}

  navigationRelativeUrl(path: string, target = '_blank'): void {
    const window = this._platform.getWindow();
    const newRelativeUrl = this.router.createUrlTree([path], { relativeTo: this.route, queryParamsHandling: 'preserve' });
    const baseUrl = window.location.href.replace(this.router.url, '');

    window.open(baseUrl + newRelativeUrl, target);
  }
}
