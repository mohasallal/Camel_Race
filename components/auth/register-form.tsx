"use client";
import { CardWrapper } from "./card-wrapper";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { register } from "@/Actions/register";
import { RedirectButton } from "./redirect-button";
import { IconArrowBack } from "@tabler/icons-react";

export const RegisterForm = () => {
  const [error, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      FirstName: "",
      FatherName: "",
      GrandFatherName: "",
      FamilyName: "",
      username: "",
      email: "",
      NationalID: "",
      BDate: new Date(),
      MobileNumber: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setErrors("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        setErrors(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      heading="🐫 إنشاء حساب جديد"
      headerLabel="تسجيل حساب"
      backButtonLabel="يوجد لديك حساب؟"
      backButtonHref="/auth/login"
      showSocial
    >
      <RedirectButton
        className="cursor-pointer absolute top-2 left-2"
        path="/admin/dashboard"
      >
        <IconArrowBack />
      </RedirectButton>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 text-right">
            <FormField
              control={form.control}
              name="FirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : الاسم
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      {...field}
                      placeholder="الاسم"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="FatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : اسم الأب
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      {...field}
                      placeholder="اسم الاب"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="GrandFatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : اسم الجد
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      {...field}
                      placeholder="اسم الجد"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="FamilyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : اسم العائلة
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      {...field}
                      placeholder="اسم العائلة"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NationalID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : الرقم الوطني
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      {...field}
                      placeholder="الرقم الوطني"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="BDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : تاريخ الولادة
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      placeholder="تاريخ الولادة"
                      className="outline-none border-t-0 border-r-0 border-l-0 flex items-center justify-end focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="MobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : رقم الهاتف
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      {...field}
                      placeholder="رقم الهاتف"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : اسم المستخدم
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      {...field}
                      placeholder="اسم المستخدم"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : البريد الالكتروني
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="email"
                      {...field}
                      placeholder="أدخل بريدك الالكتروني"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : كلمة السر
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      {...field}
                      placeholder="أدخل كلمة المرور"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-end">
                    : تأكيد السر
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      {...field}
                      placeholder="كلمة المرور"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="rounded-md w-full"
          >
            انشاء حساب
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
