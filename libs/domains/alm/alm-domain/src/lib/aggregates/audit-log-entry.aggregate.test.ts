import { InitiatorType } from "../constants";
import { Status } from "../constants/status.enum";
import { InvalidAuditLogEntryError } from "../errors/invalid-audit-log-entry.error";
import { AuditContext, AuditLogEntryId, Initiator } from "../value-objects";
import {
  AuditLogEntry,
  IAuditLogEntryProps,
} from "./audit-log-entry.aggregate";

/**
 * Unit test cho AuditLogEntry aggregate.
 */
describe("AuditLogEntry Aggregate", () => {
  it("khởi tạo hợp lệ với đầy đủ thuộc tính", () => {
    const props: IAuditLogEntryProps = {
      id: new AuditLogEntryId("0196d433-f78b-7ec5-b98f-3eee73d3c914"),
      timestamp: new Date(),
      initiator: new Initiator({
        type: InitiatorType.User,
        id: "user-1",
        name: "Nguyễn Văn A",
      }),
      boundedContext: "IAM",
      actionType: "User.Created",
      status: Status.Success,
      createdAt: new Date(),
      contextData: new AuditContext({ ip: "127.0.0.1" }),
    };
    const entry = new AuditLogEntry(props);
    expect(entry.boundedContext).toBe("IAM");
    expect(entry.initiator.type).toBe(InitiatorType.User);
    expect(entry.status).toBe(Status.Success);
    expect(entry.contextData?.get("ip")).toBe("127.0.0.1");
  });

  it("ném lỗi khi thiếu initiator", () => {
    const props: any = {
      id: new AuditLogEntryId("0196d411-4cf0-7a59-a772-8218ad99017c"),
      timestamp: new Date(),
      boundedContext: "NDM",
      actionType: "User.Created",
      status: Status.Success,
      createdAt: new Date(),
    };
    expect(() => new AuditLogEntry(props)).toThrow(InvalidAuditLogEntryError);
  });

  it("ném lỗi khi thiếu timestamp", () => {
    const props: any = {
      id: new AuditLogEntryId("0196d411-4cf0-7a59-a772-8218ad99017c"),
      initiator: new Initiator({ type: InitiatorType.Integration }),
      boundedContext: "PIM",
      actionType: "User.Created",
      status: Status.Success,
      createdAt: new Date(),
    };
    expect(() => new AuditLogEntry(props)).toThrow(InvalidAuditLogEntryError);
  });
});
