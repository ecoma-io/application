/**
 * Utility class for cursor-based pagination
 */
export class CursorPagination {
  /**
   * Encode cursor data to base64 string
   * @param field Field name used for cursor
   * @param value Field value
   * @returns Base64 encoded cursor
   */
  static encodeCursor(field: string, value: any): string {
    const cursorData = { field, value };
    return Buffer.from(JSON.stringify(cursorData)).toString("base64");
  }

  /**
   * Decode cursor data from base64 string
   * @param cursor Base64 encoded cursor
   * @returns Decoded cursor data or null if invalid
   */
  static decodeCursor(cursor: string): { field: string; value: any } | null {
    try {
      const decodedCursor = Buffer.from(cursor, "base64").toString("utf-8");
      const cursorData = JSON.parse(decodedCursor);

      if (cursorData && cursorData.field && cursorData.value !== undefined) {
        return cursorData;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Build MongoDB query with cursor conditions
   * @param query Original query
   * @param cursor Cursor value (base64 encoded)
   * @param sortField Sort field
   * @param sortDirection Sort direction (1 for ASC, -1 for DESC)
   * @returns Modified query with cursor conditions
   */
  static buildQueryWithCursor(
    query: Record<string, any>,
    cursor: string | undefined,
    sortField: string,
    sortDirection: 1 | -1
  ): Record<string, any> {
    if (!cursor) {
      return query;
    }

    const cursorData = this.decodeCursor(cursor);
    if (!cursorData || cursorData.field !== sortField) {
      return query;
    }

    const operator = sortDirection === 1 ? "$gt" : "$lt";
    return {
      ...query,
      [sortField]: { [operator]: cursorData.value },
    };
  }
}
