import { ITranslationKeyRepository, ITranslationRepository, ITranslationSetRepository } from '@ecoma/domains/lzm/lzm-domain';

/**
 * Interface định nghĩa tất cả các port persistence cho LZM
 */
export interface ILzmPersistencePort {
  /**
   * Repository cho TranslationSet
   */
  readonly translationSetRepository: ITranslationSetRepository;

  /**
   * Repository cho TranslationKey
   */
  readonly translationKeyRepository: ITranslationKeyRepository;

  /**
   * Repository cho Translation
   */
  readonly translationRepository: ITranslationRepository;

  /**
   * Bắt đầu một transaction mới
   * @returns Promise với transaction object
   */
  startTransaction(): Promise<unknown>;

  /**
   * Commit một transaction
   * @param transaction Transaction object
   * @returns Promise void
   */
  commitTransaction(transaction: unknown): Promise<void>;

  /**
   * Rollback một transaction
   * @param transaction Transaction object
   * @returns Promise void
   */
  rollbackTransaction(transaction: unknown): Promise<void>;
}
