import { AppError } from '../../src/domain/errors/AppError';
import { ERROR_CODES } from '../../src/domain/errors/errorCodes';

describe('AppError', () => {
  it('carries code, message, status and optional details, and survives instanceof', () => {
    const err = new AppError(ERROR_CODES.CONFLICT, 'Email taken', 409, { field: 'email' });
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AppError');
    expect(err.code).toBe('CONFLICT');
    expect(err.status).toBe(409);
    expect(err.message).toBe('Email taken');
    expect(err.details).toEqual({ field: 'email' });
  });

  it('has no details when none are given', () => {
    expect(AppError.notFound().details).toBeUndefined();
  });

  it.each([
    [AppError.validation('x'), 'VALIDATION_FAILED', 422],
    [AppError.unauthorized(), 'UNAUTHENTICATED', 401],
    [AppError.forbidden(), 'FORBIDDEN', 403],
    [AppError.notFound(), 'NOT_FOUND', 404],
    [AppError.conflict(), 'CONFLICT', 409],
    [AppError.internal(), 'INTERNAL_ERROR', 500],
  ])('helper builds %s', (err, code, status) => {
    expect(err.code).toBe(code);
    expect(err.status).toBe(status);
  });

  it('catalog holds exactly the 9 server codes of contracts/conventions.md section 2', () => {
    expect(Object.values(ERROR_CODES).sort()).toEqual(
      [
        'CONFLICT',
        'CSRF_INVALID',
        'FORBIDDEN',
        'INTERNAL_ERROR',
        'INVALID_CREDENTIALS',
        'NOT_FOUND',
        'RATE_LIMITED',
        'UNAUTHENTICATED',
        'VALIDATION_FAILED',
      ],
    );
  });
});
