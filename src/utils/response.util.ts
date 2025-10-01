// common/utils/response.util.ts
import { HttpStatus } from '@nestjs/common';

export const sendResponse = <T>(
  message: string,
  data: T,
  statusCode = HttpStatus.OK,
) => ({
  statusCode,
  success: true,
  message,
  data,
});
