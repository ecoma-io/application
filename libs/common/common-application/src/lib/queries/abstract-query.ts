import { IQuery } from './query';

/**
 * @abstract class BaseQuery
 * @description Lớp cơ sở trừu tượng triển khai các thuộc tính chung của IQuery.
 * Các Query cụ thể nên kế thừa lớp này.
 */
export abstract class AbstractQuery implements IQuery {
  public readonly traceId?: string;
  public readonly version: string;
  public readonly language: string;

  /**
   * @constructor
   * @param props Các thuộc tính của Query.
   * @param props.traceId ID truy vết.
   * @param props.version Phiên bản của query.
   * @param props.language Ngôn ngữ của query.
   */
  constructor(props: { traceId?: string; version: string; language: string }) {
    this.traceId = props.traceId;
    this.version = props.version;
    this.language = props.language;
  }
}