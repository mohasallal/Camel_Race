import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: string;
  name: string;
}

interface Loop {
  id: string;
  age: string;
  sex: string;
  capacity: number;
  eventId: string;
  time: string;
  startRegister: Date;
  endRegister: Date;
}

interface Camel {
  id: string;
  name: string;
  camelID: string;
  age: string;
  sex: string;
}

const Profile = ({ userId }: { userId: string }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [registeredCamels, setRegisteredCamels] = useState<Camel[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/getEvents");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const fetchLoops = async () => {
        try {
          const response = await fetch(`/api/events/${selectedEvent}/getLoops`);
          const data = await response.json();
          setLoops(data.filter((loop: Loop) => loop.eventId === selectedEvent));
        } catch (error) {
          console.error("Error fetching loops:", error);
        }
      };

      fetchLoops();
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedLoop) {
      const fetchRegisteredCamels = async () => {
        try {
          const response = await fetch(
            `/api/events/${selectedEvent}/getLoops/${selectedLoop}/registeredCamels?userId=${userId}`
          );
          const registeredData = await response.json();
          setRegisteredCamels(registeredData);

          // Set message if no camels are registered
          if (registeredData.length === 0) {
            setMessage("No registered camels");
          } else {
            setMessage(""); // Clear the message if there are registered camels
          }
        } catch (error) {
          console.error("Error fetching registered camels:", error);
        }
      };

      fetchRegisteredCamels();
    }
  }, [selectedLoop, selectedEvent, userId]);

  return (
    <div className="p-6 container">
      <h2 className="text-xl mb-4">Registered Camels for Loop</h2>
      {message && <p className="mb-4">{message}</p>}

      <div className="mb-4">
        <label className="block mb-2">Select Event</label>
        <Select onValueChange={setSelectedEvent} value={selectedEvent || ""}>
          <SelectTrigger className="w-full border rounded p-2">
            <SelectValue placeholder="Select Event" />
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
        <div className="mb-4">
          <label className="block mb-2">Select Loop</label>
          <Select onValueChange={setSelectedLoop} value={selectedLoop || ""}>
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="Select Loop" />
            </SelectTrigger>
            <SelectContent>
              {loops.map((loop) => (
                <SelectItem key={loop.id} value={loop.id}>
                  {loop.age} - {loop.sex} ({loop.time})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedLoop && registeredCamels.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg mb-2">Registered Camels</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Sex</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registeredCamels.map((camel) => (
                <TableRow key={camel.id}>
                  <TableCell>{camel.name}</TableCell>
                  <TableCell>{camel.camelID}</TableCell>
                  <TableCell>{camel.age}</TableCell>
                  <TableCell>{camel.sex}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedLoop && registeredCamels.length === 0 && !message && (
        <p>No registered camels</p>
      )}
    </div>
  );
};

export default Profile;
