import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlogController } from '../controllers/blog.controller';
import { BlogService } from '../services/blog.service';

@Module({
  imports: [HttpModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}

