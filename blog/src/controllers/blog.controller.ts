import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogService } from '../services/blog.service';

@Controller('/blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Routes spéciales d'abord
  @Get()
  getAllSimple() {
    return this.blogService.getAllSimple();
  }

  @Get('search/:term')
  search(@Param('term') term: string) {
    return this.blogService.search(term);
  }

  @Get('author/:author')
  getByAuthor(@Param('author') author: string) {
    return this.blogService.getByAuthor(author);
  }

  @Get('tag/:tag')
  getByTag(@Param('tag') tag: string) {
    return this.blogService.getByTag(tag);
  }

  // Routes principales
  @Get()
  getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.blogService.getAll(page, limit);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.blogService.get(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: any) {
    return this.blogService.create(data);
  }

  @Put(':id/publish')
  publish(@Param('id') id: string) {
    return this.blogService.publish(Number(id));
  }

  @Put(':id/archive')
  archive(@Param('id') id: string) {
    return this.blogService.archive(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.blogService.update(Number(id), data);
  }

  @Delete('author/:author')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteByAuthor(@Param('author') author: string) {
    return this.blogService.deleteByAuthor(author);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.blogService.delete(Number(id));
  }
}
