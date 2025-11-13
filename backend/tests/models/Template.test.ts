import mongoose from 'mongoose';
import { Template, ITemplate } from '../../src/models/Template';
import { User } from '../../src/models/User';

describe('Template Model', () => {
  let testUserId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    // Ensure indexes are created for tests
    await User.createIndexes();
    await Template.createIndexes();
    
    // Wait for indexes to be built (important for parallel test execution)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create a test user
    const testUser = await User.create({
      email: 'templatetest@example.com',
      password_hash: 'password123',
      name: 'Template Test User',
    });
    testUserId = testUser._id as mongoose.Types.ObjectId;
  });

  afterAll(async () => {
    // Clean up test user
    await User.deleteMany({ email: 'templatetest@example.com' });
  });

  afterEach(async () => {
    await Template.deleteMany({});
  });

  describe('Template Creation', () => {
    it('should create a valid template with required fields', async () => {
      const templateData = {
        name: 'Basic Kitchen Cabinet',
        description: 'A standard base cabinet with two doors',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      };

      const template = await Template.create(templateData);

      expect(template.name).toBe(templateData.name);
      expect(template.description).toBe(templateData.description);
      expect(template.category).toBe(templateData.category);
      expect(template.author_id).toEqual(testUserId);
      expect(template.downloads).toBe(0);
      expect(template.rating).toBe(0);
      expect(template.is_public).toBe(false);
      expect(template.created_at).toBeDefined();
      expect(template.updated_at).toBeDefined();
    });

    it('should create template with optional fields', async () => {
      const template = await Template.create({
        name: 'Premium Cabinet',
        description: 'High-end cabinet with custom features',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'hardwood', thickness: 0.75 },
        },
        thumbnail_url: 'https://example.com/thumbnail.jpg',
        is_public: true,
      });

      expect(template.thumbnail_url).toBe('https://example.com/thumbnail.jpg');
      expect(template.is_public).toBe(true);
    });
  });

  describe('Template Validation', () => {
    it('should fail without name', async () => {
      const template = new Template({
        description: 'A standard base cabinet',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      await expect(template.save()).rejects.toThrow();
    });

    it('should fail without description', async () => {
      const template = new Template({
        name: 'Basic Cabinet',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      await expect(template.save()).rejects.toThrow();
    });

    it('should fail without category', async () => {
      const template = new Template({
        name: 'Basic Cabinet',
        description: 'A standard base cabinet',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      await expect(template.save()).rejects.toThrow();
    });

    it('should fail without author_id', async () => {
      const template = new Template({
        name: 'Basic Cabinet',
        description: 'A standard base cabinet',
        category: 'kitchen',
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      await expect(template.save()).rejects.toThrow();
    });

    it('should fail without project_data', async () => {
      const template = new Template({
        name: 'Basic Cabinet',
        description: 'A standard base cabinet',
        category: 'kitchen',
        author_id: testUserId,
      });

      await expect(template.save()).rejects.toThrow();
    });

    it('should fail with invalid category', async () => {
      const template = new Template({
        name: 'Basic Cabinet',
        description: 'A standard base cabinet',
        category: 'invalid-category',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      await expect(template.save()).rejects.toThrow();
    });

    it('should fail with invalid thumbnail URL', async () => {
      const template = new Template({
        name: 'Basic Cabinet',
        description: 'A standard base cabinet',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
        thumbnail_url: 'not-a-valid-url',
      });

      await expect(template.save()).rejects.toThrow();
    });

    it('should fail with incomplete project_data', async () => {
      const template = new Template({
        name: 'Basic Cabinet',
        description: 'A standard base cabinet',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          // Missing dimensions and material
        },
      });

      await expect(template.save()).rejects.toThrow();
    });

    it('should convert category to lowercase', async () => {
      const template = await Template.create({
        name: 'Basic Cabinet',
        description: 'A standard base cabinet',
        category: 'KITCHEN',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      expect(template.category).toBe('kitchen');
    });
  });

  describe('Template Methods', () => {
    it('should increment downloads', async () => {
      const template = await Template.create({
        name: 'Basic Cabinet',
        description: 'A standard base cabinet',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      expect(template.downloads).toBe(0);

      await template.incrementDownloads();
      expect(template.downloads).toBe(1);

      await template.incrementDownloads();
      expect(template.downloads).toBe(2);
    });
  });

  describe('Template Virtuals', () => {
    it('should calculate popularity score', async () => {
      const template = await Template.create({
        name: 'Popular Cabinet',
        description: 'A highly rated cabinet',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
        downloads: 100,
        rating: 4.5,
      });

      const expectedScore = 100 * 0.7 + 4.5 * 100 * 0.3;
      expect(template.popularity_score).toBe(expectedScore);
    });

    it('should include virtuals in JSON', async () => {
      const template = await Template.create({
        name: 'Test Cabinet',
        description: 'A test cabinet',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      const templateJSON = template.toJSON();
      expect(templateJSON.popularity_score).toBeDefined();
    });
  });

  describe('Indexes', () => {
    it('should have category and is_public compound index', async () => {
      const indexes = await Template.collection.getIndexes();
      const hasCompoundIndex = Object.keys(indexes).some(
        (key) => key.includes('category') && key.includes('is_public')
      );
      expect(hasCompoundIndex).toBe(true);
    });

    it('should have text index on name and description', async () => {
      const indexes = await Template.collection.getIndexes();
      const hasTextIndex = Object.keys(indexes).some(
        (key) => key.includes('name') || key.includes('description')
      );
      expect(hasTextIndex).toBe(true);
    });

    it('should have downloads index', async () => {
      const indexes = await Template.collection.getIndexes();
      const hasDownloadsIndex = Object.keys(indexes).some((key) => key.includes('downloads'));
      expect(hasDownloadsIndex).toBe(true);
    });

    it('should have rating index', async () => {
      const indexes = await Template.collection.getIndexes();
      const hasRatingIndex = Object.keys(indexes).some((key) => key.includes('rating'));
      expect(hasRatingIndex).toBe(true);
    });
  });

  describe('Valid Categories', () => {
    it('should accept all valid categories', async () => {
      const validCategories = [
        'kitchen',
        'bathroom',
        'bedroom',
        'living-room',
        'office',
        'garage',
        'custom',
      ];

      for (const category of validCategories) {
        const template = await Template.create({
          name: `${category} Cabinet`,
          description: `A ${category} cabinet template`,
          category,
          author_id: testUserId,
          project_data: {
            project_type: 'Base Cabinet',
            dimensions: { width: 36, height: 30, depth: 24 },
            material: { type: 'plywood', thickness: 0.75 },
          },
        });

        expect(template.category).toBe(category);
        await template.deleteOne();
      }
    });
  });

  describe('JSON Transformation', () => {
    it('should not expose __v in JSON', async () => {
      const template = await Template.create({
        name: 'Test Cabinet',
        description: 'A test cabinet',
        category: 'kitchen',
        author_id: testUserId,
        project_data: {
          project_type: 'Base Cabinet',
          dimensions: { width: 36, height: 30, depth: 24 },
          material: { type: 'plywood', thickness: 0.75 },
        },
      });

      const templateJSON = template.toJSON();
      expect(templateJSON.__v).toBeUndefined();
    });
  });
});
