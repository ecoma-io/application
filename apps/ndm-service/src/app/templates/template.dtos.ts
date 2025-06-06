import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseSucessResponseDataDTO, BaseSucessResponseDatasDTO } from '@ecoma/common';

export class TemplateCreateDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  bodyHtml: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bodyText?: string;

  @ApiProperty({ required: true, type: [String] })
  @IsArray()
  @IsString({ each: true })
  placeholders: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  layout?: string;
}

export class TemplateUpdateDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bodyHtml?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bodyText?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  placeholders?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  layout?: string;
}

export class TemplateResponseDataDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  bodyHtml: string;
  @ApiProperty({ required: false })
  bodyText?: string;
  @ApiProperty({ type: [String] })
  placeholders: string[];
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ required: false })
  layout?: string;
}

export class TemplateResponseDto extends BaseSucessResponseDataDTO<TemplateResponseDataDto> {
}

export class TemplateListResponseDto extends BaseSucessResponseDatasDTO<TemplateResponseDataDto> {}
