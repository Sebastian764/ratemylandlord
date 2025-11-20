// Shared file validation utilities for verification files

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
export const ALLOWED_FILE_TYPE = 'application/pdf';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a file for verification upload
 * @param file - The file to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateVerificationFile = (file: File): FileValidationResult => {
  // Validate file type
  if (file.type !== ALLOWED_FILE_TYPE) {
    return {
      isValid: false,
      error: 'Only PDF files are allowed for verification'
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size must be less than 15MB'
    };
  }

  return { isValid: true };
};
