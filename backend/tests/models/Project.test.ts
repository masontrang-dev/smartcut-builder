import mongoose from 'mongoose';
import { Project, IProject } from '../../src/models/Project';
import { User } from '../../src/models/User';
import { connectDatabase, disconnectDatabase } from '../../src/config/database';

describe('Project Model', () => {
  let testUserId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/smartcut-test';
    process.env.MONGO_URI = mongoUri;
    await connectDatabase();

    // Ensure indexes are created for tests
    await User.createIndexes();
    await Project.createIndexes();

    // Create a test user
    const testUser = await User.create({
      email: 'projecttest@example.com',
      password_hash: 'password123',
      name: 'Project Test User',
    });
    testUserId = testUser._id as mongoose.Types.ObjectId;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDatabase();
  });

  afterEach(async () => {
    await Project.deleteMany({});
  });

  describe('Project Creation', () => {
    it('should create a valid project with required fields', async () => {
      const projectData = {
        user_id: testUserId,
        name: 'Kitchen Cabinet',
        project_type: 'Base Cabinet' as const,
        units: 'imperial' as const,
        material: {
          type: 'plywood',
          thickness: 0.75,
          grade: 'cabinet-grade',
          sheet_size: '4x8',
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      };

      const project = await Project.create(projectData);

      expect(project.name).toBe(projectData.name);
      expect(project.project_type).toBe(projectData.project_type);
      expect(project.units).toBe(projectData.units);
      expect(project.material.type).toBe(projectData.material.type);
      expect(project.dimensions.width).toBe(projectData.dimensions.width);
      expect(project.created_at).toBeDefined();
      expect(project.updated_at).toBeDefined();
    });

    it('should create project with default values', async () => {
      const project = await Project.create({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: 0.75,
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      expect(project.drawers).toEqual([]);
      expect(project.doors).toEqual([]);
      expect(project.cut_list).toEqual([]);
      expect(project.assembly_instructions).toEqual([]);
      expect(project.version).toBe(1);
      expect(project.interior?.adjustable_shelves).toBe(0);
      expect(project.interior?.dividers).toBe(0);
      expect(project.interior?.cable_management).toBe(false);
    });

    it('should create project with drawers and doors', async () => {
      const project = await Project.create({
        user_id: testUserId,
        name: 'Cabinet with Drawers',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: 0.75,
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
        drawers: [
          {
            quantity: 3,
            type: 'overlay',
            slide_type: 'undermount',
            construction: 'dovetail',
          },
        ],
        doors: [
          {
            quantity: 2,
            type: 'inset',
            panel_type: 'shaker',
            hinge_type: 'concealed',
          },
        ],
      });

      expect(project.drawers).toHaveLength(1);
      expect(project.drawers?.[0].quantity).toBe(3);
      expect(project.drawers?.[0].type).toBe('overlay');
      expect(project.doors).toHaveLength(1);
      expect(project.doors?.[0].quantity).toBe(2);
      expect(project.doors?.[0].panel_type).toBe('shaker');
    });

    it('should create project with custom features', async () => {
      const project = await Project.create({
        user_id: testUserId,
        name: 'Custom Cabinet',
        project_type: 'Custom',
        units: 'imperial',
        material: {
          type: 'hardwood',
          thickness: 0.75,
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
        custom_features: {
          top: {
            height: 1.5,
            thickness: 1.0,
            float: true,
            overhang: 0.5,
            edge_style: 'rounded',
          },
          legs: {
            has_legs: true,
            type: 'tapered',
            height: 6,
            material: 'oak',
          },
        },
      });

      expect(project.custom_features?.top?.float).toBe(true);
      expect(project.custom_features?.top?.edge_style).toBe('rounded');
      expect(project.custom_features?.legs?.has_legs).toBe(true);
      expect(project.custom_features?.legs?.type).toBe('tapered');
    });
  });

  describe('Project Validation', () => {
    it('should fail without user_id', async () => {
      const project = new Project({
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: 0.75,
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });

    it('should fail without name', async () => {
      const project = new Project({
        user_id: testUserId,
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: 0.75,
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });

    it('should fail without project_type', async () => {
      const project = new Project({
        user_id: testUserId,
        name: 'Test Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: 0.75,
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });

    it('should fail without material', async () => {
      const project = new Project({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });

    it('should fail without dimensions', async () => {
      const project = new Project({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: 0.75,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });

    it('should fail with invalid project_type', async () => {
      const project = new Project({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Invalid Type' as any,
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: 0.75,
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });

    it('should fail with negative dimensions', async () => {
      const project = new Project({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: 0.75,
        },
        dimensions: {
          width: -36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });
  });

  describe('Material Validation', () => {
    it('should require material type', async () => {
      const project = new Project({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          thickness: 0.75,
        } as any,
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });

    it('should require material thickness', async () => {
      const project = new Project({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
        } as any,
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });

    it('should fail with negative thickness', async () => {
      const project = new Project({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: {
          type: 'plywood',
          thickness: -0.75,
        },
        dimensions: {
          width: 36,
          height: 30,
          depth: 24,
        },
      });

      await expect(project.save()).rejects.toThrow();
    });
  });

  describe('Enum Validation', () => {
    it('should accept valid joinery types', async () => {
      const validJoineryTypes = ['rabbet', 'dado', 'butt', 'mortise-tenon', 'dowel', 'pocket-hole', 'biscuit'];

      for (const joinery of validJoineryTypes) {
        const project = await Project.create({
          user_id: testUserId,
          name: `Cabinet with ${joinery}`,
          project_type: 'Base Cabinet',
          units: 'imperial',
          material: { type: 'plywood', thickness: 0.75 },
          dimensions: { width: 36, height: 30, depth: 24 },
          joinery: joinery as any,
        });

        expect(project.joinery).toBe(joinery);
        await project.deleteOne();
      }
    });

    it('should accept valid door panel types', async () => {
      const validPanelTypes = ['shaker', 'flat-panel', 'raised-panel', 'slab', 'glass', 'louvered'];

      for (const panelType of validPanelTypes) {
        const project = await Project.create({
          user_id: testUserId,
          name: `Cabinet with ${panelType} doors`,
          project_type: 'Base Cabinet',
          units: 'imperial',
          material: { type: 'plywood', thickness: 0.75 },
          dimensions: { width: 36, height: 30, depth: 24 },
          doors: [{ quantity: 2, panel_type: panelType as any }],
        });

        expect(project.doors?.[0].panel_type).toBe(panelType);
        await project.deleteOne();
      }
    });
  });

  describe('Indexes', () => {
    it('should have user_id and created_at compound index', async () => {
      const indexes = Project.schema.indexes();
      const hasCompoundIndex = indexes.some((index) => {
        const fields = index[0];
        return fields.user_id !== undefined && fields.created_at !== undefined;
      });
      expect(hasCompoundIndex).toBe(true);
    });

    it('should have text index on name', async () => {
      const indexes = Project.schema.indexes();
      const hasTextIndex = indexes.some((index) => {
        const fields = index[0];
        return fields.name !== undefined;
      });
      expect(hasTextIndex).toBe(true);
    });
  });

  describe('JSON Transformation', () => {
    it('should not expose __v in JSON', async () => {
      const project = await Project.create({
        user_id: testUserId,
        name: 'Test Cabinet',
        project_type: 'Base Cabinet',
        units: 'imperial',
        material: { type: 'plywood', thickness: 0.75 },
        dimensions: { width: 36, height: 30, depth: 24 },
      });

      const projectJSON = project.toJSON();
      expect(projectJSON.__v).toBeUndefined();
    });
  });
});
