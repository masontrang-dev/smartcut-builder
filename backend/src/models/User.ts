import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Workshop Profile Interface
 * Tracks user's available tools for customized build instructions
 */
export interface IWorkshopProfile {
  saw: boolean;
  router: boolean;
  jig_saw: boolean;
  table_saw: boolean;
  miter_saw: boolean;
  planer: boolean;
  jointer: boolean;
}

/**
 * User Document Interface
 */
export interface IUser extends Document {
  email: string;
  password_hash: string;
  name: string;
  workshop_profile: IWorkshopProfile;
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Workshop Profile Schema
 */
const workshopProfileSchema = new Schema<IWorkshopProfile>(
  {
    saw: { type: Boolean, default: false },
    router: { type: Boolean, default: false },
    jig_saw: { type: Boolean, default: false },
    table_saw: { type: Boolean, default: false },
    miter_saw: { type: Boolean, default: false },
    planer: { type: Boolean, default: false },
    jointer: { type: Boolean, default: false },
  },
  { _id: false }
);

/**
 * User Schema
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    password_hash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    workshop_profile: {
      type: workshopProfileSchema,
      default: () => ({
        saw: false,
        router: false,
        jig_saw: false,
        table_saw: false,
        miter_saw: false,
        planer: false,
        jointer: false,
      }),
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
 * Pre-save hook to hash password
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Method to compare password with hash
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

/**
 * Transform output to remove sensitive data
 */
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { password_hash, __v, ...rest } = ret;
    return rest;
  },
});

/**
 * Indexes for performance
 * Note: email index is already created via unique: true in schema
 */
userSchema.index({ created_at: -1 });

export const User = mongoose.model<IUser>('User', userSchema);
