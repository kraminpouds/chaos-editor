import { Injectable } from '@angular/core';
import { ScaleRuler } from './entites/ruler';

@Injectable({
  providedIn: 'root',
})
export class ScaleRulerService {
  readonly scaleRuler = new ScaleRuler();

  constructor() {}
}
