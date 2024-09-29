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

interface Camel {
  id: string;
  name: string;
  age: string;
  sex: string;
  ownerName: string;
  camelID: string;
}

interface Event {
  EndDate: any;
  id: string;
  name: string;
  endDate: string;
}

interface Loop {
  sex: string;
  age: string;
  id: string;
  name: string;
  date: string;
  eventId: string;
}

export const RegisteredCamelsOut = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [filteredLoops, setFilteredLoops] = useState<Loop[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [camels, setCamels] = useState<Camel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loopName, setLoopName] = useState<string | null>(null); // حالة لاسم الشوط

  const isEventEnded = (endDate: string): boolean => {
    const currentDate = new Date(); // التاريخ الحالي
    const eventEndDate = new Date(endDate); // تحويل endDate إلى كائن Date
    console.log(
      `التاريخ الحالي: ${currentDate}, تاريخ انتهاء الفعالية: ${eventEndDate}`
    ); // سجل لمقارنة التواريخ
    return eventEndDate < currentDate; // تعود True إذا كان تاريخ انتهاء الفعالية قبل التاريخ الحالي
  };

  // جلب الفعاليات عند تحميل المكون
  useEffect(() => {
    fetch("/api/events/getEvents")
      .then((response) => response.json())
      .then((data) => {
        console.log("الفعاليات المسترجعة مع تواريخ انتهاء:", data); // سجل الفعاليات وتواريخ الانتهاء
        const endedEvents = data.filter((event: Event) =>
          isEventEnded(event.endDate)
        ); // تصفية الفعاليات المنتهية فقط
        console.log("الفعاليات المنتهية:", endedEvents); // سجل الفعاليات المنتهية للتحقق
        setEvents(endedEvents);
      })
      .catch(() => setError("حدث خطأ أثناء جلب الفعاليات"));
  }, []);

  useEffect(() => {
    fetch("/api/events/getEvents")
      .then((response) => response.json())
      .then((data) => {
        const endedEvents = data.filter((event: Event) => {
          if (!event.EndDate) {
            return false;
          }

          const eventEndDate = new Date(event.EndDate);
          if (isNaN(eventEndDate.getTime())) {
            return false;
          }

          return isEventEnded(event.EndDate); // استخدم دالة isEventEnded للتحقق من انتهاء الفعالية
        });
        setEvents(endedEvents);
      })
      .catch(() => setError("حدث خطأ أثناء جلب الفعاليات"));
  }, []);
  // جلب الأشواط عند اختيار فعالية
  useEffect(() => {
    if (selectedEvent) {
      fetch(`/api/events/${selectedEvent}/getLoops`)
        .then((response) => response.json())
        .then((data) => {
          console.log("الأشواط المسترجعة:", data); // سجل الأشواط المسترجعة
          setLoops(data); // احفظ الأشواط المسترجعة
          setFilteredLoops(
            data.filter((loop: Loop) => loop.eventId === selectedEvent)
          ); // تصفية الأشواط حسب الفعالية
        })
        .catch(() => setError("حدث خطأ أثناء جلب الأشواط"));
    } else {
      setLoops([]); // إعادة تعيين الأشواط إذا لم يتم اختيار فعالية
      setFilteredLoops([]);
    }
  }, [selectedEvent]);

  // جلب الجمال عند اختيار فعالية وشوط
  useEffect(() => {
    if (selectedEvent && selectedLoop) {
      fetch(
        `/api/events/${selectedEvent}/getLoops/${selectedLoop}/registeredCamels`
      )
        .then((response) => response.json())
        .then((camelsData) => {
          console.log("الجمال المسترجعة:", camelsData); // سجل الجمال المسترجعة
          setCamels(camelsData);
        })
        .catch(() => setError("حدث خطأ أثناء جلب الجمال"));
    } else {
      setCamels([]); // إعادة تعيين الجمال إذا لم يتم اختيار فعالية أو شوط
    }
  }, [selectedEvent, selectedLoop]);

  if (error) return <p>{error}</p>;

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
  function translateTime(time: string) {
    switch (time) {
      case "Morning":
        return "صباحي";
      case "Evening":
        return "مسائي";
      default:
        return "";
    }
  }
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

  return (
    <div className="bg-[url('/desert.jpg')] h-screen bg-center  bg-no-repeat bg-cover flex items-center justify-center">
      <div className="container w-full max-w-[800px] p-6 rounded-lg  bg-white flex flex-col justify-center gap-4">
        <h1 className="text-3xl font-bold mb-4 text-center">
          المطايا المشاركة
        </h1>

        <div className="flex flex-col gap-4 mb-4">
          {/* اختيار الفعالية */}
          <select
            className="border p-2 rounded w-full"
            value={selectedEvent || ""}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              setSelectedLoop(null); // إعادة تعيين الشوط عند تغيير الفعالية
              console.log("الفعالية المختارة:", e.target.value); // سجل الفعالية المختارة
            }}
          >
            <option value="">اختر فعالية</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>

          {/* اختيار الشوط */}
          {/* اختيار الشوط */}
          {selectedEvent && (
            <select
              className="border p-2 rounded w-full"
              value={selectedLoop || ""}
              onChange={(e) => {
                setSelectedLoop(e.target.value);
                console.log("الشوط المختار:", e.target.value); // سجل الشوط المختار
              }}
            >
              <option value="">اختر شوط</option>
              {filteredLoops.map((loop) => (
                <option key={loop.id} value={loop.id}>
                  {translateAge(loop.age) + ` - ` + translateSex(loop.sex)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* جدول الجمال المسجلة */}
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">رقم الشريحة</TableHead>
              <TableHead className="text-right">اسم المطية</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">مالك المطية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedLoop && camels.length > 0 ? (
              camels.map((camel, index) => (
                <TableRow key={camel.id}>
                  <TableCell className="text-right">{index + 1}</TableCell>
                  <TableCell className="text-right">{camel.camelID}</TableCell>
                  <TableCell className="text-right">{camel.name}</TableCell>
                  <TableCell className="text-right">
                    {translateSex(camel.sex)}
                  </TableCell>
                  <TableCell className="text-right">
                    {camel.ownerName}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  لا توجد جمال مسجلة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
