"use client";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BackButton } from "./back-button";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  FirstName: string;
  FatherName: string;
  GrandFatherName: string;
  FamilyName: string;
  username: string;
  email: string;
  NationalID: string;
  BDate: string;
  MobileNumber: string;
  image?: string;
  role: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserProfile() {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("! توكن مفقود ، الرجاء تسجيل الدخول");
        router.push("/login"); // Redirect to login page if no token
        return;
      }

      try {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch user profile.");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("An unexpected error occurred.");
      }
    }

    fetchUserProfile();
  }, []); // Adding the dependency array to ensure the effect runs only once on mount

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="bg-[url('/WadiRam.jpeg')] h-[300px] relative bg-no-repeat bg-cover bg-top">
        <div className="bg-black/50 absolute inset-0" />
        <div className="container relative h-full">
          <div className="w-[50px] aspect-square absolute top-4 left-4">
            <BackButton className="bg-white/70 text-black" href="/">
              <AiOutlineArrowLeft size={24} />
            </BackButton>
          </div>
          <div className="flex items-end justify-end h-full translate-y-[25%] max-sm:justify-center">
            <Image
              className="rounded-full border-2 border-black shadow-md"
              src="/PFP.jpg"
              width={200}
              height={200}
              alt="pfp"
              priority
            />
          </div>
        </div>
      </div>
      <div
        className="container w-full text-right
   mt-28 max-sm:text-center"
      >
        <h1 className="text-5xl font-semibold">أهلا {user.username}</h1>
        <div className="mt-10">
          <h2 className="text-2xl">: الهجن المسجلة</h2>
          <Button className="mr-5">طباعة البيانات</Button>
        </div>
      </div>
      <Table className="container text-right mt-10" id="myCamels">
        <TableCaption>الهجن المضافة</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">الفئة / السن</TableHead>
            <TableHead>رقم الشريحة</TableHead>
            <TableHead>اسم الهجين</TableHead>
            <TableHead className="text-right">التسلسل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">مثال</TableCell>
            <TableCell>مثال</TableCell>
            <TableCell>مثال</TableCell>
            <TableCell className="text-right">مثال</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Profile;
