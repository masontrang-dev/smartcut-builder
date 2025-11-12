# SmartCut Builder v1.0 – JSON Schema for Project Documents

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "SmartCut Project",
  "type": "object",
  "properties": {
    "userId": { "type": "string" },
    "name": { "type": "string" },
    "project_type": {
      "enum": [
        "Base Cabinet",
        "Wall Cabinet",
        "Tall Cabinet",
        "Furniture",
        "Custom"
      ]
    },
    "units": {
      "enum": ["imperial", "metric"],
      "default": "imperial",
      "description": "Measurement system: imperial (inches) or metric (millimeters)"
    },
    "material": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "description": "e.g., plywood, MDF, hardwood"
        },
        "thickness": { "type": "number" },
        "grade": { "type": "string", "description": "Optional material grade" },
        "sheet_size": {
          "type": "string",
          "description": "Optional full sheet dimensions"
        }
      },
      "required": ["type", "thickness"]
    },
    "joinery": {
      "enum": [
        "rabbet",
        "dado",
        "butt",
        "mortise-tenon",
        "dowel",
        "pocket-hole",
        "biscuit"
      ]
    },
    "back_panel": { "enum": ["recessed", "flush", "none"] },
    "dimensions": {
      "type": "object",
      "properties": {
        "width": { "type": "number" },
        "height": { "type": "number" },
        "depth": { "type": "number" },
        "material_thickness": { "type": "number" },
        "back_panel_thickness": { "type": "number" },
        "toe_kick_height": { "type": "number" },
        "frame": {
          "type": "object",
          "properties": {
            "has_face_frame": { "type": "boolean" },
            "stile_width": { "type": "number" },
            "rail_width": { "type": "number" }
          }
        }
      },
      "required": ["width", "height", "depth"]
    },
    "drawers": {
      "type": "array",
      "items": { "$ref": "#/definitions/drawer" }
    },
    "doors": {
      "type": "array",
      "items": { "$ref": "#/definitions/door" }
    },
    "hardware": { "$ref": "#/definitions/hardware" },
    "finish": { "$ref": "#/definitions/finish" },
    "custom_features": { "$ref": "#/definitions/customFeatures" },
    "interior": { "$ref": "#/definitions/interior" },
    "workshop_profile": { "$ref": "#/definitions/workshopProfile" },
    "output": { "$ref": "#/definitions/output" },
    "ai_guidance": { "$ref": "#/definitions/aiGuidance" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["userId", "name", "project_type", "dimensions"],
  "definitions": {
    "drawer": {
      "type": "object",
      "properties": {
        "quantity": { "type": "integer", "minimum": 0 },
        "type": { "enum": ["overlay", "inset", "full-overlay"] },
        "slide_type": {
          "enum": ["undermount", "side-mount", "center-mount", "euro"]
        },
        "gap_between_drawers": { "type": "number" },
        "construction": { "enum": ["dovetail", "box-joint", "rabbet", "dado"] }
      },
      "required": ["quantity"]
    },
    "door": {
      "type": "object",
      "properties": {
        "quantity": { "type": "integer", "minimum": 0 },
        "type": { "enum": ["inset", "overlay", "full-overlay"] },
        "panel_type": {
          "enum": [
            "shaker",
            "flat-panel",
            "raised-panel",
            "slab",
            "glass",
            "louvered"
          ]
        },
        "gap_between_doors": { "type": "number" },
        "hinge_type": {
          "enum": ["concealed", "butt", "european", "piano", "inset"]
        },
        "swing_direction": {
          "enum": ["left", "right", "up", "down", "bi-fold"]
        }
      },
      "required": ["quantity"]
    },
    "hardware": {
      "type": "object",
      "properties": {
        "hinges": {
          "type": "object",
          "properties": {
            "type": { "enum": ["concealed", "butt", "european", "piano"] },
            "count": { "type": "integer", "minimum": 0 },
            "overlay": { "type": "number" }
          }
        },
        "drawer_slides": {
          "type": "object",
          "properties": {
            "type": { "enum": ["side-mount", "under-mount", "center-mount"] },
            "extension": { "enum": ["full", "three-quarter", "half"] },
            "soft_close": { "type": "boolean" }
          }
        },
        "handles": {
          "type": "object",
          "properties": {
            "type": {
              "enum": ["knob", "pull", "bar", "cup", "integrated", "none"]
            },
            "position": {
              "enum": ["default", "top", "bottom", "center", "custom"]
            },
            "finish": { "type": "string" },
            "center_to_center": { "type": "number" }
          }
        },
        "latches": {
          "type": "object",
          "properties": {
            "type": { "enum": ["magnetic", "roller", "touch", "none"] },
            "count": { "type": "integer", "minimum": 0 }
          }
        }
      }
    },
    "finish": {
      "type": "object",
      "properties": {
        "color": { "type": "string" },
        "gloss": { "type": "string" }
      }
    },
    "customFeatures": {
      "type": "object",
      "properties": {
        "top": { "$ref": "#/definitions/top" },
        "front": { "$ref": "#/definitions/front" },
        "accents": { "$ref": "#/definitions/accents" },
        "legs": { "$ref": "#/definitions/legs" },
        "hardware": { "$ref": "#/definitions/hardware" }
      }
    },
    "top": {
      "type": "object",
      "properties": {
        "height": { "type": "number" },
        "thickness": { "type": "number" },
        "float": { "type": "boolean" },
        "overhang": { "type": "number" },
        "edge_style": { "enum": ["square", "beveled", "rounded"] }
      }
    },
    "front": {
      "type": "object",
      "properties": {
        "panel_type": {
          "enum": [
            "shaker",
            "flat-panel",
            "raised-panel",
            "slab",
            "glass",
            "louvered"
          ]
        },
        "thickness": { "type": "number" }
      }
    },
    "accents": {
      "type": "object",
      "properties": {
        "spline": { "$ref": "#/definitions/spline" },
        "groove": { "type": "boolean" },
        "inlay": { "type": "string" }
      }
    },
    "spline": {
      "type": "object",
      "properties": {
        "depth": { "type": "number" },
        "width": { "type": "number" }
      }
    },
    "legs": {
      "type": "object",
      "properties": {
        "has_legs": { "type": "boolean" },
        "type": {
          "enum": ["straight", "tapered", "turned", "bun", "bracket", "custom"]
        },
        "height": { "type": "number" },
        "material": { "type": "string" }
      }
    },
    "interior": {
      "type": "object",
      "properties": {
        "adjustable_shelves": { "type": "integer", "minimum": 0 },
        "dividers": { "type": "integer", "minimum": 0 },
        "cable_management": { "type": "boolean" }
      }
    },
    "workshopProfile": {
      "type": "object",
      "properties": {
        "saw": { "type": "boolean" },
        "router": { "type": "boolean" },
        "jigSaw": { "type": "boolean" },
        "table_saw": { "type": "boolean" },
        "miter_saw": { "type": "boolean" },
        "planer": { "type": "boolean" },
        "jointer": { "type": "boolean" }
      }
    },
    "output": {
      "type": "object",
      "properties": {
        "cut_list": { "type": "boolean", "default": true },
        "assembly_instructions": { "type": "boolean", "default": true },
        "3d_preview": { "type": "boolean", "default": false },
        "ar_preview": { "type": "boolean", "default": false },
        "export_formats": {
          "type": "array",
          "items": { "enum": ["pdf", "csv", "dxf", "sketchup", "stl"] }
        }
      }
    },
    "aiGuidance": {
      "type": "object",
      "properties": {
        "warnings": { "type": "array", "items": { "type": "string" } },
        "suggestions": { "type": "array", "items": { "type": "string" } },
        "rule_validation_passed": { "type": "boolean" }
      }
    }
  }
}
```
