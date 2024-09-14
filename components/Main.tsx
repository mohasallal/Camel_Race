"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";

type CalendarEvent = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

function Main() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/getEvents");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        console.log("Fetched events data:", data); // Debugging statement

        if (Array.isArray(data)) {
          setEvents(
            data.map((event: any) => ({
              id: event.id,
              name: event.name,
              startDate: new Date(event.StartDate),
              endDate: new Date(event.EndDate),
            }))
          );
        } else {
          throw new Error("Unexpected data structure");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error loading events: {error}</div>;
  }
  return (
    <section className="bg-[url('/desert2.jpg')] bg-no-repeat bg-center bg-cover h-full w-full  p-0 sm:p-10 max-sm:py-10 my-0">
      <div className="container max-sm:px-0 bg-white/70 mt-20 rounded-xl py-5">
        <div className="flex max-lg:flex-col items-center justify-between max-lg:mb-10 mt-20 ">
          <div>
            <Image src="/Camel.png" width={512} height={512} alt="Camel" />
          </div>
          <div className="flex flex-col items-end justify-center gap-5 max-lg:items-center">
            <h1 className=" text-6xl text-right max-lg:text-center max-lg:text-5xl max-md:text-4xl max-sm:text-3xl">
              انضم إلى مجتمع سباقات الهجن <br /> ! وتواصل من أي مكان
            </h1>
            <p className="text-2xl max-lg:text-xl max-md:text-lg max-sm:text-base">
              ! ابدا رحلتك الآن
            </p>
          </div>
        </div>
        <div>
          <h1>Event Calendar</h1>
          <Calendar events={events} />
        </div>
      </div>
    </section>
  );
}

export default Main;
