import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  SettingsGetResponse,
  SettingsUpdateRequestSchema,
  SettingsUpdateResponse,
} from '@/common/dto/settings';
import { Prisma } from '@prisma/client';

export const getSettings = async (req: Request, res: Response<SettingsGetResponse>) => {
  const { session } = req;
  if (!session) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Missing auth middleware',
    });
  }
  const settings = await req.app.prisma.settings.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!settings) {
    return res.status(StatusCodes.OK).json({
      found: false,
    });
  }

  const { connectionDistance, lineThickness, particleNumber, particleSize } = settings;

  return res.status(StatusCodes.OK).json({
    found: true,
    settings: {
      connectionDistance,
      lineThickness: lineThickness.toNumber(),
      particleSize: particleSize.toNumber(),
      particleNumber,
    },
  });
};

export const updateSettings = async (req: Request, res: Response<SettingsUpdateResponse>) => {
  const { session } = req;
  if (!session) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Missing auth middleware',
    });
  }

  const result = await SettingsUpdateRequestSchema.safeParseAsync(req.body);

  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Invalid result send',
    });
  }

  const { connectionDistance, particleNumber, particleSize, lineThickness } = result.data;
  const { prisma } = req.app;

  await prisma.settings.upsert({
    where: {
      userId: session.id,
    },
    update: {
      lineThickness: new Prisma.Decimal(lineThickness),
      particleSize: new Prisma.Decimal(particleSize),
      particleNumber,
      connectionDistance,
    },
    create: {
      userId: session.id,
      lineThickness: new Prisma.Decimal(lineThickness),
      particleSize: new Prisma.Decimal(particleSize),
      particleNumber,
      connectionDistance,
    },
  });

  return res.status(StatusCodes.OK).json({
    message: 'succeed',
  });
};
