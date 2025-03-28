import { v4 as uuidv4 } from 'uuid';
import { TranslationSet, TranslationSetNameAlreadyExistsException } from '@ecoma/domains/lzm/lzm-domain';
import { CreateTranslationSetCommand } from '../../../dtos/commands/translation-set.commands';
import { TranslationSetDto } from '../../../dtos/responses/translation-set.responses';
import { ILzmPersistencePort } from '../../../interfaces/persistence/lzm-persistence.port';
import { ILzmMessageBrokerPort } from '../../../interfaces/message-broker/lzm-message-broker.port';

/**
 * Handler xử lý command tạo mới một TranslationSet
 */
export class CreateTranslationSetHandler {
  /**
   * Khởi tạo handler
   * @param persistence Port persistence cho LZM
   * @param messageBroker Port message broker cho LZM
   */
  constructor(
    private readonly persistence: ILzmPersistencePort,
    private readonly messageBroker: ILzmMessageBrokerPort
  ) {}

  /**
   * Xử lý command tạo mới một TranslationSet
   * @param command Command chứa thông tin tạo mới
   * @returns Promise với DTO của TranslationSet đã tạo
   * @throws TranslationSetNameAlreadyExistsException nếu tên đã tồn tại
   */
  async execute(command: CreateTranslationSetCommand): Promise<TranslationSetDto> {
    // Kiểm tra tên đã tồn tại chưa
    const existingSet = await this.persistence.translationSetRepository.findByName(command.name);
    if (existingSet) {
      throw new TranslationSetNameAlreadyExistsException(command.name);
    }

    // Tạo ID mới
    const id = uuidv4();

    // Tạo đối tượng TranslationSet mới
    const translationSet = TranslationSet.create(
      id,
      command.name,
      command.description
    );

    // Lưu vào database
    await this.persistence.translationSetRepository.save(translationSet);

    // Phát các domain events
    const domainEvents = translationSet.clearEvents();
    for (const event of domainEvents) {
      await this.messageBroker.publishTranslationSetEvent(event);
    }

    // Trả về DTO
    return {
      id: translationSet.id,
      name: translationSet.name,
      description: translationSet.description,
      isActive: translationSet.isActive,
      createdAt: translationSet.createdAt,
      updatedAt: translationSet.updatedAt,
      keyCount: 0 // Tập mới không có khóa nào
    };
  }
}
