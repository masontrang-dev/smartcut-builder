import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Material Interface
 */
export interface IMaterial {
  type: string;
  thickness: number;
  grade?: string;
  sheet_size?: string;
}

/**
 * Frame Interface
 */
export interface IFrame {
  has_face_frame: boolean;
  stile_width?: number;
  rail_width?: number;
}

/**
 * Dimensions Interface
 */
export interface IDimensions {
  width: number;
  height: number;
  depth: number;
  material_thickness?: number;
  back_panel_thickness?: number;
  toe_kick_height?: number;
  frame?: IFrame;
}

/**
 * Drawer Configuration Interface
 */
export interface IDrawer {
  quantity: number;
  type?: 'overlay' | 'inset' | 'full-overlay';
  slide_type?: 'undermount' | 'side-mount' | 'center-mount' | 'euro';
  gap_between_drawers?: number;
  construction?: 'dovetail' | 'box-joint' | 'rabbet' | 'dado';
}

/**
 * Door Configuration Interface
 */
export interface IDoor {
  quantity: number;
  type?: 'inset' | 'overlay' | 'full-overlay';
  panel_type?: 'shaker' | 'flat-panel' | 'raised-panel' | 'slab' | 'glass' | 'louvered';
  gap_between_doors?: number;
  hinge_type?: 'concealed' | 'butt' | 'european' | 'piano' | 'inset';
  swing_direction?: 'left' | 'right' | 'up' | 'down' | 'bi-fold';
}

/**
 * Hardware Interface
 */
export interface IHardware {
  hinges?: {
    type?: 'concealed' | 'butt' | 'european' | 'piano';
    count?: number;
    overlay?: number;
  };
  drawer_slides?: {
    type?: 'side-mount' | 'under-mount' | 'center-mount';
    extension?: 'full' | 'three-quarter' | 'half';
    soft_close?: boolean;
  };
  handles?: {
    type?: 'knob' | 'pull' | 'bar' | 'cup' | 'integrated' | 'none';
    position?: 'default' | 'top' | 'bottom' | 'center' | 'custom';
    finish?: string;
    center_to_center?: number;
  };
  latches?: {
    type?: 'magnetic' | 'roller' | 'touch' | 'none';
    count?: number;
  };
}

/**
 * Finish Interface
 */
export interface IFinish {
  color?: string;
  gloss?: string;
}

/**
 * Custom Features - Top Interface
 */
export interface ITop {
  height?: number;
  thickness?: number;
  float?: boolean;
  overhang?: number;
  edge_style?: 'square' | 'beveled' | 'rounded';
}

/**
 * Custom Features - Front Interface
 */
export interface IFront {
  panel_type?: 'shaker' | 'flat-panel' | 'raised-panel' | 'slab' | 'glass' | 'louvered';
  thickness?: number;
}

/**
 * Custom Features - Spline Interface
 */
export interface ISpline {
  depth?: number;
  width?: number;
}

/**
 * Custom Features - Accents Interface
 */
export interface IAccents {
  spline?: ISpline;
  groove?: boolean;
  inlay?: string;
}

/**
 * Custom Features - Legs Interface
 */
export interface ILegs {
  has_legs: boolean;
  type?: 'straight' | 'tapered' | 'turned' | 'bun' | 'bracket' | 'custom';
  height?: number;
  material?: string;
}

/**
 * Custom Features Interface
 */
export interface ICustomFeatures {
  top?: ITop;
  front?: IFront;
  accents?: IAccents;
  legs?: ILegs;
}

/**
 * Interior Configuration Interface
 */
export interface IInterior {
  adjustable_shelves?: number;
  dividers?: number;
  cable_management?: boolean;
}

/**
 * Cut List Item Interface
 */
export interface ICutListItem {
  part_name: string;
  quantity: number;
  width: number;
  height: number;
  thickness: number;
  material: string;
}

/**
 * Output Preferences Interface
 */
export interface IOutput {
  cut_list?: boolean;
  assembly_instructions?: boolean;
  '3d_preview'?: boolean;
  ar_preview?: boolean;
  export_formats?: ('pdf' | 'csv' | 'dxf' | 'sketchup' | 'stl')[];
}

/**
 * AI Guidance Interface
 */
export interface IAIGuidance {
  warnings?: string[];
  suggestions?: string[];
  rule_validation_passed?: boolean;
}

/**
 * Project Document Interface
 */
export interface IProject extends Document {
  user_id: Types.ObjectId;
  name: string;
  project_type: 'Base Cabinet' | 'Wall Cabinet' | 'Tall Cabinet' | 'Furniture' | 'Custom';
  units: 'imperial' | 'metric';
  material: IMaterial;
  joinery?: 'rabbet' | 'dado' | 'butt' | 'mortise-tenon' | 'dowel' | 'pocket-hole' | 'biscuit';
  back_panel?: 'recessed' | 'flush' | 'none';
  dimensions: IDimensions;
  drawers?: IDrawer[];
  doors?: IDoor[];
  hardware?: IHardware;
  finish?: IFinish;
  custom_features?: ICustomFeatures;
  interior?: IInterior;
  cut_list?: ICutListItem[];
  assembly_instructions?: string[];
  estimated_cost?: number;
  output?: IOutput;
  ai_guidance?: IAIGuidance;
  created_at: Date;
  updated_at: Date;
  version: number;
}

/**
 * Material Schema
 */
const materialSchema = new Schema<IMaterial>(
  {
    type: {
      type: String,
      required: [true, 'Material type is required'],
      trim: true,
    },
    thickness: {
      type: Number,
      required: [true, 'Material thickness is required'],
      min: [0, 'Thickness must be positive'],
    },
    grade: {
      type: String,
      trim: true,
    },
    sheet_size: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Frame Schema
 */
const frameSchema = new Schema<IFrame>(
  {
    has_face_frame: {
      type: Boolean,
      default: false,
    },
    stile_width: {
      type: Number,
      min: [0, 'Stile width must be positive'],
    },
    rail_width: {
      type: Number,
      min: [0, 'Rail width must be positive'],
    },
  },
  { _id: false }
);

/**
 * Dimensions Schema
 */
const dimensionsSchema = new Schema<IDimensions>(
  {
    width: {
      type: Number,
      required: [true, 'Width is required'],
      min: [0, 'Width must be positive'],
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [0, 'Height must be positive'],
    },
    depth: {
      type: Number,
      required: [true, 'Depth is required'],
      min: [0, 'Depth must be positive'],
    },
    material_thickness: {
      type: Number,
      min: [0, 'Material thickness must be positive'],
    },
    back_panel_thickness: {
      type: Number,
      min: [0, 'Back panel thickness must be positive'],
    },
    toe_kick_height: {
      type: Number,
      min: [0, 'Toe kick height must be positive'],
    },
    frame: frameSchema,
  },
  { _id: false }
);

/**
 * Drawer Schema
 */
const drawerSchema = new Schema<IDrawer>(
  {
    quantity: {
      type: Number,
      required: [true, 'Drawer quantity is required'],
      min: [0, 'Quantity must be non-negative'],
    },
    type: {
      type: String,
      enum: ['overlay', 'inset', 'full-overlay'],
    },
    slide_type: {
      type: String,
      enum: ['undermount', 'side-mount', 'center-mount', 'euro'],
    },
    gap_between_drawers: {
      type: Number,
      min: [0, 'Gap must be non-negative'],
    },
    construction: {
      type: String,
      enum: ['dovetail', 'box-joint', 'rabbet', 'dado'],
    },
  },
  { _id: false }
);

/**
 * Door Schema
 */
const doorSchema = new Schema<IDoor>(
  {
    quantity: {
      type: Number,
      required: [true, 'Door quantity is required'],
      min: [0, 'Quantity must be non-negative'],
    },
    type: {
      type: String,
      enum: ['inset', 'overlay', 'full-overlay'],
    },
    panel_type: {
      type: String,
      enum: ['shaker', 'flat-panel', 'raised-panel', 'slab', 'glass', 'louvered'],
    },
    gap_between_doors: {
      type: Number,
      min: [0, 'Gap must be non-negative'],
    },
    hinge_type: {
      type: String,
      enum: ['concealed', 'butt', 'european', 'piano', 'inset'],
    },
    swing_direction: {
      type: String,
      enum: ['left', 'right', 'up', 'down', 'bi-fold'],
    },
  },
  { _id: false }
);

/**
 * Hardware Schema
 */
const hardwareSchema = new Schema<IHardware>(
  {
    hinges: {
      type: {
        type: String,
        enum: ['concealed', 'butt', 'european', 'piano'],
      },
      count: {
        type: Number,
        min: [0, 'Count must be non-negative'],
      },
      overlay: {
        type: Number,
      },
    },
    drawer_slides: {
      type: {
        type: String,
        enum: ['side-mount', 'under-mount', 'center-mount'],
      },
      extension: {
        type: String,
        enum: ['full', 'three-quarter', 'half'],
      },
      soft_close: {
        type: Boolean,
      },
    },
    handles: {
      type: {
        type: String,
        enum: ['knob', 'pull', 'bar', 'cup', 'integrated', 'none'],
      },
      position: {
        type: String,
        enum: ['default', 'top', 'bottom', 'center', 'custom'],
      },
      finish: {
        type: String,
      },
      center_to_center: {
        type: Number,
      },
    },
    latches: {
      type: {
        type: String,
        enum: ['magnetic', 'roller', 'touch', 'none'],
      },
      count: {
        type: Number,
        min: [0, 'Count must be non-negative'],
      },
    },
  },
  { _id: false }
);

/**
 * Finish Schema
 */
const finishSchema = new Schema<IFinish>(
  {
    color: String,
    gloss: String,
  },
  { _id: false }
);

/**
 * Custom Features Schemas
 */
const topSchema = new Schema<ITop>(
  {
    height: Number,
    thickness: Number,
    float: Boolean,
    overhang: Number,
    edge_style: {
      type: String,
      enum: ['square', 'beveled', 'rounded'],
    },
  },
  { _id: false }
);

const frontSchema = new Schema<IFront>(
  {
    panel_type: {
      type: String,
      enum: ['shaker', 'flat-panel', 'raised-panel', 'slab', 'glass', 'louvered'],
    },
    thickness: Number,
  },
  { _id: false }
);

const splineSchema = new Schema<ISpline>(
  {
    depth: Number,
    width: Number,
  },
  { _id: false }
);

const accentsSchema = new Schema<IAccents>(
  {
    spline: splineSchema,
    groove: Boolean,
    inlay: String,
  },
  { _id: false }
);

const legsSchema = new Schema<ILegs>(
  {
    has_legs: {
      type: Boolean,
      required: true,
      default: false,
    },
    type: {
      type: String,
      enum: ['straight', 'tapered', 'turned', 'bun', 'bracket', 'custom'],
    },
    height: Number,
    material: String,
  },
  { _id: false }
);

const customFeaturesSchema = new Schema<ICustomFeatures>(
  {
    top: topSchema,
    front: frontSchema,
    accents: accentsSchema,
    legs: legsSchema,
  },
  { _id: false }
);

/**
 * Interior Schema
 */
const interiorSchema = new Schema<IInterior>(
  {
    adjustable_shelves: {
      type: Number,
      min: [0, 'Shelves count must be non-negative'],
      default: 0,
    },
    dividers: {
      type: Number,
      min: [0, 'Dividers count must be non-negative'],
      default: 0,
    },
    cable_management: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

/**
 * Cut List Item Schema
 */
const cutListItemSchema = new Schema<ICutListItem>(
  {
    part_name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    width: {
      type: Number,
      required: true,
      min: [0, 'Width must be positive'],
    },
    height: {
      type: Number,
      required: true,
      min: [0, 'Height must be positive'],
    },
    thickness: {
      type: Number,
      required: true,
      min: [0, 'Thickness must be positive'],
    },
    material: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/**
 * Output Preferences Schema
 */
const outputSchema = new Schema<IOutput>(
  {
    cut_list: {
      type: Boolean,
      default: true,
    },
    assembly_instructions: {
      type: Boolean,
      default: true,
    },
    '3d_preview': {
      type: Boolean,
      default: false,
    },
    ar_preview: {
      type: Boolean,
      default: false,
    },
    export_formats: {
      type: [String],
      enum: ['pdf', 'csv', 'dxf', 'sketchup', 'stl'],
      default: ['pdf'],
    },
  },
  { _id: false }
);

/**
 * AI Guidance Schema
 */
const aiGuidanceSchema = new Schema<IAIGuidance>(
  {
    warnings: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    rule_validation_passed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

/**
 * Project Schema
 */
const projectSchema = new Schema<IProject>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [1, 'Project name must be at least 1 character'],
      maxlength: [200, 'Project name cannot exceed 200 characters'],
    },
    project_type: {
      type: String,
      required: [true, 'Project type is required'],
      enum: ['Base Cabinet', 'Wall Cabinet', 'Tall Cabinet', 'Furniture', 'Custom'],
    },
    units: {
      type: String,
      required: [true, 'Units are required'],
      enum: ['imperial', 'metric'],
      default: 'imperial',
    },
    material: {
      type: materialSchema,
      required: [true, 'Material is required'],
    },
    joinery: {
      type: String,
      enum: ['rabbet', 'dado', 'butt', 'mortise-tenon', 'dowel', 'pocket-hole', 'biscuit'],
    },
    back_panel: {
      type: String,
      enum: ['recessed', 'flush', 'none'],
    },
    dimensions: {
      type: dimensionsSchema,
      required: [true, 'Dimensions are required'],
    },
    drawers: {
      type: [drawerSchema],
      default: [],
    },
    doors: {
      type: [doorSchema],
      default: [],
    },
    hardware: hardwareSchema,
    finish: finishSchema,
    custom_features: customFeaturesSchema,
    interior: {
      type: interiorSchema,
      default: () => ({
        adjustable_shelves: 0,
        dividers: 0,
        cable_management: false,
      }),
    },
    cut_list: {
      type: [cutListItemSchema],
      default: [],
    },
    assembly_instructions: {
      type: [String],
      default: [],
    },
    estimated_cost: {
      type: Number,
      min: [0, 'Cost must be non-negative'],
    },
    output: {
      type: outputSchema,
      default: () => ({
        cut_list: true,
        assembly_instructions: true,
        '3d_preview': false,
        ar_preview: false,
        export_formats: ['pdf'],
      }),
    },
    ai_guidance: {
      type: aiGuidanceSchema,
      default: () => ({
        warnings: [],
        suggestions: [],
        rule_validation_passed: false,
      }),
    },
    version: {
      type: Number,
      default: 1,
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
projectSchema.index({ user_id: 1, created_at: -1 });
projectSchema.index({ user_id: 1, updated_at: -1 });
projectSchema.index({ user_id: 1, project_type: 1 });
projectSchema.index({ name: 'text' });

/**
 * Transform output
 */
projectSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Project = mongoose.model<IProject>('Project', projectSchema);
