# SmartCut Builder v1.0 – Schema Changelog

## Latest Changes (Nov 12, 2024)

### Major Structural Improvements

#### 1. Material as Structured Object ✨

**Before:**

```json
{
  "material": "3/4in plywood"
}
```

**After:**

```json
{
  "material": {
    "type": "plywood",
    "thickness": 0.75,
    "grade": "cabinet-grade",
    "sheet_size": "4x8"
  }
}
```

**Benefits:**

- Structured data for better validation
- Separate thickness from material type
- Support for material grades (select, cabinet-grade, utility, etc.)
- Sheet size tracking for cut optimization

---

#### 2. Drawers and Doors as Arrays 🔄

**Before:**

```json
{
  "drawers": {
    "count": 3,
    "type": "overlay"
  },
  "doors": {
    "count": 2,
    "type": "inset"
  }
}
```

**After:**

```json
{
  "drawers": [
    {
      "quantity": 3,
      "type": "overlay",
      "slide_type": "undermount",
      "gap_between_drawers": 0.125,
      "construction": "dovetail"
    }
  ],
  "doors": [
    {
      "quantity": 2,
      "type": "inset",
      "panel_type": "shaker",
      "gap_between_doors": 0.125,
      "hinge_type": "concealed"
    }
  ]
}
```

**Benefits:**

- Support multiple drawer/door configurations in one project
- Example: Top drawer with different slides than bottom drawers
- Example: Glass door + solid door in same cabinet
- More flexible for complex furniture designs

---

#### 3. Door Panel Type Renamed 📝

**Before:**

```json
{
  "doors": {
    "style": "shaker"
  }
}
```

**After:**

```json
{
  "doors": [
    {
      "panel_type": "shaker"
    }
  ]
}
```

**Benefits:**

- Clearer naming: `panel_type` vs `style`
- Distinguishes from door `type` (inset/overlay)
- More intuitive for users

---

#### 4. Interior Features Promoted to Top-Level 🏠

**Before:**

```json
{
  "custom_features": {
    "interior": {
      "float": true,
      "depth": 12
    }
  }
}
```

**After:**

```json
{
  "interior": {
    "adjustable_shelves": 2,
    "dividers": 1,
    "cable_management": true
  }
}
```

**Benefits:**

- Interior is a core feature, not "custom"
- More specific fields for common needs
- Better organization of schema

---

#### 5. AI Guidance Integration 🤖

**New Field:**

```json
{
  "ai_guidance": {
    "warnings": ["Drawer height may be too shallow for standard slides"],
    "suggestions": [
      "Consider adding a center support for spans over 36 inches"
    ],
    "rule_validation_passed": true
  }
}
```

**Benefits:**

- Real-time validation feedback
- Structural warnings
- Design suggestions
- Rule compliance tracking

---

#### 6. Enhanced Custom Features 🎨

**Top Enhancements:**

```json
{
  "custom_features": {
    "top": {
      "thickness": 1.5,
      "overhang": 1, // NEW
      "edge_style": "rounded" // NEW: square, beveled, rounded
    }
  }
}
```

**Accent Enhancements:**

```json
{
  "custom_features": {
    "accents": {
      "spline": { "depth": 0.25, "width": 0.125 },
      "groove": true,
      "inlay": "contrasting wood" // NEW
    }
  }
}
```

**Benefits:**

- More detailed top specifications
- Support for decorative inlays
- Edge style options for professional finish

---

#### 7. AR Preview Support 🥽

**Output Options:**

```json
{
  "output": {
    "cut_list": true,
    "assembly_instructions": true,
    "3d_preview": true,
    "ar_preview": true, // NEW
    "export_formats": ["pdf", "csv", "dxf"]
  }
}
```

**Benefits:**

- Prepare for V3 AR features
- User preference tracking
- Future-proof schema

---

### Field Naming Consistency

#### Standardized to `quantity`

- Changed `count` → `quantity` for drawers and doors
- Consistent with other quantity fields

#### Cleaner Descriptions

- Removed redundant unit descriptions (handled by top-level `units` field)
- Simplified field descriptions
- Better JSON formatting

---

## Migration Guide

### For Existing Projects

If you have existing projects with the old schema, here's how to migrate:

#### 1. Material Migration

```javascript
// Old
const oldMaterial = "3/4in plywood";

// New
const newMaterial = {
  type: "plywood",
  thickness: 0.75,
  grade: "cabinet-grade",
  sheet_size: "4x8",
};
```

#### 2. Drawers/Doors Migration

```javascript
// Old
const oldDrawers = {
  count: 3,
  type: "overlay",
};

// New
const newDrawers = [
  {
    quantity: 3,
    type: "overlay",
    slide_type: "undermount",
    gap_between_drawers: 0.125,
    construction: "dovetail",
  },
];
```

#### 3. Door Style Migration

```javascript
// Old
const oldDoor = {
  style: "shaker",
};

// New
const newDoor = {
  panel_type: "shaker",
};
```

#### 4. Interior Migration

```javascript
// Old
const oldInterior = {
  custom_features: {
    interior: {
      float: true,
      depth: 12,
    },
  },
};

// New
const newInterior = {
  interior: {
    adjustable_shelves: 2,
    dividers: 1,
    cable_management: false,
  },
};
```

---

## Backend Migration Script

```typescript
// utils/schemaMigration.ts

export function migrateProjectToV2(oldProject: any): any {
  const migrated = { ...oldProject };

  // Migrate material
  if (typeof migrated.material === "string") {
    const thickness = parseFloat(
      migrated.material.match(/[\d.]+/)?.[0] || "0.75"
    );
    const type = migrated.material.includes("plywood")
      ? "plywood"
      : migrated.material.includes("MDF")
      ? "MDF"
      : "hardwood";

    migrated.material = {
      type,
      thickness,
      grade: "standard",
      sheet_size: "4x8",
    };
  }

  // Migrate drawers to array
  if (migrated.drawers && !Array.isArray(migrated.drawers)) {
    migrated.drawers = [
      {
        quantity: migrated.drawers.count || 0,
        type: migrated.drawers.type || "overlay",
        slide_type: migrated.drawers.slide_type || "undermount",
        gap_between_drawers: migrated.drawers.gaps || 0.125,
        construction: "dovetail",
      },
    ];
  }

  // Migrate doors to array
  if (migrated.doors && !Array.isArray(migrated.doors)) {
    migrated.doors = [
      {
        quantity: migrated.doors.count || 0,
        type: migrated.doors.type || "overlay",
        panel_type: migrated.doors.style || "shaker",
        gap_between_doors: migrated.doors.gaps || 0.125,
        hinge_type: migrated.doors.hinge_type || "concealed",
        swing_direction: migrated.doors.swing_direction || "left",
      },
    ];
  }

  // Migrate interior
  if (migrated.custom_features?.interior) {
    migrated.interior = {
      adjustable_shelves: 0,
      dividers: 0,
      cable_management: false,
    };
    delete migrated.custom_features.interior;
  }

  // Add AI guidance if missing
  if (!migrated.ai_guidance) {
    migrated.ai_guidance = {
      warnings: [],
      suggestions: [],
      rule_validation_passed: true,
    };
  }

  // Add AR preview to output
  if (migrated.output && !migrated.output.hasOwnProperty("ar_preview")) {
    migrated.output.ar_preview = false;
  }

  return migrated;
}
```

---

## Database Migration

### MongoDB Migration Script

```javascript
// migrations/001_schema_v2_migration.js

db.projects.find().forEach(function (project) {
  const updates = {};

  // Material migration
  if (typeof project.material === "string") {
    updates.material = {
      type: project.material.includes("plywood") ? "plywood" : "MDF",
      thickness: 0.75,
      grade: "standard",
      sheet_size: "4x8",
    };
  }

  // Drawers migration
  if (project.drawers && !Array.isArray(project.drawers)) {
    updates.drawers = [
      {
        quantity: project.drawers.count || 0,
        type: project.drawers.type || "overlay",
        slide_type: project.drawers.slide_type || "undermount",
        gap_between_drawers: project.drawers.gaps || 0.125,
        construction: "dovetail",
      },
    ];
  }

  // Doors migration
  if (project.doors && !Array.isArray(project.doors)) {
    updates.doors = [
      {
        quantity: project.doors.count || 0,
        type: project.doors.type || "overlay",
        panel_type: project.doors.style || "shaker",
        gap_between_doors: project.doors.gaps || 0.125,
        hinge_type: project.doors.hinge_type || "concealed",
        swing_direction: project.doors.swing_direction || "left",
      },
    ];
  }

  // Interior migration
  if (project.custom_features?.interior) {
    updates.interior = {
      adjustable_shelves: 0,
      dividers: 0,
      cable_management: false,
    };
    updates.$unset = { "custom_features.interior": "" };
  }

  // AI guidance
  if (!project.ai_guidance) {
    updates.ai_guidance = {
      warnings: [],
      suggestions: [],
      rule_validation_passed: true,
    };
  }

  if (Object.keys(updates).length > 0) {
    db.projects.updateOne({ _id: project._id }, { $set: updates });
  }
});

print("Migration complete!");
```

---

## Testing Checklist

- [ ] Test material object validation
- [ ] Test drawer array with multiple configurations
- [ ] Test door array with mixed panel types
- [ ] Test interior fields (shelves, dividers, cable management)
- [ ] Test AI guidance integration
- [ ] Test AR preview flag
- [ ] Test migration script on sample data
- [ ] Verify API responses match new schema
- [ ] Update frontend forms to handle arrays
- [ ] Test units conversion with new material structure

---

## Breaking Changes ⚠️

1. **Material is now an object** - String values will fail validation
2. **Drawers and doors are arrays** - Single object access will break
3. **Door `style` renamed to `panel_type`** - Old field name not recognized
4. **Interior moved to top-level** - `custom_features.interior` path changed
5. **`count` renamed to `quantity`** - Old field name not recognized

## Backward Compatibility

To maintain backward compatibility during transition:

1. Run migration script on existing database
2. Update API to accept both old and new formats temporarily
3. Auto-migrate old format on save
4. Deprecate old format after 3 months
5. Remove old format support in v3.0

---

This changelog documents all schema changes and provides migration paths for existing data.
