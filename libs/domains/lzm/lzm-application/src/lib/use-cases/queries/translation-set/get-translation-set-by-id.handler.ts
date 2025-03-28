import { TranslationSetNotFoundException } from '@ecoma/domains/lzm/lzm-domain';
import { GetTranslationSetByIdQuery } from '../../../dtos/queries/translation-set.queries';
import { TranslationKeyBasicDto, TranslationSetDto } from '../../../dtos/responses/translation-set.responses';
import { ILzmPersistencePort } from '../../../interfaces/persistence/lzm-persistence.port';

/**
 * Handler xử lý query lấy thông tin TranslationSet theo ID
 */
export class GetTranslationSetByIdHandler {
  /**
   * Khởi tạo handler
   * @param persistence Port persistence cho LZM
   */
  constructor(
    private readonly persistence: ILzmPersistencePort
  ) {}

  /**
   * Xử lý query lấy thông tin TranslationSet theo ID
   * @param query Query chứa ID cần tìm
   * @returns Promise với DTO của TranslationSet
   * @throws TranslationSetNotFoundException nếu không tìm thấy
   */
  async execute(query: GetTranslationSetByIdQuery): Promise<TranslationSetDto> {
    // Tìm TranslationSet theo ID
    const translationSet = await this.persistence.translationSetRepository.findById(query.id);
    if (!translationSet) {
      throw new TranslationSetNotFoundException(query.id);
    }

    // Tạo DTO cơ bản
    const result: TranslationSetDto = {
      id: translationSet.id,
      name: translationSet.name,
      description: translationSet.description,
      isActive: translationSet.isActive,
      createdAt: translationSet.createdAt,
      updatedAt: translationSet.updatedAt,
      keyCount: translationSet.translationKeys.length
    };

    // Nếu yêu cầu bao gồm danh sách khóa
    if (query.includeKeys) {
      result.keys = translationSet.translationKeys.map(key => ({
        id: key.id,
        key: key.key,
        description: key.description,
        sourceContent: key.sourceContent,
        status: key.status
      }));
    }

    return result;
  }
}
