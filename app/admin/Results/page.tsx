"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { RaceResult } from "@prisma/client";
import { ReportForm } from "@/components/Tabels/CamelsResultsTabe";

const Page = () => {
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingResult, setEditingResult] = useState<RaceResult | null>(null);

  const exportToExcel = () => {
    const table = document.getElementById("ResultsTabel");
    if (!table) {
      setError("Table element not found.");
      return;
    }

    try {
      const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
      XLSX.writeFile(workbook, "users-data.xlsx");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      setError("An error occurred while exporting to Excel.");
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingResult(null);
  };

  const handleSubmitForm = (data: RaceResult) => {
    console.log("Form submitted:", data);
    handleCloseForm(); 
  };

  return (
    <div className="flex flex-1 h-screen">
      <div className="p-2 md:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex flex-col gap-2 h-full">
          <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col py-1 px-4">
            <div className="flex flex-row-reverse items-center justify-between">
              <h2 className="w-full flex justify-end text-3xl font-semibold my-2">
                : الهجن المسجلة
              </h2>
              <Button className="mr-5" onClick={exportToExcel}>
                طباعة البيانات
              </Button>
              <Button className="mr-5" onClick={() => setIsFormOpen(true)}>
                إضافة نتيجة
              </Button>
            </div>
            <div className="w-full h-full bg-gray-200 rounded-lg p-2 overflow-y-auto">
              {isFormOpen && (
                <ReportForm
                  onClose={handleCloseForm}
                  onSubmit={handleSubmitForm}
                  editingResult={editingResult}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
