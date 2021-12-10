import { TestBed } from '@angular/core/testing';

import { ScopeEnchantmentService } from './scope-enchantment.service';

describe('ScopeEnchantmentService', () => {
  let service: ScopeEnchantmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScopeEnchantmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
