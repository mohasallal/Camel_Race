"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type CalendarEvent = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

type CalendarProps = {
  events: CalendarEvent[];
};

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const generateDaysArray = (month: number, year: number) => {
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1));
    };

    setDays(generateDaysArray(currentMonth.getMonth() + 1, currentMonth.getFullYear()));
  }, [currentMonth]);

  const changeMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    return date >= startDate && date <= endDate;
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  const eventsForSelectedDay = events.filter((event) =>
    isDateInRange(selectedDay || new Date(), new Date(event.startDate), new Date(event.endDate))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth("prev")}
          className={buttonVariants({ variant: "outline" }) + " h-12 w-12"}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <span className="text-xl font-semibold">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={() => changeMonth("next")}
          className={buttonVariants({ variant: "outline" }) + " h-12 w-12"}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {days.map((day) => {
          const dayKey = day.toISOString().split("T")[0];
          const dayEvents = events.filter((event) =>
            isDateInRange(day, new Date(event.startDate), new Date(event.endDate))
          );

          return (
            <div
              key={dayKey}
              onClick={() => handleDayClick(day)}
              className={cn(
                "relative p-8 border border-gray-400 text-center text-sm cursor-pointer transition-transform hover:scale-105",
                {
                  "bg-yellow-200": dayEvents.length > 0,
                  "bg-orange-100": !dayEvents.length,
                }
              )}
            >
              <div className="font-semibold text-lg">{day.getDate()}</div>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full bg-yellow-600 text-white text-xs p-1 truncate">
                  {dayEvents[0].name} {/* Show only the first event's name */}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-6 p-4 border border-gray-300 rounded bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-2">
            Events on {selectedDay.toLocaleDateString()}
          </h3>
          {eventsForSelectedDay.length > 0 ? (
            <ul>
              {eventsForSelectedDay.map((event) => (
                <li key={event.id} className="mb-2">
                  <div className="font-medium">{event.name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(event.startDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {new Date(event.endDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No events for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export { Calendar };
