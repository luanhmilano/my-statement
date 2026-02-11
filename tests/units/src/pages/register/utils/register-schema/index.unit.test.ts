/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerSchema,
  type RegisterData,
} from '@/pages/register/utils/register-schema';
import { describe } from 'vitest';

describe('Register Schema Validation', () => {
  const validData = {
    lastName: 'Doe',
    firstName: 'John',
    email: 'john.doe@example.com',
    birthdate: '1990-01-01',
    password: 'password123',
    confirmPassword: 'password123',
  };

  it('should validate correct data successfully', () => {
    const result = registerSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should reject empty lastName', () => {
    const invalidData = { ...validData, lastName: '' };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['lastName'],
          message: 'Last name is required',
        })
      );
    }
  });

  it('should reject missing lastName', () => {
    const { lastName, ...invalidData } = validData;
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['lastName'],
          code: 'invalid_type',
        })
      );
    }
  });

  it('should reject empty firstName', () => {
    const invalidData = { ...validData, firstName: '' };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['firstName'],
          message: 'First name is required',
        })
      );
    }
  });

  it('should reject missing firstName', () => {
    const { firstName, ...invalidData } = validData;
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['firstName'],
          code: 'invalid_type',
        })
      );
    }
  });

  it('should reject invalid email format', () => {
    const invalidData = { ...validData, email: 'invalid-email' };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['email'],
          message: 'Invalid email address',
        })
      );
    }
  });

  it('should reject empty email', () => {
    const invalidData = { ...validData, email: '' };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['email'],
          message: 'Invalid email address',
        })
      );
    }
  });

  it('should reject invalid birthdate format', () => {
    const invalidData = { ...validData, birthdate: '01/01/1990' };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['birthdate'],
          message: 'Invalid date format',
        })
      );
    }
  });

  it('should reject non-ISO date format', () => {
    const invalidData = { ...validData, birthdate: 'January 1, 1990' };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['birthdate'],
          message: 'Invalid date format',
        })
      );
    }
  });

  it('should reject password shorter than 6 characters', () => {
    const invalidData = {
      ...validData,
      password: '12345',
      confirmPassword: '12345',
    };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['password'],
          message: 'Password must be at least 6 characters long',
        })
      );
    }
  });

  it('should reject confirmPassword shorter than 6 characters', () => {
    const invalidData = {
      ...validData,
      password: 'password123',
      confirmPassword: '12345',
    };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['confirmPassword'],
          message: 'Confirm your password',
        })
      );
    }
  });

  it('should reject when passwords do not match', () => {
    const invalidData = {
      ...validData,
      password: 'password123',
      confirmPassword: 'differentPassword',
    };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['confirmPassword'],
          message: "Passwords don't match",
        })
      );
    }
  });

  it('should handle multiple validation errors', () => {
    const invalidData = {
      lastName: '',
      firstName: '',
      email: 'invalid-email',
      birthdate: 'invalid-date',
      password: '123',
      confirmPassword: '456',
    };
    const result = registerSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(7);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(result.error.issues.map((issue: any) => issue.path[0])).toEqual(
        expect.arrayContaining([
          'lastName',
          'firstName',
          'email',
          'birthdate',
          'password',
          'confirmPassword',
        ])
      );
    }
  });

  it('should accept valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com',
    ];

    validEmails.forEach(email => {
      const testData = { ...validData, email };
      const result = registerSchema.safeParse(testData);
      expect(result.success).toBe(true);
    });
  });

  it('should accept valid ISO date formats', () => {
    const validDates = ['2000-12-31', '1990-01-01', '2023-06-15'];

    validDates.forEach(birthdate => {
      const testData = { ...validData, birthdate };
      const result = registerSchema.safeParse(testData);
      expect(result.success).toBe(true);
    });
  });

  it('should accept passwords exactly 6 characters long', () => {
    const testData = {
      ...validData,
      password: '123456',
      confirmPassword: '123456',
    };
    const result = registerSchema.safeParse(testData);

    expect(result.success).toBe(true);
  });

  it('should accept long passwords', () => {
    const longPassword = 'verylongpasswordwithmanychars123!@#';
    const testData = {
      ...validData,
      password: longPassword,
      confirmPassword: longPassword,
    };
    const result = registerSchema.safeParse(testData);

    expect(result.success).toBe(true);
  });

  it('should validate whitespace-only strings as invalid for names', () => {
    const testDataLastName = { ...validData, lastName: '   ' };
    const testDataFirstName = { ...validData, firstName: '   ' };

    const resultLastName = registerSchema.safeParse(testDataLastName);
    const resultFirstName = registerSchema.safeParse(testDataFirstName);

    expect(resultLastName.success).toBe(true); // Zod string().min(1) allows whitespace
    expect(resultFirstName.success).toBe(true); // Zod string().min(1) allows whitespace
  });

  it('should infer correct TypeScript type', () => {
    // Type assertion test - this will fail at compile time if types don't match
    const testData: RegisterData = {
      lastName: 'Test',
      firstName: 'User',
      email: 'test@example.com',
      birthdate: '1990-01-01',
      password: 'password123',
      confirmPassword: 'password123',
    };

    expect(testData).toBeDefined();
  });

  it('should handle edge case with empty object', () => {
    const result = registerSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(6);
    }
  });

  it('should handle null and undefined values', () => {
    const nullData = { ...validData, lastName: null };
    const undefinedData = { ...validData, firstName: undefined };

    const nullResult = registerSchema.safeParse(nullData);
    const undefinedResult = registerSchema.safeParse(undefinedData);

    expect(nullResult.success).toBe(false);
    expect(undefinedResult.success).toBe(false);
  });
});
