import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '../schemas/blog.schema';
import { firstValueFrom } from 'rxjs';
import { getEurekaClient } from '../eureka/eureka.client';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    private readonly httpService: HttpService,
  ) {}

  // Simple GET
  async get(id: string) {
    return this.blogModel.findById(id).exec();
  }

  // GET ALL simple
  async getAllSimple() {
    return this.blogModel.find().exec();
  }

  // GET ALL avec pagination
  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.blogModel.find().skip(skip).limit(limit).exec(),
      this.blogModel.countDocuments().exec(),
    ]);
    return { data, total, page, limit };
  }

  // GET par auteur
  async getByAuthor(author: string) {
    return this.blogModel.find({ author }).exec();
  }

  // GET par tag
  async getByTag(tag: string) {
    return this.blogModel.find({ tags: tag }).exec();
  }

  // Search
  async search(term: string) {
    const regex = new RegExp(term, 'i');
    return this.blogModel.find({
      $or: [{ title: regex }, { content: regex }],
    }).exec();
  }

  // CREATE
  async create(data: any) {
    const blog = new this.blogModel(data);
    return blog.save();
  }

  // UPDATE
  async update(id: string, data: any) {
    return this.blogModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // DELETE
  async delete(id: string) {
    return this.blogModel.findByIdAndDelete(id).exec();
  }

  // DELETE par auteur
  async deleteByAuthor(author: string) {
    return this.blogModel.deleteMany({ author }).exec();
  }

  // PUBLISH
  async publish(id: string) {
    return this.blogModel.findByIdAndUpdate(id, { status: 'PUBLISHED' }, { new: true }).exec();
  }

  // ARCHIVE
  async archive(id: string) {
    return this.blogModel.findByIdAndUpdate(id, { status: 'ARCHIVED' }, { new: true }).exec();
  }

  async getUserComplaintsFromReviews(userId: number) {
    // Resolve reviews service via Eureka, fallback to env/localhost
    const eureka = getEurekaClient();
    const reviewsBaseUrl =
      eureka?.getServiceUrl('REVIEWS') ??
      process.env.REVIEWS_BASE_URL ??
      'http://localhost:8084';

    const response = await firstValueFrom(
      this.httpService.get(`${reviewsBaseUrl}/api/complaints/user/${userId}`),
    );
    return response.data;
  }
}
