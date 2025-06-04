import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { TemplateCreateDto, TemplateUpdateDto, TemplateResponseDto, TemplateListResponseDto } from './template.dtos';

@ApiTags('Templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification template' })
  @ApiResponse({ status: 201, type: TemplateResponseDto })
  @ApiResponse({ status: 409, description: 'Template with this name already exists' })
  async create(@Body() dto: TemplateCreateDto): Promise<TemplateResponseDto> {
    return this.templateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notification templates' })
  @ApiResponse({ status: 200, type: TemplateListResponseDto })
  async findAll(): Promise<TemplateListResponseDto> {
    return this.templateService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a notification template by name' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findByName(@Param('name') name: string): Promise<TemplateResponseDto> {
    return this.templateService.findByName(name);
  }

  @Put(':name')
  @ApiOperation({ summary: 'Update a notification template by name' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(@Param('name') name: string, @Body() dto: TemplateUpdateDto): Promise<TemplateResponseDto> {
    return this.templateService.update(name, dto);
  }

  @Delete(':name')
  @ApiOperation({ summary: 'Delete a notification template by name' })
  @ApiResponse({ status: 200, type: Object })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async delete(@Param('name') name: string): Promise<{ success: boolean }> {
    return this.templateService.delete(name);
  }
}
