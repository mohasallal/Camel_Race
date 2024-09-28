import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Camel {
  id: string;
  name: string;
  age: string;
  sex: string;
  ownerName: string;
  camelID: string; // إضافة خاصية رقم الشريحة هنا
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

// المكون الرئيسي للجدول
export const RegisteredCamelsTable = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // جلب الأحداث عند تحميل المكون
  useEffect(() => {
    fetch("/api/events/getEvents")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => setError("Error fetching events"));
  }, []);

  // جلب الأشواط عند اختيار فعالية
  useEffect(() => {
    // جلب الأشواط والهجن المسجلة لكل فعالية
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

  if (error) return <p>{error}</p>;

  function translateAge(Age: string) {
    switch (Age) {
      case "GradeOne":
        return "مفرد";
        break;
      case "GradeTwo":
        return "حقايق";
        break;
      case "GradeThree":
        return "لقايا";
        break;
      case "GradeFour":
        return "جذاع";
        break;
      case "GradeFive":
        return "ثنايا";
        break;
      case "GradeSixMale":
        return "زمول";
        break;
      case "GradeSixFemale":
        return "حيل";
    }
  }

  function translateSex(sex: string) {
    switch (sex) {
      case "Male":
        return "قعدان";
        break;
      case "Female":
        return "بكار";
        break;
      default:
        return "";
    }
  }

  function translateTime(time: string) {
    switch (time) {
      case "Morning":
        return "صباحي";
        break;
      case "Evening":
        return "مسائي";
        break;
      default:
        return "";
    }
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4">
        {/* اختيار الفعالية */}
        <select
          className="border p-2 rounded w-[300px]"
          value={selectedEvent || ""}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">اختر فعالية</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      <Table className="w-full" id="RegisteredCamels">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Camel Name</TableHead>
            <TableHead className="w-[200px]">Age / Sex</TableHead>
            <TableHead className="w-[200px]">Owner</TableHead>{" "}
            {/* Updated header */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {camels.map((camel) => (
            <TableRow key={camel.id}>
              <TableCell className="text-right">{camel.name}</TableCell>
              <TableCell className="text-right">
                {translateAge(camel.age) + "/" + translateSex(camel.sex)}
              </TableCell>
              <TableCell className="text-right">{camel.ownerName}</TableCell>{" "}
              {/* Display owner name */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
