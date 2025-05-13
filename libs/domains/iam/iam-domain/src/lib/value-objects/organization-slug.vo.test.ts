import { OrganizationSlug } from './organization-slug.vo';

describe('OrganizationSlug', () => {
  describe('create', () => {
    it('nên tạo một OrganizationSlug hợp lệ', () => {
      // Arrange & Act
      const slug = OrganizationSlug.create('valid-organization-slug');

      // Assert
      expect(slug).toBeDefined();
      expect(slug.value).toBe('valid-organization-slug');
    });

    it('nên chuyển đổi slug sang chữ thường', () => {
      // Arrange & Act
      const slug = OrganizationSlug.create('Valid-Organization-Slug');

      // Assert
      expect(slug.value).toBe('valid-organization-slug');
    });

    it('nên ném lỗi khi slug không được cung cấp', () => {
      // Arrange, Act & Assert
      expect(() => {
        OrganizationSlug.create('');
      }).toThrow();

      expect(() => {
        OrganizationSlug.create(null as unknown as string);
      }).toThrow();

      expect(() => {
        OrganizationSlug.create(undefined as unknown as string);
      }).toThrow();
    });

    it('nên ném lỗi khi slug không theo định dạng kebab-case', () => {
      // Arrange, Act & Assert
      expect(() => {
        OrganizationSlug.create('InvalidSlug');
      }).toThrow();

      expect(() => {
        OrganizationSlug.create('invalid_slug');
      }).toThrow();

      expect(() => {
        OrganizationSlug.create('invalid slug');
      }).toThrow();

      expect(() => {
        OrganizationSlug.create('invalid.slug');
      }).toThrow();
    });
  });
});
