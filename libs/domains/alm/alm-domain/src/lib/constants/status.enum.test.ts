import { Status } from './status.enum';

describe('Status enum', () => {
  it('có giá trị đúng', () => {
    expect(Status.Success).toBe('Success');
    expect(Status.Failure).toBe('Failure');
  });
});
