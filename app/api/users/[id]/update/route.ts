import type { NextApiRequest, NextApiResponse } from 'next';
import { RegisterSchema } from '@/schemas';
import { db } from '@/lib/db';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'PUT') {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid user ID');
      }

      const formData = req.body;
      const parsedData = RegisterSchema.parse(formData);

      const user = await db.user.findUnique({ where: { id } });
      if (!user) {
        throw new Error('User not found');
      }

      const updatedData: any = {
        firstName: parsedData.FirstName,
        fatherName: parsedData.FatherName,
        grandFatherName: parsedData.GrandFatherName,
        familyName: parsedData.FamilyName,
        username: parsedData.username,
        email: parsedData.email,
        nationalID: parsedData.NationalID,
        BDate: parsedData.BDate,
        mobileNumber: parsedData.MobileNumber,
        swiftCode: parsedData.swiftCode,
        IBAN: parsedData.IBAN,
        bankName: parsedData.bankName,
        accountId: parsedData.accountId,
      };

      const updatedUser = await db.user.update({
        where: { id },
        data: updatedData,
      });

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
