import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Organization,
  IOrganizationRepository,
  IUserRepository,
  OrganizationSlug,
  Membership
} from '@ecoma/iam-domain';
import { CreateOrganizationCommand } from './create-organization.command';
import { IOrganizationDto, OrganizationDto } from '../../../dtos';
import { IBumClient } from '../../../interfaces';
import {
  UserNotFoundError,
  OrganizationSlugAlreadyExistsError,
  OrganizationNameAlreadyExistsError
} from '../../../errors';

/**
 * Handler xử lý command tạo tổ chức.
 */
@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler implements ICommandHandler<CreateOrganizationCommand, OrganizationDto> {
  /**
   * Constructor.
   * @param organizationRepository - Repository làm việc với Organization
   * @param userRepository - Repository làm việc với User
   * @param bumClient - Client giao tiếp với BUM BC
   */
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,

    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('IBumClient')
    private readonly bumClient: IBumClient
  ) {}

  /**
   * Xử lý command tạo tổ chức.
   * @param command - Command tạo tổ chức
   * @returns OrganizationDto - Thông tin tổ chức đã tạo
   */
  async execute(command: CreateOrganizationCommand): Promise<OrganizationDto> {
    // Kiểm tra người dùng tạo tổ chức có tồn tại không
    const owner = await this.userRepository.findById(command.ownerId);
    if (!owner) {
      throw new UserNotFoundError();
    }

    // Chuyển đổi slug thành value object
    const slug = new OrganizationSlug(command.slug);

    // Kiểm tra slug đã tồn tại chưa
    const slugExists = await this.organizationRepository.existsBySlug(slug);
    if (slugExists) {
      throw new OrganizationSlugAlreadyExistsError(command.slug);
    }

    // Kiểm tra tên đã tồn tại chưa
    const existingOrg = await this.organizationRepository.findByName(command.name);
    if (existingOrg) {
      throw new OrganizationNameAlreadyExistsError(command.name);
    }

    // Tạo tổ chức mới
    const organizationResult = Organization.create(
      command.name,
      slug,
      command.country,
      command.logoAssetId
    );

    if (organizationResult.isFailure) {
      throw new Error('Failed to create organization');
    }

    const organization = organizationResult.getValue();

    // Tạo membership cho chủ sở hữu (vai trò "owner")
    const ownerMembershipResult = Membership.createOwner(
      command.ownerId,
      organization.idValue
    );

    if (ownerMembershipResult.isFailure) {
      throw new Error('Failed to create owner membership');
    }

    const ownerMembership = ownerMembershipResult.getValue();

    // Thêm thành viên vào tổ chức
    organization.addMember(ownerMembership);

    // Lưu tổ chức
    await this.organizationRepository.save(organization);

    // Chuyển đổi thành DTO
    const orgData: IOrganizationDto = {
      id: organization.idValue,
      name: organization.name,
      slug: organization.slug.toString(),
      status: organization.status,
      country: organization.country,
      logoAssetId: organization.logoAssetId,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt
    };

    return new OrganizationDto(orgData);
  }
}
