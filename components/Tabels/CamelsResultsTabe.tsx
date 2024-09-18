"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Camel {
  id: string;
  name: string;
  age: string;
  sex: string;
  owner: string;
}

interface Loop {
  eventId: string;
  id: string;
  age: string;
  sex: string;
}

interface Event {
  id: string;
  name: string;
}

interface ReportData {
  rank: number;
  camelId: string;
  loopId: string;
  eventId: string;
  IBAN: string;
  bankName: string;
}

interface UserProfile {
  IBAN: string;
  bankName: string;
  username: string;
}

export const ReportForm = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [camels, setCamels] = useState<Camel[]>([]);
  const [selectedCamel, setSelectedCamel] = useState<string | null>(null);
  const [rank, setRank] = useState<number>(1);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((response) => response.json())
      .then((data: UserProfile) => setUserProfile(data))
      .catch((error) => setError("Error fetching user profile"));
  }, []);

  useEffect(() => {
    fetch("/api/events/getEvents")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => setError("Error fetching events"));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetch(`/api/events/${selectedEvent}/getLoops`)
        .then((response) => response.json())
        .then((data) => {
          const filteredLoops = data.filter(
            (loop: Loop) => loop.eventId === selectedEvent
          );
          setLoops(filteredLoops);
        })
        .catch((error) => setError("Error fetching loops"));
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedLoop) {
      fetch(
        `/api/events/${selectedEvent}/getLoops/${selectedLoop}/registeredCamels`
      )
        .then((response) => response.json())
        .then((data) => setCamels(data))
        .catch((error) => setError("Error fetching camels"));
    }
  }, [selectedLoop]);

  useEffect(() => {
    if (selectedCamel) {
      const camel = camels.find((camel) => camel.id === selectedCamel);
      if (camel) setOwnerName(camel.owner);
    }
  }, [selectedCamel, camels]);

  const handleSubmit = () => {
    if (
      !selectedCamel ||
      !selectedLoop ||
      !selectedEvent ||
      !userProfile?.IBAN ||
      !userProfile?.bankName
    ) {
      setError("All fields are required.");
      return;
    }

    const reportData: ReportData = {
      rank,
      camelId: selectedCamel,
      loopId: selectedLoop,
      eventId: selectedEvent,
      IBAN: userProfile.IBAN,
      bankName: userProfile.bankName,
    };

    fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error submitting report");
        return response.json();
      })
      .then(() => {
        alert("Report submitted successfully!");
        setSelectedCamel(null);
        setSelectedLoop(null);
        setSelectedEvent(null);
        setRank(1);
      })
      .catch((error) => setError("Error submitting report"));
  };

  if (error) return <p>{error}</p>;

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

        {/* Loop Select */}
        {selectedEvent && (
          <div className="w-full">
            <Select value={selectedLoop || ""} onValueChange={setSelectedLoop}>
              <SelectTrigger className="border p-2 rounded w-full">
                <SelectValue placeholder="اختر شوط" />
              </SelectTrigger>
              <SelectContent>
                {loops.map((loop) => (
                  <SelectItem key={loop.id} value={loop.id}>
                    {translateAge(loop.age)}/{translateSex(loop.sex)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Camel Select */}
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

      {/* Table with Camel Data */}
      {selectedCamel && (
        <div className="overflow-x-auto">
          <Table className="min-w-full bg-white shadow-md rounded-lg">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Camel Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>IBAN</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="text-right">
                <TableCell>
                  {camels.find((camel) => camel.id === selectedCamel)?.name}
                </TableCell>
                <TableCell>{ownerName}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    className="border p-2 rounded w-[80px] text-center"
                    value={rank}
                    onChange={(e) => setRank(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>{userProfile?.IBAN || "N/A"}</TableCell>
                <TableCell>{userProfile?.bankName || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Submit Report
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
