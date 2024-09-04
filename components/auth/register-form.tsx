"use client";
import { CardWrapper } from "./card-wrapper";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { register } from "@/Actions/register";
import { RedirectButton } from "./redirect-button";
import { IconArrowBack } from "@tabler/icons-react";

interface UserProfile {
  role: string;
}

export const RegisterForm = () => {
  const [error, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);

    if (storedToken) {
      fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, []);
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
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setErrors("");
    setSuccess("");
    startTransition(() => {
      register(values)
        .then((data) => {
          if (data && typeof data === "object") {
            if (data.error) {
              setErrors(data.error);
            } else if (data.success) {
              setSuccess(data.success);
            }
          } else {
            setErrors("Unexpected response from the server.");
          }
        })
        .catch((err) => {
          console.error("Registration error:", err);
          setErrors("An error occurred while registering. Please try again.");
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
            <div className="max-sm:space-y-2 flex items-center justify-center gap-2 max-sm:block">
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
            </div>
            <div className="max-sm:space-y-2 flex items-center justify-center gap-2 max-sm:block">
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
            </div>

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
                        field.value && !isNaN(new Date(field.value).getTime())
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (!isNaN(newDate.getTime())) {
                          field.onChange(newDate);
                        } else {
                          console.error("Invalid date value");
                        }
                      }}
                      placeholder="تاريخ الولادة"
                      className="outline-none border-t-0 border-r-0 border-l-0 flex items-center justify-end focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="max-sm:space-y-2 flex items-center justify-center gap-2 max-sm:block">
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
            </div>
            {user?.role === "ADMIN" && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>: دور المستخدم</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="flex flex-row-reverse">
                          <SelectValue placeholder="اختار دور المستخدم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          className="flex flex-row-reverse"
                          value="SUPERVISOR"
                        >
                          مسؤول
                        </SelectItem>
                        <SelectItem
                          className="flex flex-row-reverse"
                          value="USER"
                        >
                          مستخدم
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                    : تأكيد كلمة السر
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      {...field}
                      placeholder="تأكيد كلمة المرور"
                      className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Button disabled={isPending} type="submit" className="w-full">
              انشاء حساب
            </Button>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
        </form>
      </Form>
    </CardWrapper>
  );
};
