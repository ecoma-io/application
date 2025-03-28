import { NotificationContext } from '../value-objects';
import { Template } from '../aggregates/template.aggregate';

/**
 * Domain service để render template thông báo
 */
export class TemplateRendererService {
  /**
   * Render một template với context cho trước
   * @param template Template cần render
   * @param context Context chứa dữ liệu để điền vào template
   * @returns Object chứa subject và content đã được render
   * @throws Error nếu thiếu context key bắt buộc hoặc lỗi render
   */
  public render(template: Template, context: NotificationContext): { subject: string; content: string } {
    // Kiểm tra context có đủ các key bắt buộc không
    const contextKeys = Array.from(template.requiredContextKeys);
    const missingKeys = context.getMissingRequiredKeys(contextKeys);
    if (missingKeys.length > 0) {
      throw new Error(`Missing required context keys: ${missingKeys.join(', ')}`);
    }

    // Render subject
    const renderedSubject = this.renderString(template.subject, context);

    // Render content
    const renderedContent = this.renderString(template.content, context);

    return {
      subject: renderedSubject,
      content: renderedContent,
    };
  }

  /**
   * Render một đoạn text với context cho trước
   * @param text Text cần render
   * @param context Context chứa dữ liệu để điền vào text
   * @returns Text đã được render
   */
  private renderString(text: string, context: NotificationContext): string {
    // Simple placeholder replacement implementation
    // Format: {{key}}
    return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const trimmedKey = key.trim();
      if (!context.hasKey(trimmedKey)) {
        return match; // Giữ nguyên nếu key không tồn tại
      }
      const value = context.getValue(trimmedKey);
      return value !== null && value !== undefined ? String(value) : '';
    });
  }
}
