# SmartCut Builder v1.0 – Schema Example

## Complete Project Example

This example shows how a real-world base cabinet project maps to the SmartCut schema.

### Example Project: Kitchen Base Cabinet

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "name": "Kitchen Base Cabinet - Island",
  "project_type": "Base Cabinet",
  "units": "imperial",
  "material": {
    "type": "plywood",
    "thickness": 0.75,
    "grade": "cabinet-grade",
    "sheet_size": "4x8"
  },
  "joinery": "rabbet",
  "back_panel": "recessed",

  "dimensions": {
    "width": 36,
    "height": 34.5,
    "depth": 24,
    "material_thickness": 0.75,
    "back_panel_thickness": 0.25,
    "toe_kick_height": 4,
    "frame": {
      "has_face_frame": true,
      "stile_width": 1.5,
      "rail_width": 2
    }
  },

  "doors": [
    {
      "quantity": 2,
      "type": "inset",
      "panel_type": "shaker",
      "gap_between_doors": 0.125,
      "hinge_type": "concealed",
      "swing_direction": "left"
    }
  ],

  "drawers": [
    {
      "quantity": 3,
      "type": "overlay",
      "slide_type": "undermount",
      "gap_between_drawers": 0.125,
      "construction": "dovetail"
    }
  ],

  "hardware": {
    "hinges": {
      "type": "concealed",
      "count": 4,
      "overlay": 0.5
    },
    "drawer_slides": {
      "type": "under-mount",
      "extension": "full",
      "soft_close": true
    },
    "handles": {
      "type": "bar",
      "position": "default",
      "finish": "brushed nickel",
      "center_to_center": 3
    },
    "latches": {
      "type": "magnetic",
      "count": 2
    }
  },

  "custom_features": {
    "legs": {
      "has_legs": true,
      "type": "straight",
      "height": 4,
      "material": "hardwood"
    }
  },

  "interior": {
    "adjustable_shelves": 2,
    "dividers": 1,
    "cable_management": false
  },

  "finish": {
    "color": "natural oak",
    "gloss": "satin"
  },

  "output": {
    "cut_list": true,
    "assembly_instructions": true,
    "3d_preview": true,
    "ar_preview": false,
    "export_formats": ["pdf", "csv", "dxf"]
  },

  "ai_guidance": {
    "warnings": [],
    "suggestions": ["Consider adding a center support for the 36-inch span"],
    "rule_validation_passed": true
  },

  "createdAt": "2024-11-12T10:00:00.000Z",
  "updatedAt": "2024-11-12T15:30:00.000Z"
}
```

## Door Style Reference

The schema now includes comprehensive door style options:

| Style            | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| **shaker**       | Traditional frame-and-panel with flat center panel and square edges |
| **flat-panel**   | Simple flat panel, also called "slab" in some contexts              |
| **raised-panel** | Traditional style with raised center panel                          |
| **slab**         | Completely flat, no frame or panel detail                           |
| **glass**        | Frame with glass insert                                             |
| **louvered**     | Horizontal slats for ventilation                                    |

## Door Type Reference

How the door sits relative to the cabinet frame:

| Type             | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| **inset**        | Door sits flush inside the frame opening                    |
| **overlay**      | Door partially covers the frame (standard overlay)          |
| **full-overlay** | Door completely covers the frame (frameless/European style) |

## Joinery Options

| Joinery Type      | Best For                     | Strength  |
| ----------------- | ---------------------------- | --------- |
| **rabbet**        | Cabinet boxes, back panels   | Medium    |
| **dado**          | Shelves, dividers            | High      |
| **butt**          | Simple projects, face frames | Low       |
| **mortise-tenon** | Furniture, face frames       | Very High |
| **dowel**         | Furniture, edge joints       | High      |
| **pocket-hole**   | Face frames, quick assembly  | Medium    |
| **biscuit**       | Edge joints, alignment       | Medium    |

## Material Structure

Materials are now structured objects with detailed properties:

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

### Common Material Types

| Type     | Thickness | Grade         | Use Case          |
| -------- | --------- | ------------- | ----------------- |
| plywood  | 0.75      | cabinet-grade | Standard cabinets |
| plywood  | 0.5       | utility       | Drawer bottoms    |
| hardwood | 0.75      | select        | Face frames       |
| MDF      | 0.25      | standard      | Back panels       |
| MDF      | 0.75      | premium       | Painted cabinets  |
| plywood  | 0.75      | birch         | Premium finish    |
| plywood  | 0.5       | baltic-birch  | Drawer boxes      |

### Sheet Sizes

- `"4x8"` - Standard (48" × 96")
- `"5x5"` - European (1525mm × 1525mm)
- `"4x10"` - Extended (48" × 120")

## Workshop Profile Example

```json
{
  "workshop_profile": {
    "saw": true,
    "router": true,
    "jigSaw": true,
    "table_saw": true,
    "miter_saw": true,
    "planer": false,
    "jointer": false
  }
}
```

This tells the system:

- User has basic saws and router
- Can generate dado/rabbet instructions (router)
- Cannot plane rough lumber (no planer)
- Should recommend pre-surfaced materials

## Interior Features

New interior configuration options:

```json
{
  "interior": {
    "adjustable_shelves": 2,
    "dividers": 1,
    "cable_management": true
  }
}
```

| Field              | Type    | Description                            |
| ------------------ | ------- | -------------------------------------- |
| adjustable_shelves | integer | Number of shelves with adjustable pins |
| dividers           | integer | Vertical dividers for organization     |
| cable_management   | boolean | Include cable routing holes/channels   |

## AI Guidance

The system provides real-time validation and suggestions:

```json
{
  "ai_guidance": {
    "warnings": ["Drawer height may be too shallow for standard slides"],
    "suggestions": [
      "Consider adding a center support for spans over 36 inches",
      "Use soft-close hinges for better user experience"
    ],
    "rule_validation_passed": true
  }
}
```

### Validation Categories

- **Structural** - Span limits, support requirements
- **Hardware** - Compatibility checks
- **Clearances** - Gap and overlay validation
- **Materials** - Thickness and strength appropriateness

## Validation Rules

The system will validate:

1. **Dimensions** - Width, height, depth must be positive numbers
2. **Material** - Type and thickness must be specified
3. **Gaps** - Typically 0.125" (1/8") minimum for clearance
4. **Door/Drawer quantities** - Must be >= 0
5. **Face frame** - If `has_face_frame: true`, stile and rail widths required
6. **Legs** - If `has_legs: true`, height and type required
7. **Hardware** - Hinge count should match door quantity (typically 2-3 per door)
8. **Arrays** - Drawers and doors are arrays to support multiple configurations

## Common Configurations

### Frameless (European) Cabinet

```json
{
  "project_type": "Base Cabinet",
  "units": "metric",
  "material": {
    "type": "MDF",
    "thickness": 18,
    "grade": "premium"
  },
  "dimensions": {
    "frame": {
      "has_face_frame": false
    }
  },
  "doors": [
    {
      "quantity": 2,
      "type": "full-overlay",
      "panel_type": "slab"
    }
  ]
}
```

### Traditional Face Frame Cabinet

```json
{
  "project_type": "Base Cabinet",
  "units": "imperial",
  "material": {
    "type": "hardwood",
    "thickness": 0.75,
    "grade": "select"
  },
  "dimensions": {
    "frame": {
      "has_face_frame": true,
      "stile_width": 1.5,
      "rail_width": 2
    }
  },
  "doors": [
    {
      "quantity": 2,
      "type": "inset",
      "panel_type": "shaker"
    }
  ]
}
```

### Furniture Piece with Legs

```json
{
  "project_type": "Furniture",
  "units": "imperial",
  "material": {
    "type": "hardwood",
    "thickness": 0.75,
    "grade": "select"
  },
  "custom_features": {
    "legs": {
      "has_legs": true,
      "type": "tapered",
      "height": 6,
      "material": "hardwood"
    },
    "top": {
      "thickness": 1.5,
      "overhang": 1,
      "edge_style": "rounded"
    }
  },
  "interior": {
    "adjustable_shelves": 3,
    "dividers": 0,
    "cable_management": true
  }
}
```

---

This schema now fully supports all the fields from your original planning and provides comprehensive options for professional woodworking projects.
