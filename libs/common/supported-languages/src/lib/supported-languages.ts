export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "vi", name: "Tiếng Việt" },
  // { code: 'fr', name: 'Français' },
  // { code: 'de', name: 'Deutsch' },
  // { code: 'es', name: 'Español' },
  // { code: 'pt', name: 'Português' },
  // { code: 'it', name: 'Italiano' },
  // { code: 'ru', name: 'Русский' },
  // { code: 'ja', name: '日本語' },
  // { code: 'ko', name: '한국어' },
  // { code: 'zh', name: '中文' },
  // { code: 'th', name: 'ไทย' },
  // { code: 'id', name: 'Bahasa Indonesia' },
  // { code: 'ms', name: 'Bahasa Melayu' },
  // { code: 'hi', name: 'हिन्दी' },
  // { code: 'ar', name: 'العربية' },
  // { code: 'tr', name: 'Türkçe' },
  // { code: 'pl', name: 'Polski' },
  // { code: 'nl', name: 'Nederlands' },
  // { code: 'sv', name: 'Svenska' },
  // { code: 'fi', name: 'Suomi' },
  // { code: 'no', name: 'Norsk' },
  // { code: 'da', name: 'Dansk' },
  // { code: 'cs', name: 'Čeština' },
  // { code: 'ro', name: 'Română' },
  // { code: 'hu', name: 'Magyar' },
  // { code: 'he', name: 'עברית' },
  // { code: 'uk', name: 'Українська' },
  // { code: 'el', name: 'Ελληνικά' }
];

// Lấy tên ngôn ngữ theo code
export function getLanguageNameByCode(code: string): string | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)?.name;
}

// Kiểm tra xem code có được hỗ trợ không
export function isSupportedLanguage(code: string): boolean {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}

// Trả về danh sách tất cả code ngôn ngữ
export function getAllLanguageCodes(): string[] {
  return SUPPORTED_LANGUAGES.map((lang) => lang.code);
}

// Trả về danh sách tất cả tên ngôn ngữ
export function getAllLanguageNames(): string[] {
  return SUPPORTED_LANGUAGES.map((lang) => lang.name);
}
