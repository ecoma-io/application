import { ICommand } from './command';


/**
 * @abstract class BaseCommand
 * @description Lớp cơ sở trừu tượng triển khai các thuộc tính chung của ICommand.
 * Các Command cụ thể nên kế thừa lớp này.
 */
export abstract class AbstractCommand implements ICommand {
  public readonly traceId?: string;
  public readonly version: string;
  public readonly language?: string;

  /**
   * @constructor
   * @param props Các thuộc tính của Command.
   * @param props.traceId ID truy vết.
   * @param props.version Phiên bản của command.
   * @param props.language Ngôn ngữ của command.
   */
  constructor(props: { traceId?: string; version: string; language: string }) {
    this.traceId = props.traceId;
    this.version = props.version;
    this.language = props.language;
  }

}