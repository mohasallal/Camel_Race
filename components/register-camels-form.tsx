import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface RegisterCamelFormProps {
  userId: string;
  onClose: () => void;
}

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

export default function RegisterCamelForm({
  userId,
  onClose,
}: RegisterCamelFormProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [camels, setCamels] = useState<Camel[]>([]);
  const [registeredCamels, setRegisteredCamels] = useState<Camel[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [selectedCamel, setSelectedCamel] = useState<string | null>(null);

  const [availableCamels, setAvailableCamels] = useState<Camel[]>([]);
  const [message, setMessage] = useState("");

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
          setLoops(data);
        } catch (error) {
          console.error("Error fetching loops:", error);
        }
      };

      fetchLoops();
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedLoop) {
      const fetchUserCamels = async () => {
        try {
          const response = await fetch(`/api/camels/${userId}`);
          const camelsData = await response.json();
          setCamels(camelsData);

          const selectedLoopDetails = loops.find(
            (loop) => loop.id === selectedLoop
          );
          if (selectedLoopDetails) {
            const filteredCamels = camelsData.filter(
              (camel: Camel) =>
                camel.age === selectedLoopDetails.age &&
                camel.sex === selectedLoopDetails.sex
            );

            // Fetch already registered camels in the selected loop
            const registeredResponse = await fetch(
              `/api/events/${selectedEvent}/getLoops/${selectedLoop}/registeredCamels`
            );
            const registeredData = await registeredResponse.json();
            setRegisteredCamels(registeredData);

            // Filter out already registered camels
            const availableCamels = filteredCamels.filter(
              (camel: Camel) =>
                !registeredData.some((registered: Camel) => registered.id === camel.id)
            );
            setAvailableCamels(availableCamels);
          }
        } catch (error) {
          console.error("Error fetching user's camels:", error);
        }
      };

      fetchUserCamels();
    }
  }, [selectedLoop, loops, userId, selectedEvent]);

  const handleRegister = async () => {
    if (!selectedCamel || !selectedLoop) {
      setMessage("Please select a camel and a loop.");
      return;
    }

    try {
      const res = await fetch(
        `/api/events/${selectedEvent}/getLoops/${selectedLoop}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ camelId: selectedCamel, userId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Camel registered successfully!");
      } else {
        setMessage(data.error || "Failed to register camel.");
      }
    } catch (error) {
      console.error("Error registering camel:", error);
      setMessage("An error occurred while registering camel.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-[500px]">
        <h2 className="text-xl mb-4">Register Camel for Race</h2>
        {message && <p className="mb-4">{message}</p>}

        <div className="mb-4">
          <label className="block mb-2">Select Event</label>
          <select
            className="w-full border rounded p-2"
            value={selectedEvent || ""}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <div className="mb-4">
            <label className="block mb-2">Select Loop</label>
            <select
              className="w-full border rounded p-2"
              value={selectedLoop || ""}
              onChange={(e) => setSelectedLoop(e.target.value)}
            >
              <option value="">-- Select Loop --</option>
              {loops.map((loop) => (
                <option key={loop.id} value={loop.id}>
                  {loop.age} - {loop.sex} ({loop.time})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedLoop && availableCamels.length >= 0 && (
          <div className="mb-4">
            <label className="block mb-2">Select Camel</label>
            <select
              className="w-full border rounded p-2"
              value={selectedCamel || ""}
              onChange={(e) => setSelectedCamel(e.target.value)}
            >
              <option value="">-- Select Camel --</option>
              {availableCamels.map((camel) => (
                <option key={camel.id} value={camel.id}>
                  {camel.name} (ID: {camel.camelID}, Age: {camel.age})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button onClick={handleRegister} disabled={!selectedCamel}>
            Register
          </Button>
          <Button className="block text-white p-2 rounded" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
