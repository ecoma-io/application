import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ILzmPersistencePort } from '@ecoma/domains/lzm/lzm-application';
import { ITranslationKeyRepository, ITranslationRepository, ITranslationSetRepository } from '@ecoma/domains/lzm/lzm-domain';
import { TypeOrmTranslationSetRepository } from './typeorm/repositories/translation-set.repository';
import { TypeOrmTranslationKeyRepository } from './typeorm/repositories/translation-key.repository';
import { TypeOrmTranslationRepository } from './typeorm/repositories/translation.repository';

/**
 * Adapter triển khai ILzmPersistencePort sử dụng TypeORM
 */
@Injectable()
export class LzmPersistenceAdapter implements ILzmPersistencePort {
  /**
   * Repository cho TranslationSet
   */
  public readonly translationSetRepository: ITranslationSetRepository;

  /**
   * Repository cho TranslationKey
   */
  public readonly translationKeyRepository: ITranslationKeyRepository;

  /**
   * Repository cho Translation
   */
  public readonly translationRepository: ITranslationRepository;

  /**
   * Khởi tạo adapter
   * @param dataSource TypeORM DataSource
   * @param translationSetRepository Repository cho TranslationSet
   * @param translationKeyRepository Repository cho TranslationKey
   * @param translationRepository Repository cho Translation
   */
  constructor(
    private readonly dataSource: DataSource,
    translationSetRepository: TypeOrmTranslationSetRepository,
    translationKeyRepository: TypeOrmTranslationKeyRepository,
    translationRepository: TypeOrmTranslationRepository
  ) {
    this.translationSetRepository = translationSetRepository;
    this.translationKeyRepository = translationKeyRepository;
    this.translationRepository = translationRepository;
  }

  /**
   * Bắt đầu một transaction mới
   * @returns Promise với QueryRunner object
   */
  async startTransaction(): Promise<unknown> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  /**
   * Commit một transaction
   * @param transaction QueryRunner object
   * @returns Promise void
   */
  async commitTransaction(transaction: unknown): Promise<void> {
    const queryRunner = transaction as any;
    await queryRunner.commitTransaction();
    await queryRunner.release();
  }

  /**
   * Rollback một transaction
   * @param transaction QueryRunner object
   * @returns Promise void
   */
  async rollbackTransaction(transaction: unknown): Promise<void> {
    const queryRunner = transaction as any;
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  }
}
