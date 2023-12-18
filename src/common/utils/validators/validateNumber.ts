import { getValueAsIs } from "../getValueAsIs";

type Field = Record<
  string,
  { min?: number; max?: number; isCritical: boolean }
>;
export const validateNumber = (field: Field) => {
  return Object.entries(field).reduce(
    (acc, [key, value]) => {
      const input = getValueAsIs(key);
      const number = parseInt(input);
      if (Number.isNaN(number)) {
        return {
          ...acc,
          [value.isCritical ? "errors" : "warnings"]: {
            [key]: `${key} is not a number`,
          },
        };
      }
      const isLessMinValue = value.min && number < value.min;
      const isMoreMaxValue = value.max && number > value.max;
      if (isLessMinValue) {
        return {
          ...acc,
          [value.isCritical ? "errors" : "warnings"]: {
            [key]: `${key} should be more than ${value.min}`,
          },
        };
      }
      if (isMoreMaxValue) {
        return {
          ...acc,
          [value.isCritical ? "errors" : "warnings"]: {
            [key]: `${key} should be less than ${value.max}`,
          },
        };
      }
      return acc;
    },
    { errors: {}, warnings: {} }
  );
};
