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

const profile = () => {
  return (
    <div>
      {" "}
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
            />
          </div>
        </div>
      </div>
      <div
        className="container w-full text-right
   mt-28 max-sm:text-center"
      >
        <h1 className="text-5xl font-semibold">أهلا (الاسم)</h1>
        <div className="mt-10">
          <h2 className="text-2xl">: الهجن المسجلة</h2>
          <Button variant="outline" className="mr-5">
            طباعة البيانات
          </Button>
          <Button className="mt-5">اضف هجين</Button>
        </div>
      </div>
      <Table className="container text-right mt-10">
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

export default profile;
