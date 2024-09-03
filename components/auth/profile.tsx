"use client";
import { AiOutlineCamera, AiOutlineArrowLeft } from "react-icons/ai";
import { BackButton } from "./back-button";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

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
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    console.log("Profile component is mounted");
    async function fetchUserProfile() {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No token found, redirecting to login");
        setError("! توكن مفقود ، الرجاء تسجيل الدخول");
        router.push("/auth/login");
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
          if (data.image) setSelectedImage(data.image); // Use existing image if available
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
  }, [router]);

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToExcel = () => {
    const table = document.getElementById("myCamels");
    if (!table) {
      console.error("Table element not found");
      setError("Table element not found.");
      return;
    }

    try {
      const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
      XLSX.writeFile(workbook, "camels-data.xlsx");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      setError("An error occurred while exporting to Excel.");
    }
  };

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
            <div className="relative">
              <Image
                className="rounded-full aspect-square object-contain border-2 border-black shadow-md bg-white"
                src={selectedImage || "/PFP.jpg"}
                width={200}
                height={200}
                alt="Profile Picture"
                priority
              />
              <label className="absolute inset-0 bg-black opacity-0 hover:opacity-20 flex items-center justify-center cursor-pointer rounded-full">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handlePictureChange}
                />
                <span className="text-white">
                  <AiOutlineCamera size={24} />
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="container w-full text-right mt-28 max-sm:text-center">
        <h1 className="text-5xl font-semibold">أهلا {user.username}</h1>
      </div>

      <div className="container w-full text-right mt-10 max-sm:text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">الاسم الأول:</label>
            <input
              type="text"
              value={user.FirstName}
              readOnly
              className=" outline-none input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="bg-gray-200 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">اسم الأب:</label>
            <input
              type="text"
              value={user.FatherName}
              readOnly
              className="input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none "
            />
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">اسم الجد:</label>
            <input
              type="text"
              value={user.GrandFatherName}
              readOnly
              className="input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none "
            />
          </div>
          <div className="bg-gray-200 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">اسم العائلة:</label>
            <input
              type="text"
              value={user.FamilyName}
              readOnly
              className="input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none  focus:border-0 focus:ring-transparent"
            />
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">اسم المستخدم:</label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none "
            />
          </div>
          <div className="bg-gray-200 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">
              البريد الإلكتروني:
            </label>
            <input
              type="text"
              value={user.email}
              readOnly
              className="input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none "
            />
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">الرقم الوطني:</label>
            <input
              type="text"
              value={user.NationalID}
              readOnly
              className="input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none "
            />
          </div>
          <div className="bg-gray-200 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">تاريخ الميلاد:</label>
            <input
              type="text"
              value={user.BDate.split("T")[0]}
              readOnly
              className="input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none "
            />
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <label className="block text-gray-400 mb-1">رقم الهاتف:</label>
            <input
              type="text"
              value={user.MobileNumber}
              readOnly
              className="input-field w-full p-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none "
            />
          </div>
        </div>
      </div>

      <div className="container w-full text-center mt-28 max-sm:text-center">
        <div className="mt-10">
          <h2 className="text-2xl mb-5">: الهجن المسجلة</h2>
          <Button className="mr-5" onClick={exportToExcel}>
            طباعة البيانات
          </Button>
        </div>
      </div>
      <Table className="container text-right mt-10" id="myCamels">
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
