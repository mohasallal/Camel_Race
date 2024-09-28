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
}

interface Loop {
  eventId: string;
  id: string;
  age: string;
  sex: string;
  camels?: Camel[]; // إضافة خاصية الجمال هنا
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
      .catch(() => setError("Error fetching events"));
  }, []);

  // جلب الأشواط عند اختيار فعالية
  useEffect(() => {
    if (selectedEvent) {
      fetch(`/api/events/${selectedEvent}/getLoops`)
        .then((response) => response.json())
        .then((loopData) => {
          // جلب الجمال لكل شوط بشكل متزامن
          const loopPromises = loopData.map(loop =>
            fetch(`/api/events/${selectedEvent}/getLoops/${loop.id}/registeredCamels`)
              .then(res => res.json())
              .then(camelsData => ({ ...loop, camels: camelsData }))
          );

          Promise.all(loopPromises).then(setLoops); // تحديث الحالة بالأشواط مع الجمال
        })
        .catch(() => setError("Error fetching loops"));
    } else {
      setLoops([]); // إعادة تعيين الأشواط إذا لم يتم اختيار فعالية
    }
  }, [selectedEvent]);

  if (error) return <p>{error}</p>;

  function translateAge(age: string) {
    switch (age) {
      case "GradeOne": return "مفرد";
      case "GradeTwo": return "حقايق";
      case "GradeThree": return "لقايا";
      case "GradeFour": return "جذاع";
      case "GradeFive": return "ثنايا";
      case "GradeSixMale": return "زمول";
      case "GradeSixFemale": return "حيل";
      default: return age;
    }
  }

  function translateSex(sex: string) {
    switch (sex) {
      case "Male": return "قعدان";
      case "Female": return "بكار";
      default: return "";
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

      {/* جدول الجمال المسجلة */}
      <Table className="w-full" id="RegisteredCamels">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">#</TableHead>
            <TableHead className="text-right">اسم المطية</TableHead>
            <TableHead className="text-right">النوع</TableHead>
            <TableHead className="text-right">مالك المطية</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loops.map((loop) => (
            <React.Fragment key={loop.id}>
              <TableRow>
                <TableCell colSpan={4} className="font-bold text-right">
                  {translateAge(loop.age)} - {loop.id} {/* عرض العمر ورقم الشوط */}
                </TableCell>
              </TableRow>
              {loop.camels && loop.camels.map((camel, index) => (
                <TableRow key={camel.id}>
                  <TableCell className="text-right">{index + 1}</TableCell>
                  <TableCell className="text-right">{camel.name}</TableCell>
                  <TableCell className="text-right">
                    {translateSex(camel.sex)}
                  </TableCell>
                  <TableCell className="text-right">{camel.ownerName}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
