/* eslint-disable @typescript-eslint/no-unused-vars */
import { loginSchema, type LoginData } from '@/pages/login/utils/login-schema';
import { describe, it, expect } from 'vitest';

describe('Login Schema Validation', () => {
  const validData = {
    email: 'user@example.com',
    password: 'password123',
  };

  it('should validate correct data successfully', () => {
    const result = loginSchema.safeParse(validData);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should reject invalid email format', () => {
    const invalidData = { ...validData, email: 'invalid-email' };
    const result = loginSchema.safeParse(invalidData);

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
    const result = loginSchema.safeParse(invalidData);

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

  it('should reject missing email', () => {
    const { email, ...invalidData } = validData;
    const result = loginSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['email'],
          code: 'invalid_type',
        })
      );
    }
  });

  it('should reject password shorter than 6 characters', () => {
    const invalidData = { ...validData, password: '12345' };
    const result = loginSchema.safeParse(invalidData);

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

  it('should reject empty password', () => {
    const invalidData = { ...validData, password: '' };
    const result = loginSchema.safeParse(invalidData);

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

  it('should reject missing password', () => {
    const { password, ...invalidData } = validData;
    const result = loginSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['password'],
          code: 'invalid_type',
        })
      );
    }
  });

  it('should handle multiple validation errors', () => {
    const invalidData = {
      email: 'invalid-email',
      password: '123',
    };
    const result = loginSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
      expect(result.error.issues.map(issue => issue.path[0])).toEqual(
        expect.arrayContaining(['email', 'password'])
      );
    }
  });

  it('should accept valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com',
      'firstname.lastname@company.com.br',
      'user_name@domain-name.net',
    ];

    validEmails.forEach(email => {
      const testData = { ...validData, email };
      const result = loginSchema.safeParse(testData);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'plainaddress',
      '@missingdomain.com',
      'missing@.com',
      'missing@domain',
      'spaces @domain.com',
      'double@@domain.com',
      'trailing.dot@domain.com.',
    ];

    invalidEmails.forEach(email => {
      const testData = { ...validData, email };
      const result = loginSchema.safeParse(testData);
      expect(result.success).toBe(false);
    });
  });

  it('should accept password exactly 6 characters long', () => {
    const testData = { ...validData, password: '123456' };
    const result = loginSchema.safeParse(testData);

    expect(result.success).toBe(true);
  });

  it('should accept long passwords', () => {
    const longPassword = 'verylongpasswordwithmanycharsandspecialsymbols123!@#$%^&*()';
    const testData = { ...validData, password: longPassword };
    const result = loginSchema.safeParse(testData);

    expect(result.success).toBe(true);
  });

  it('should accept passwords with special characters', () => {
    const specialPasswords = [
      'Pass123!',
      'myP@ssw0rd',
      'secure#123',
      'test$password',
      'user&pass123',
    ];

    specialPasswords.forEach(password => {
      const testData = { ...validData, password };
      const result = loginSchema.safeParse(testData);
      expect(result.success).toBe(true);
    });
  });

  it('should accept passwords with whitespace', () => {
    const testData = { ...validData, password: 'pass word' };
    const result = loginSchema.safeParse(testData);

    expect(result.success).toBe(true);
  });

  it('should infer correct TypeScript type', () => {
    // Type assertion test - this will fail at compile time if types don't match
    const testData: LoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    expect(testData).toBeDefined();
    expect(typeof testData.email).toBe('string');
    expect(typeof testData.password).toBe('string');
  });

  it('should handle edge case with empty object', () => {
    const result = loginSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
      expect(result.error.issues.map(issue => issue.path[0])).toEqual(
        expect.arrayContaining(['email', 'password'])
      );
    }
  });

  it('should handle null and undefined values', () => {
    const nullEmailData = { email: null, password: 'password123' };
    const undefinedPasswordData = { email: 'test@example.com', password: undefined };

    const nullResult = loginSchema.safeParse(nullEmailData);
    const undefinedResult = loginSchema.safeParse(undefinedPasswordData);

    expect(nullResult.success).toBe(false);
    expect(undefinedResult.success).toBe(false);
  });

  it('should handle numeric values as invalid', () => {
    const numericData = { email: 123, password: 456 };
    const result = loginSchema.safeParse(numericData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
      expect(result.error.issues.every(issue => issue.code === 'invalid_type')).toBe(true);
    }
  });

  it('should validate schema with parse method for valid data', () => {
    expect(() => loginSchema.parse(validData)).not.toThrow();
    const parsedData = loginSchema.parse(validData);
    expect(parsedData).toEqual(validData);
  });

  it('should throw error with parse method for invalid data', () => {
    const invalidData = { email: 'invalid', password: '123' };
    expect(() => loginSchema.parse(invalidData)).toThrow();
  });
});