"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventsSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEventAction } from "@/Actions/Events";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

export const CreateEventForm = ({
  className,
  onClose,
}: {
  className?: string;
  onClose: () => void;
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof EventsSchema>>({
    resolver: zodResolver(EventsSchema),
    defaultValues: {
      name: "",
      StartDate: new Date(),
      EndDate: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof EventsSchema>) => {
    try {
      const event = await createEventAction(values);
      console.log("Event created successfully:", event);
      setMessage("Event created successfully!");
      setTimeout(() => {
        onClose(); // Close the form after a delay
      }, 1000); // Delay of 1 second
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("Error creating event.");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-white/50 z-50 flex items-center justify-center ${className}`}
    >
      <div className="relative p-6 bg-white rounded-lg shadow-lg max-w-lg w-full flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <div className="space-y-4 text-right w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-end">
                      : اسم الحدث
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="اسم الحدث"
                        className="outline-none border-t-0 border-r-0 border-l-0 text-right focus:outline-none focus:ring-0 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="StartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-end">
                      : تاريخ البداية
                    </FormLabel>
                    <FormControl>
                      <Input
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
                        placeholder="تاريخ البداية"
                        className="outline-none border-t-0 border-r-0 border-l-0 flex items-center justify-end focus:outline-none focus:ring-0 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="EndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-end">
                      : تاريخ النهاية
                    </FormLabel>
                    <FormControl>
                      <Input
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
                        placeholder="تاريخ النهاية"
                        className="outline-none border-t-0 border-r-0 border-l-0 flex items-center justify-end focus:outline-none focus:ring-0 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">إنشاء الحدث</Button>
          </form>
        </Form>
        {message && (
          <div className="mt-4 text-center text-gray-700">{message}</div>
        )}
      </div>
    </div>
  );
};
