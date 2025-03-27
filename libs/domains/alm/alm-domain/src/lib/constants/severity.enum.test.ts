import { Severity } from './severity.enum';

describe('Severity enum', () => {
  it('có giá trị đúng', () => {
    expect(Severity.Critical).toBe('Critical');
    expect(Severity.Informational).toBe('Informational');
  });
});
