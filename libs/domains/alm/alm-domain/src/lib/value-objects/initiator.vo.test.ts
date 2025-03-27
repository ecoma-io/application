import { InitiatorType } from '../constants';
import { Initiator } from './initiator.vo';

/**
 * Unit test cho Initiator Value Object.
 */
describe('Initiator VO', () => {
  it('khởi tạo hợp lệ', () => {
    const vo = new Initiator({ type: InitiatorType.User, id: 'u1', name: 'Nguyễn Văn A' });
    expect(vo.type).toBe(InitiatorType.User);
    expect(vo.id).toBe('u1');
    expect(vo.name).toBe('Nguyễn Văn A');
  });

  it('bất biến: không cho phép thay đổi props', () => {
    const vo = new Initiator({ type: InitiatorType.System});
    // @ts-expect-error: Test bất biến, không cho phép thay đổi props
    expect(() => { vo.props.type = 'HACK'; }).toThrow();
  });

  it('so sánh equals đúng', () => {
    const a = new Initiator({ type: InitiatorType.User, id: 'u1' });
    const b = new Initiator({ type: InitiatorType.User, id: 'u1' });
    const c = new Initiator({ type: InitiatorType.System});
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('ném lỗi khi type rỗng', () => {
    expect(() => new Initiator({ type: '' as InitiatorType })).toThrow();
  });
});
