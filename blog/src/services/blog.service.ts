import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BlogService {
  private blogs: any[] = [];
  private idCounter = 1;

  constructor(private readonly httpService: HttpService) {}

  // Simple GET
  get(id: number) {
    return this.blogs.find(b => b.id === id);
  }

  // GET ALL simple
  getAllSimple() {
    return [...this.blogs];
  }

  // GET ALL avec pagination
  getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const data = this.blogs.slice(skip, skip + limit);
    return {
      data,
      total: this.blogs.length,
      page,
      limit,
    };
  }

  // GET par auteur
  getByAuthor(author: string) {
    return this.blogs.filter(b => b.author === author);
  }

  // GET par tag
  getByTag(tag: string) {
    return this.blogs.filter(b => b.tags?.includes(tag));
  }

  // Search
  search(term: string) {
    return this.blogs.filter(b =>
      b.title?.includes(term) || b.content?.includes(term)
    );
  }

  // CREATE
  create(data: any) {
    const blog = {
      id: this.idCounter++,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogs.push(blog);
    return blog;
  }

  // UPDATE
  update(id: number, data: any) {
    const blog = this.blogs.find(b => b.id === id);
    if (!blog) return null;

    const updated = { ...blog, ...data, updatedAt: new Date() };
    const index = this.blogs.indexOf(blog);
    this.blogs[index] = updated;
    return updated;
  }

  // DELETE
  delete(id: number) {
    const index = this.blogs.findIndex(b => b.id === id);
    if (index === -1) return null;
    const [deleted] = this.blogs.splice(index, 1);
    return deleted;
  }

  // DELETE par auteur
  deleteByAuthor(author: string) {
    this.blogs = this.blogs.filter(b => b.author !== author);
  }

  // PUBLISH
  publish(id: number) {
    return this.update(id, { status: 'PUBLISHED' });
  }

  // ARCHIVE
  archive(id: number) {
    return this.update(id, { status: 'ARCHIVED' });
  }

  async getUserComplaintsFromReviews(userId: number) {
    const reviewsBaseUrl = process.env.REVIEWS_BASE_URL ?? 'http://localhost:8084';
    const response = await firstValueFrom(
      this.httpService.get(`${reviewsBaseUrl}/api/complaints/user/${userId}`),
    );
    return response.data;
  }
}
