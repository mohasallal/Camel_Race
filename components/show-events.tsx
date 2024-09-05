import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

interface Event {
  id: string;
  name: string;
  StartDate: string;
  EndDate: string;
}

export const ShowEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events/getEvents")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setEvents(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError("An error occurred while fetching events.");
      });
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      {error && <p>{error}</p>}
      {events.map((event) => (
        <div
          className="w-full h-20 flex-shrink-0 bg-white/30 rounded-lg flex flex-row-reverse items-center justify-between px-5"
          key={event.id}
        >
          <div className="flex items-center flex-row-reverse gap-2">
            <div className="flex flex-col text-right">
              <span className="font-semibold">{event.name}</span>
              <span className="text-sm">
                {formatDateTime(event.StartDate)} -{" "}
                {formatDateTime(event.EndDate)}
              </span>
            </div>
          </div>
          <div>
            <FaEllipsisV />
          </div>
        </div>
      ))}
    </>
  );
};
