"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import RegisterCamelForm from "./register-camels-form";
import * as XLSX from "xlsx";

interface Camel {
  id: string;
  age: number;
  sex: string;
  camelID: string;
  name: string;
}

const MyCamels = ({ userId }: { userId: string }) => {
  const [error, setError] = useState<string | null>(null);
  const [camelRegister, setCamelRegister] = useState(false);
  const [camels, setCamels] = useState<Camel[]>([]);

  const exportToExcel = () => {
    const table = document.getElementById("myCamels");
    if (!table) {
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

  const handleRegisterForm = () => {
    setCamelRegister((prev) => !prev);
  };

  return (
    <>
      <div className="container w-full text-center mt-20 max-sm:text-center">
        <div className="mt-10 flex items-center justify-between flex-row-reverse max-sm:flex-col max-sm:gap-5">
          <h2 className="text-2xl">: الهجن المسجلة</h2>
          <div className="flex items-center justify-center gap-1">
            <Button variant="outline" className="mr-5" onClick={exportToExcel}>
              طباعة البيانات
            </Button>
            <Button onClick={handleRegisterForm}>
              {camelRegister
                ? "إخفاء استمارة التسجيل"
                : "تسجيل الهجن في السباق"}
            </Button>
          </div>
        </div>
      </div>
      <Table className="container text-right mt-10 mb-20" id="myCamels">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">الفئة / السن</TableHead>
            <TableHead>رقم الشريحة</TableHead>
            <TableHead>اسم الهجين</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {camels.map((camel) => (
            <TableRow key={camel.id}>
              <TableCell className="font-medium w-[33%]">
                {camel.age} \ {camel.sex}
              </TableCell>
              <TableCell>{camel.camelID}</TableCell>
              <TableCell>{camel.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {camelRegister && (
        <RegisterCamelForm userId={userId} onClose={handleRegisterForm} />
      )}
    </>
  );
};

export default MyCamels;
