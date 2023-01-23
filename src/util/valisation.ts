// validation
export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  positive?: boolean;
  min?: number;
  max?: number;
}

export function validate(validatableInput: Validatable): boolean {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length > 0;
  }

  if (
    typeof validatableInput.value === 'string' &&
    validatableInput.minLength != null
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length >= validatableInput.minLength;
  }

  if (
    typeof validatableInput.value === 'string' &&
    validatableInput.maxLength != null
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length <= validatableInput.maxLength;
  }

  if (typeof validatableInput.value === 'number' && validatableInput.positive) {
    isValid = isValid && validatableInput.value > 0;
  }

  if (
    typeof validatableInput.value === 'number' &&
    validatableInput.min != null
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    typeof validatableInput.value === 'number' &&
    validatableInput.max != null
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}
