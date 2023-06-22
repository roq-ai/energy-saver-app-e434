import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { residentialUserValidationSchema } from 'validationSchema/residential-users';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.residential_user
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getResidentialUserById();
    case 'PUT':
      return updateResidentialUserById();
    case 'DELETE':
      return deleteResidentialUserById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getResidentialUserById() {
    const data = await prisma.residential_user.findFirst(convertQueryToPrismaUtil(req.query, 'residential_user'));
    return res.status(200).json(data);
  }

  async function updateResidentialUserById() {
    await residentialUserValidationSchema.validate(req.body);
    const data = await prisma.residential_user.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteResidentialUserById() {
    const data = await prisma.residential_user.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
