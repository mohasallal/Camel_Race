import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

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

export const RegisteredCamelsTable = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [camels, setCamels] = useState<Camel[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  if (error) return <p>{error}</p>;

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded w-[300px]"
          value={selectedEvent || ""}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        {selectedEvent && (
          <select
            className="border p-2 rounded w-[300px]"
            value={selectedLoop || ""}
            onChange={(e) => setSelectedLoop(e.target.value)}
          >
            <option value="">Select Loop</option>
            {loops.map((loop) => (
              <option key={loop.id} value={loop.id}>
                {loop.age + "/" + loop.sex}
              </option>
            ))}
          </select>
        )}
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
                {camel.age + "/" + camel.sex}
              </TableCell>
              <TableCell className="text-right">{camel.owner}</TableCell>{" "}
              {/* Display owner name */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
