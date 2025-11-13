import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Template Document Interface
 * Templates are pre-configured project designs that users can clone
 */
export interface ITemplate extends Document {
  name: string;
  description: string;
  category: string;
  author_id: Types.ObjectId;
  project_data: Record<string, any>;
  thumbnail_url?: string;
  downloads: number;
  rating: number;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
  popularity_score: number;
  incrementDownloads(): Promise<void>;
}

/**
 * Template Schema
 */
const templateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
      minlength: [3, 'Template name must be at least 3 characters'],
      maxlength: [200, 'Template name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Template description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
      enum: {
        values: ['kitchen', 'bathroom', 'bedroom', 'living-room', 'office', 'garage', 'custom'],
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author ID is required'],
      index: true,
    },
    project_data: {
      type: Schema.Types.Mixed,
      required: [true, 'Project data is required'],
      validate: {
        validator: function (value: any) {
          // Basic validation to ensure project_data has required fields
          if (!value || typeof value !== 'object') {
            return false;
          }
          
          // Check for required top-level fields
          if (!value.project_type || !value.dimensions || !value.material) {
            return false;
          }
          
          // Validate dimensions object has required fields
          if (!value.dimensions.width || !value.dimensions.height || !value.dimensions.depth) {
            return false;
          }
          
          // Validate material object has required fields
          if (!value.material.type || value.material.thickness === undefined) {
            return false;
          }
          
          return true;
        },
        message: 'Project data must include project_type, dimensions (width, height, depth), and material (type, thickness)',
      },
    },
    thumbnail_url: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+/,
        'Thumbnail URL must be a valid HTTP/HTTPS URL',
      ],
    },
    downloads: {
      type: Number,
      default: 0,
      min: [0, 'Downloads cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be greater than 5'],
    },
    is_public: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

/**
 * Indexes for performance
 */
templateSchema.index({ category: 1, is_public: 1 });
templateSchema.index({ author_id: 1, created_at: -1 });
templateSchema.index({ downloads: -1 });
templateSchema.index({ rating: -1 });
templateSchema.index({ name: 'text', description: 'text' });

/**
 * Virtual for popularity score (combines downloads and rating)
 */
templateSchema.virtual('popularity_score').get(function () {
  return this.downloads * 0.7 + this.rating * 100 * 0.3;
});

/**
 * Method to increment download count
 */
templateSchema.methods.incrementDownloads = async function (): Promise<void> {
  this.downloads += 1;
  await this.save();
};

/**
 * Transform output
 */
templateSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    const { __v, ...rest } = ret;
    return rest;
  },
});

templateSchema.set('toObject', {
  virtuals: true,
});

export const Template = mongoose.model<ITemplate>('Template', templateSchema);
