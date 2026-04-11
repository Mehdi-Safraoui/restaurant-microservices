import { Schema, Document } from 'mongoose';

export const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: { type: String, default: 'DRAFT', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  },
);

export interface Blog extends Document {
  title: string;
  content: string;
  author: string;
  tags: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
