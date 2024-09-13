"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { UpdateUserSchema } from "@/schemas";
import bcryptjs from "bcryptjs";

export const updateUser = async (values: z.infer<typeof UpdateUserSchema>) => {
  const validatedFields = UpdateUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "! حقل غير صالح" };
  }

  const {
    id,
    FirstName,
    FatherName,
    GrandFatherName,
    FamilyName,
    username,
    email,
    NationalID,
    BDate,
    MobileNumber,
    role,
    password,
    swiftCode,
    IBAN,
    bankName,
    accountId,
  } = validatedFields.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return { error: "المستخدم غير موجود" };
    }

    const updateData: any = {
      FirstName,
      FatherName,
      GrandFatherName,
      FamilyName,
      username,
      email,
      NationalID,
      BDate,
      MobileNumber,
      role,
      bankName,
      accountId
    };

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (swiftCode) {
      const hashedSwift = await bcryptjs.hash(swiftCode, 10);
      updateData.swiftCode = hashedSwift;
    }

    if (IBAN) {
      const hashedIBAN = await bcryptjs.hash(IBAN, 15);
      updateData.IBAN = hashedIBAN;
    }

    await db.user.update({
      where: { id },
      data: updateData,
    });

    return {
      success: "! تم تحديث المعلومات",
    };
  } catch (error) {
    console.error("Update error:", error);
    return { error: "حدث خطأ أثناء تحديث المعلومات" };
  }
};
