"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Camel {
  ownerId: string;
  id: string;
  name: string;
  age: string;
  sex: string;
  IBAN: string;
  bankName: string;
  ownerName: string;
  swiftCode: string;
}

interface Loop {
  eventId: string;
  id: string;
  age: string;
  sex: string;
  name?: string;
  capacity: number;
}

interface Event {
  id: string;
  name: string;
}

interface ReportData {
  rank: number;
  camelId: number;
  camelName: string;
  loopId: string;
  loopName: string;
  eventId: string;
  eventName: string;
  IBAN: string;
  bankName: string;
  swiftCode: string;
  ownerName: string;
  ownerId: string;
}

export const ReportForm = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [camels, setCamels] = useState<Camel[]>([]);
  const [selectedCamel, setSelectedCamel] = useState<string | null>(null);
  const [rank, setRank] = useState<number>(1);
  const [results, setResults] = useState<ReportData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events/getEvents")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch(() => setError("Error fetching events"));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetch(`/api/events/${selectedEvent}/getLoops`)
        .then((response) => response.json())
        .then((data) => {
          setLoops(data);
        })
        .catch(() => setError("Error fetching loops"));
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedLoop && selectedEvent) {
      fetch(
        `/api/events/${selectedEvent}/getLoops/${selectedLoop}/registeredCamels`
      )
        .then((response) => response.json())
        .then((data) => {
          const formattedCamels = data.map((camel: any) => ({
            id: camel.id,
            name: camel.name,
            age: camel.age,
            sex: camel.sex,
            IBAN: camel.IBAN ?? "N/A",
            bankName: camel.bankName ?? "N/A",
            swiftCode: camel.swiftCode ?? "N/A",
            ownerName: camel.ownerName ?? "N/A",
            ownerId: camel.ownerId ?? "N/A",
          }));
          setCamels(formattedCamels);
        })
        .catch(() => setError("Error fetching camels"));
    }
  }, [selectedLoop, selectedEvent]);

  function translateAge(age: string) {
    switch (age) {
      case "GradeOne":
        return "مفرد";
      case "GradeTwo":
        return "حقايق";
      case "GradeThree":
        return "لقايا";
      case "GradeFour":
        return "جذاع";
      case "GradeFive":
        return "ثنايا";
      case "GradeSixMale":
        return "زمول";
      case "GradeSixFemale":
        return "حيل";
      default:
        return "";
    }
  }

  function translateSex(sex: string) {
    switch (sex) {
      case "Male":
        return "قعدان";
      case "Female":
        return "بكار";
      default:
        return "";
    }
  }

  const handleAddReport = () => {
    if (!selectedCamel || !selectedLoop || !selectedEvent) {
      setError("All fields are required.");
      return;
    }

    if (results.some((report) => report.camelId === Number(selectedCamel))) {
      setError("The camel is already added.");
      return;
    }

    if (results.some((report) => report.rank === rank)) {
      setError("Duplicate rank not allowed.");
      return;
    }

    const event = events.find((event) => event.id === selectedEvent);
    const loop = loops.find((loop) => loop.id === selectedLoop);
    const camel = camels.find((camel) => camel.id === selectedCamel);

    if (!camel) {
      setError("Camel not found.");
      return;
    }

    const reportData: ReportData = {
      rank,
      camelId: Number(selectedCamel),
      camelName: camel.name || "Unknown Camel",
      loopId: selectedLoop,
      loopName: loop
        ? `${translateAge(loop.age)} - ${translateSex(loop.sex)}`
        : "Unknown Loop",
      eventId: selectedEvent,
      eventName: event?.name || "Unknown Event",
      IBAN: camel?.IBAN || "N/A",
      bankName: camel?.bankName || "N/A",
      swiftCode: camel?.swiftCode || "N/A",
      ownerName: camel?.ownerName || "N/A",
      ownerId: camel?.ownerId || "N/A",
    };

    setResults((prevResults) => {
      const newResults = [...prevResults, reportData];
      newResults.sort((a, b) => a.rank - b.rank);
      return newResults;
    });

    setSelectedCamel(null);
    setRank(1);
    setError(null);
  };

  const handleRemoveReport = (camelId: number) => {
    setResults((prevResults) =>
      prevResults.filter((report) => report.camelId !== camelId)
    );
  };

  const handlePublish = () => {
    if (results.length === 0) {
      setError("No results to publish.");
      return;
    }

    fetch("/api/results/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(results),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error publishing results");
        return response.json();
      })
      .then(() => {
        alert("Results published successfully!");
        setResults([]);
      })
      .catch(() => setError("Error publishing results"));
  };

  const handleExportToExcel = () => {
    if (results.length === 0) {
      setError("No results to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "camel_race_results.xlsx");
  };

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="w-full">
          <Select value={selectedEvent || ""} onValueChange={setSelectedEvent}>
            <SelectTrigger className="border p-2 rounded w-full">
              <SelectValue placeholder="اختر فعالية" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEvent && (
          <div className="w-full">
            <Select value={selectedLoop || ""} onValueChange={setSelectedLoop}>
              <SelectTrigger className="border p-2 rounded w-full">
                <SelectValue placeholder="اختر شوط" />
              </SelectTrigger>
              <SelectContent>
                {loops
                  .filter(
                    (loop) =>
                      !results.some((result) => result.loopId === loop.id)
                  )
                  .map((loop) => (
                    <SelectItem key={loop.id} value={loop.id}>
                      {translateAge(loop.age)} - {translateSex(loop.sex)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedLoop && (
          <div className="w-full">
            <Select
              value={selectedCamel || ""}
              onValueChange={setSelectedCamel}
            >
              <SelectTrigger className="border p-2 rounded w-full">
                <SelectValue placeholder="اختر الهجن" />
              </SelectTrigger>
              <SelectContent>
                {camels.map((camel) => (
                  <SelectItem key={camel.id} value={camel.id}>
                    {camel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {selectedCamel && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <p>
                Camel Name:{" "}
                {camels.find((camel) => camel.id === selectedCamel)?.name}
              </p>
            </div>
            <div>
              <p>
                Owner:{" "}
                {camels.find((camel) => camel.id === selectedCamel)
                  ?.ownerName || "Unknown"}
              </p>
            </div>
            <div className="w-full">
              <Select
                value={rank.toString()}
                onValueChange={(value) => setRank(Number(value))}
              >
                <SelectTrigger className="border p-2 rounded w-full">
                  <SelectValue placeholder="الترتيب" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: camels.length }, (_, i) => i + 1).map(
                    (value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleAddReport}>اضف نتيجة</Button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handlePublish}>
          اعلان النتيجة
        </Button>
        <Button variant="outline" onClick={handleExportToExcel}>
          اطبع البيانات
        </Button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <Table className="mt-8 w-full overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Camel</TableHead>
            <TableHead>Loop</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>IBAN</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>Swift Code</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((report) => (
            <TableRow className="text-right" key={report.camelId}>
              <TableCell>{report.rank}</TableCell>
              <TableCell>{report.camelName}</TableCell>
              <TableCell>{report.loopName}</TableCell>
              <TableCell>{report.ownerName}</TableCell>
              <TableCell>{report.IBAN}</TableCell>
              <TableCell>{report.bankName}</TableCell>
              <TableCell>{report.swiftCode}</TableCell>
              <TableCell>
                <Button
                  className="bg-red-500"
                  onClick={() => handleRemoveReport(report.camelId)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
