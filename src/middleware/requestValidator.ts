import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { ObjectSchema } from 'joi';

import { APIResponse } from '../utils/response';

export const requestValidator = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  const { body, query, params } = req;
  try {
    await schema.validateAsync({
      ...body,
      ...query,
      ...params,
    });
    next();
  } catch (err: any) {
    return APIResponse.error(res, err.message, err, httpStatus.BAD_REQUEST);
  }
};
