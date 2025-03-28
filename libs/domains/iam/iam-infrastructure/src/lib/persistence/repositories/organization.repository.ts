import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, IOrganizationRepository, OrganizationSlug } from '@ecoma/iam-domain';
import { OrganizationMapper } from '../typeorm/mappers/organization.mapper';
import { MembershipMapper } from '../typeorm/mappers/membership.mapper';
import { OrganizationEntity } from '../typeorm/entities/organization.entity';
import { MembershipEntity } from '../typeorm/entities/membership.entity';
import { ILogger } from '@ecoma/common-application';

/**
 * Triển khai OrganizationRepository sử dụng TypeORM.
 */
@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
  /**
   * Constructor.
   * @param organizationRepository - TypeORM repository cho Organization
   * @param membershipRepository - TypeORM repository cho Membership
   * @param logger - Logger service
   */
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,

    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,

    @Inject('ILogger')
    private readonly logger: ILogger
  ) {}

  /**
   * Tìm Organization theo ID.
   * @param id - ID của Organization
   * @returns Promise<Organization | null> - Organization nếu tìm thấy, null nếu không
   */
  async findById(id: string): Promise<Organization | null> {
    this.logger.debug('Tìm Organization theo ID', { id });

    try {
      const entity = await this.organizationRepository.findOne({ where: { id } });

      if (!entity) {
        this.logger.debug('Không tìm thấy Organization với ID', { id });
        return null;
      }

      this.logger.debug('Đang lấy thành viên của Organization', { organizationId: id });
      const memberEntities = await this.membershipRepository.find({
        where: { organizationId: id }
      });

      const members = memberEntities.map(m => MembershipMapper.toDomain(m));

      this.logger.debug('Đã tìm thấy Organization với ID', {
        id,
        name: entity.name,
        membersCount: members.length
      });

      return OrganizationMapper.toDomain(entity, members);
    } catch (error) {
      this.logger.error('Lỗi khi tìm Organization theo ID', error as Error, { id });
      throw error;
    }
  }

  /**
   * Tìm Organization theo tên.
   * @param name - Tên Organization cần tìm
   * @returns Promise<Organization | null> - Organization nếu tìm thấy, null nếu không
   */
  async findByName(name: string): Promise<Organization | null> {
    this.logger.debug('Tìm Organization theo tên', { name });

    try {
      const entity = await this.organizationRepository.findOne({ where: { name } });

      if (!entity) {
        this.logger.debug('Không tìm thấy Organization với tên', { name });
        return null;
      }

      this.logger.debug('Đang lấy thành viên của Organization', {
        organizationId: entity.id,
        name
      });

      const memberEntities = await this.membershipRepository.find({
        where: { organizationId: entity.id }
      });

      const members = memberEntities.map(m => MembershipMapper.toDomain(m));

      this.logger.debug('Đã tìm thấy Organization với tên', {
        name,
        id: entity.id,
        membersCount: members.length
      });

      return OrganizationMapper.toDomain(entity, members);
    } catch (error) {
      this.logger.error('Lỗi khi tìm Organization theo tên', error as Error, { name });
      throw error;
    }
  }

  /**
   * Tìm Organization theo slug.
   * @param slug - Slug của Organization cần tìm
   * @returns Promise<Organization | null> - Organization nếu tìm thấy, null nếu không
   */
  async findBySlug(slug: OrganizationSlug): Promise<Organization | null> {
    this.logger.debug('Tìm Organization theo slug', { slug: slug.value });

    try {
      const entity = await this.organizationRepository.findOne({
        where: { slug: slug.value }
      });

      if (!entity) {
        this.logger.debug('Không tìm thấy Organization với slug', { slug: slug.value });
        return null;
      }

      this.logger.debug('Đang lấy thành viên của Organization', {
        organizationId: entity.id,
        slug: slug.value
      });

      const memberEntities = await this.membershipRepository.find({
        where: { organizationId: entity.id }
      });

      const members = memberEntities.map(m => MembershipMapper.toDomain(m));

      this.logger.debug('Đã tìm thấy Organization với slug', {
        slug: slug.value,
        id: entity.id,
        name: entity.name,
        membersCount: members.length
      });

      return OrganizationMapper.toDomain(entity, members);
    } catch (error) {
      this.logger.error('Lỗi khi tìm Organization theo slug', error as Error, { slug: slug.value });
      throw error;
    }
  }

  /**
   * Kiểm tra xem slug đã tồn tại chưa.
   * @param slug - Slug cần kiểm tra
   * @returns Promise<boolean> - true nếu slug đã tồn tại, false nếu chưa
   */
  async existsBySlug(slug: OrganizationSlug): Promise<boolean> {
    this.logger.debug('Kiểm tra tồn tại của slug', { slug: slug.value });

    try {
      const count = await this.organizationRepository.count({
        where: { slug: slug.value }
      });

      const exists = count > 0;
      this.logger.debug('Kết quả kiểm tra tồn tại của slug', {
        slug: slug.value,
        exists
      });

      return exists;
    } catch (error) {
      this.logger.error('Lỗi khi kiểm tra tồn tại của slug', error as Error, { slug: slug.value });
      throw error;
    }
  }

  /**
   * Lưu Organization.
   * @param organization - Organization cần lưu
   * @returns Promise<Organization> - Organization đã lưu
   */
  async save(organization: Organization): Promise<Organization> {
    this.logger.debug('Lưu Organization', {
      id: organization.id,
      name: organization.name,
      membersCount: organization.members.length
    });

    try {
      const entity = OrganizationMapper.toPersistence(organization);
      const savedEntity = await this.organizationRepository.save(entity);

      this.logger.debug('Lưu các thành viên của Organization', {
        organizationId: organization.id,
        membersCount: organization.members.length
      });

      // Lưu các thành viên
      await Promise.all(
        organization.members.map(member => {
          const memberEntity = MembershipMapper.toPersistence(member);
          return this.membershipRepository.save(memberEntity);
        })
      );

      // Lấy lại danh sách thành viên đã cập nhật
      const memberEntities = await this.membershipRepository.find({
        where: { organizationId: organization.id }
      });

      const members = memberEntities.map(m => MembershipMapper.toDomain(m));

      this.logger.debug('Organization đã được lưu thành công', {
        id: savedEntity.id,
        name: savedEntity.name,
        updatedMembersCount: members.length
      });

      return OrganizationMapper.toDomain(savedEntity, members);
    } catch (error) {
      this.logger.error('Lỗi khi lưu Organization', error as Error, {
        id: organization.id,
        name: organization.name
      });
      throw error;
    }
  }

  /**
   * Xóa Organization.
   * @param organization - Organization cần xóa
   * @returns Promise<void>
   */
  async delete(organization: Organization): Promise<void> {
    this.logger.info('Xóa Organization', {
      id: organization.id,
      name: organization.name
    });

    try {
      // Xóa tất cả thành viên của tổ chức
      const memberResult = await this.membershipRepository.delete({ organizationId: organization.id });
      this.logger.debug('Đã xóa các thành viên của Organization', {
        organizationId: organization.id,
        membersDeleted: memberResult.affected || 0
      });

      // Xóa tổ chức
      await this.organizationRepository.delete(organization.id);
      this.logger.info('Organization đã được xóa thành công', {
        id: organization.id,
        name: organization.name
      });
    } catch (error) {
      this.logger.error('Lỗi khi xóa Organization', error as Error, {
        id: organization.id,
        name: organization.name
      });
      throw error;
    }
  }
}
