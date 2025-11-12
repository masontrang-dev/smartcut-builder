# SmartCut Builder v1.0 – Units & Conversion System

## Overview

SmartCut Builder supports both **Imperial** (inches) and **Metric** (millimeters) measurement systems. All measurements in a project use a single unit system specified by the `units` field.

## Schema Implementation

### Project-Level Units Field

```json
{
  "units": "imperial", // or "metric"
  "dimensions": {
    "width": 36, // 36 inches if imperial, 36mm if metric
    "height": 34.5,
    "depth": 24
  }
}
```

### Supported Unit Systems

| System       | Unit        | Precision      | Use Case                |
| ------------ | ----------- | -------------- | ----------------------- |
| **imperial** | inches      | 1/16" (0.0625) | USA, UK woodworking     |
| **metric**   | millimeters | 1mm            | Europe, Asia, Australia |

## Conversion Utilities

### Backend Conversion Functions

```typescript
// utils/units.ts

export type UnitSystem = "imperial" | "metric";

export const CONVERSION_FACTORS = {
  INCH_TO_MM: 25.4,
  MM_TO_INCH: 1 / 25.4,
} as const;

/**
 * Convert inches to millimeters
 */
export function inchesToMm(inches: number): number {
  return Math.round(inches * CONVERSION_FACTORS.INCH_TO_MM * 100) / 100;
}

/**
 * Convert millimeters to inches
 */
export function mmToInches(mm: number): number {
  return Math.round(mm * CONVERSION_FACTORS.MM_TO_INCH * 10000) / 10000;
}

/**
 * Convert a measurement from one unit system to another
 */
export function convertUnits(
  value: number,
  fromUnit: UnitSystem,
  toUnit: UnitSystem
): number {
  if (fromUnit === toUnit) return value;

  if (fromUnit === "imperial" && toUnit === "metric") {
    return inchesToMm(value);
  }

  if (fromUnit === "metric" && toUnit === "imperial") {
    return mmToInches(value);
  }

  return value;
}

/**
 * Format a measurement with appropriate precision and unit label
 */
export function formatMeasurement(
  value: number,
  units: UnitSystem,
  options?: {
    precision?: number;
    showUnit?: boolean;
    fractional?: boolean; // Show as fractions for imperial
  }
): string {
  const { precision, showUnit = true, fractional = false } = options || {};

  if (units === "imperial") {
    if (fractional) {
      return formatAsFraction(value, showUnit);
    }
    const rounded =
      precision !== undefined ? value.toFixed(precision) : value.toFixed(4);
    return showUnit ? `${rounded}"` : rounded;
  }

  // Metric
  const rounded =
    precision !== undefined
      ? value.toFixed(precision)
      : Math.round(value).toString();
  return showUnit ? `${rounded}mm` : rounded;
}

/**
 * Convert decimal inches to fractional representation
 * e.g., 0.75 -> "3/4", 1.5 -> "1 1/2"
 */
export function formatAsFraction(inches: number, showUnit = true): string {
  const whole = Math.floor(inches);
  const decimal = inches - whole;

  if (decimal === 0) {
    return showUnit ? `${whole}"` : `${whole}`;
  }

  // Common woodworking fractions (1/16 precision)
  const sixteenths = Math.round(decimal * 16);

  if (sixteenths === 0) {
    return showUnit ? `${whole}"` : `${whole}`;
  }

  // Simplify fraction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(sixteenths, 16);
  const numerator = sixteenths / divisor;
  const denominator = 16 / divisor;

  const fractionPart = `${numerator}/${denominator}`;
  const result = whole > 0 ? `${whole} ${fractionPart}` : fractionPart;

  return showUnit ? `${result}"` : result;
}

/**
 * Parse a measurement string to a number
 * Supports: "36", "36in", "36\"", "914mm", "1 1/2", "3/4"
 */
export function parseMeasurement(input: string): {
  value: number;
  units: UnitSystem;
} {
  const trimmed = input.trim().toLowerCase();

  // Check for metric
  if (trimmed.includes("mm")) {
    const value = parseFloat(trimmed.replace("mm", ""));
    return { value, units: "metric" };
  }

  // Check for imperial with unit markers
  const cleaned = trimmed.replace(/["in]/g, "").trim();

  // Handle fractions (e.g., "1 1/2" or "3/4")
  if (cleaned.includes("/")) {
    const value = parseFraction(cleaned);
    return { value, units: "imperial" };
  }

  // Plain number - assume imperial by default
  const value = parseFloat(cleaned);
  return { value, units: "imperial" };
}

/**
 * Parse fractional measurements
 */
function parseFraction(input: string): number {
  const parts = input.split(/\s+/);

  if (parts.length === 1) {
    // Just a fraction like "3/4"
    const [num, denom] = parts[0].split("/").map(Number);
    return num / denom;
  }

  // Whole number plus fraction like "1 1/2"
  const whole = parseFloat(parts[0]);
  const [num, denom] = parts[1].split("/").map(Number);
  return whole + num / denom;
}

/**
 * Convert an entire project to a different unit system
 */
export function convertProject(project: any, toUnits: UnitSystem): any {
  const fromUnits = project.units || "imperial";

  if (fromUnits === toUnits) return project;

  const converted = { ...project, units: toUnits };

  // Convert all dimension fields
  if (converted.dimensions) {
    converted.dimensions = {
      ...converted.dimensions,
      width: convertUnits(converted.dimensions.width, fromUnits, toUnits),
      height: convertUnits(converted.dimensions.height, fromUnits, toUnits),
      depth: convertUnits(converted.dimensions.depth, fromUnits, toUnits),
      material_thickness: converted.dimensions.material_thickness
        ? convertUnits(
            converted.dimensions.material_thickness,
            fromUnits,
            toUnits
          )
        : undefined,
      back_panel_thickness: converted.dimensions.back_panel_thickness
        ? convertUnits(
            converted.dimensions.back_panel_thickness,
            fromUnits,
            toUnits
          )
        : undefined,
      toe_kick_height: converted.dimensions.toe_kick_height
        ? convertUnits(converted.dimensions.toe_kick_height, fromUnits, toUnits)
        : undefined,
    };

    if (converted.dimensions.frame) {
      converted.dimensions.frame = {
        ...converted.dimensions.frame,
        stile_width: converted.dimensions.frame.stile_width
          ? convertUnits(
              converted.dimensions.frame.stile_width,
              fromUnits,
              toUnits
            )
          : undefined,
        rail_width: converted.dimensions.frame.rail_width
          ? convertUnits(
              converted.dimensions.frame.rail_width,
              fromUnits,
              toUnits
            )
          : undefined,
      };
    }
  }

  // Convert gaps
  if (converted.drawers?.gap_between_drawers) {
    converted.drawers.gap_between_drawers = convertUnits(
      converted.drawers.gap_between_drawers,
      fromUnits,
      toUnits
    );
  }

  if (converted.doors?.gap_between_doors) {
    converted.doors.gap_between_doors = convertUnits(
      converted.doors.gap_between_doors,
      fromUnits,
      toUnits
    );
  }

  // Convert legs
  if (converted.custom_features?.legs?.height) {
    converted.custom_features.legs.height = convertUnits(
      converted.custom_features.legs.height,
      fromUnits,
      toUnits
    );
  }

  return converted;
}
```

## Frontend Implementation

### Vue Composable for Units

```typescript
// composables/useUnits.ts
import { computed, ref } from "vue";
import { useProjectStore } from "@/stores/project";
import {
  formatMeasurement,
  convertUnits,
  type UnitSystem,
} from "@/utils/units";

export function useUnits() {
  const projectStore = useProjectStore();

  const currentUnits = computed(
    () => projectStore.currentProject?.units || "imperial"
  );

  const displayUnits = ref<UnitSystem>(currentUnits.value);

  /**
   * Format a value for display
   */
  const format = (value: number, options?: any) => {
    return formatMeasurement(value, displayUnits.value, options);
  };

  /**
   * Convert a value for display (if display units differ from project units)
   */
  const display = (value: number) => {
    if (currentUnits.value === displayUnits.value) return value;
    return convertUnits(value, currentUnits.value, displayUnits.value);
  };

  /**
   * Toggle between imperial and metric display
   */
  const toggleDisplayUnits = () => {
    displayUnits.value =
      displayUnits.value === "imperial" ? "metric" : "imperial";
  };

  /**
   * Convert entire project to different units
   */
  const convertProjectUnits = async (toUnits: UnitSystem) => {
    await projectStore.convertUnits(toUnits);
  };

  return {
    currentUnits,
    displayUnits,
    format,
    display,
    toggleDisplayUnits,
    convertProjectUnits,
  };
}
```

### UI Component Example

```vue
<template>
  <div class="units-control">
    <label>Measurement System:</label>
    <select v-model="projectUnits" @change="handleUnitsChange">
      <option value="imperial">Imperial (inches)</option>
      <option value="metric">Metric (mm)</option>
    </select>

    <button @click="toggleDisplay" class="toggle-btn">
      Show in {{ displayUnits === "imperial" ? "Metric" : "Imperial" }}
    </button>
  </div>

  <div class="dimension-input">
    <label>Width:</label>
    <input
      type="number"
      v-model.number="width"
      :step="currentUnits === 'imperial' ? 0.0625 : 1"
    />
    <span class="unit-label">{{ unitLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUnits } from "@/composables/useUnits";

const {
  currentUnits,
  displayUnits,
  format,
  toggleDisplayUnits,
  convertProjectUnits,
} = useUnits();

const unitLabel = computed(() =>
  currentUnits.value === "imperial" ? '"' : "mm"
);

const handleUnitsChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  await convertProjectUnits(target.value as "imperial" | "metric");
};

const toggleDisplay = () => {
  toggleDisplayUnits();
};
</script>
```

## Common Conversions Reference

### Standard Material Thicknesses

| Imperial | Metric (mm) | Common Use                  |
| -------- | ----------- | --------------------------- |
| 1/4"     | 6mm         | Back panels, drawer bottoms |
| 1/2"     | 12mm        | Drawer boxes, light shelves |
| 5/8"     | 16mm        | European standard           |
| 3/4"     | 19mm        | Standard cabinet grade      |
| 1"       | 25mm        | Thick shelves, tops         |
| 1-1/2"   | 38mm        | Face frames, solid wood     |

### Standard Gaps & Clearances

| Imperial | Metric | Use          |
| -------- | ------ | ------------ |
| 1/16"    | 1.5mm  | Tight fit    |
| 1/8"     | 3mm    | Standard gap |
| 3/16"    | 5mm    | Loose fit    |
| 1/4"     | 6mm    | Wide gap     |

### Typical Cabinet Dimensions

| Dimension           | Imperial  | Metric         |
| ------------------- | --------- | -------------- |
| Base cabinet height | 34.5"     | 876mm          |
| Wall cabinet height | 30" - 42" | 762mm - 1067mm |
| Counter depth       | 24"       | 610mm          |
| Toe kick height     | 4"        | 102mm          |
| Standard door width | 12" - 24" | 305mm - 610mm  |

## API Response Format

When returning measurements via API, include both the stored value and formatted display:

```json
{
  "dimensions": {
    "width": {
      "value": 36,
      "units": "imperial",
      "display": "36\"",
      "metric_equivalent": "914mm"
    }
  }
}
```

Or simplified:

```json
{
  "units": "imperial",
  "dimensions": {
    "width": 36,
    "width_display": "36\"",
    "width_mm": 914
  }
}
```

## Validation Rules

### Imperial

- Minimum increment: 1/16" (0.0625)
- Typical range: 0.0625" - 120"
- Display: Decimal or fractional

### Metric

- Minimum increment: 1mm
- Typical range: 1mm - 3000mm
- Display: Whole numbers preferred

## Best Practices

1. **Store in project units** - Don't convert back and forth
2. **Convert only for display** - Keep original precision
3. **Round appropriately** - Imperial to 1/16", Metric to 1mm
4. **Validate inputs** - Ensure reasonable ranges
5. **Preserve user intent** - If user enters "3/4", store as 0.75, not 0.7500001
6. **Export flexibility** - Allow users to export in either unit system

---

This system provides full flexibility for international users while maintaining precision for woodworking applications.
