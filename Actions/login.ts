"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values);

  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "! حقل غير صالح" };
  }

  const { password, email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "! المستخدم غير موجود" };
  }

  const isMatched = await compare(password, existingUser.password);
  if (!isMatched) {
    return { error: "! كلمة المرور غير صحيحة" };
  }

  const token = generateToken(existingUser);

  if (token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
    redirect("/profile");
  }

  return { token, success: "! تم تسجيل الدخول بنجاح" };
};

function generateToken(existingUser: {
  id: string;
  email: string;
  username: string;
}) {
  try {
    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Could not generate token");
  }
}
