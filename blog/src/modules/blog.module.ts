import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from '../controllers/blog.controller';
import { BlogService } from '../services/blog.service';
import { BlogSchema } from '../schemas/blog.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
