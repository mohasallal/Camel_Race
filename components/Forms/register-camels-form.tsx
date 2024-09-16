"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

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

            const registeredResponse = await fetch(
              `/api/events/${selectedEvent}/getLoops/${selectedLoop}/registeredCamels`
            );
            const registeredData = await registeredResponse.json();
            setRegisteredCamels(registeredData);

            if (registeredData.length >= selectedLoopDetails.capacity) {
              setMessage(
                "This loop has reached its capacity. Registration is not allowed."
              );
              setAvailableCamels([]);
            } else {
              const availableCamels = filteredCamels.filter(
                (camel: Camel) =>
                  !registeredData.some(
                    (registered: Camel) => registered.id === camel.id
                  )
              );
              setAvailableCamels(availableCamels);
            }
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
        const registeredResponse = await fetch(
          `/api/events/${selectedEvent}/getLoops/${selectedLoop}/registeredCamels`
        );
        const registeredData = await registeredResponse.json();
        setRegisteredCamels(registeredData);
      } else {
        setMessage(data.error || "Failed to register camel.");
      }
    } catch (error) {
      console.error("Error registering camel:", error);
      setMessage("An error occurred while registering camel.");
    }
  };

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-[500px]">
        <h2 className="text-xl mb-4"> تسجيل المطية في السباق</h2>
        {message && <p className="mb-4">{message}</p>}

        <div className="mb-4">
          <label className="block mb-2 text-right">اختر فعالية</label>
          <select
            className="w-full border rounded p-2"
            value={selectedEvent || ""}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">-- اختر فعالية --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <div className="mb-4">
            <label className="block mb-2 text-right">اختر شوط</label>
            <select
              className="w-full border rounded p-2"
              value={selectedLoop || ""}
              onChange={(e) => setSelectedLoop(e.target.value)}
            >
              <option value="">-- اختر شوط --</option>
              {loops.map((loop) => (
                <option key={loop.id} value={loop.id}>
                  {translateAge(loop.age)} - {translateSex(loop.sex)} (
                  {translateTime(loop.time)})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedLoop && availableCamels.length >= 0 && (
          <div className="mb-4">
            <label className="block mb-2 text-right">اختر مطية</label>
            <select
              className="w-full border rounded p-2"
              value={selectedCamel || ""}
              onChange={(e) => setSelectedCamel(e.target.value)}
            >
              <option value="">-- اختر مطية --</option>
              {availableCamels.map((camel) => (
                <option key={camel.id} value={camel.id}>
                  {camel.name} (رقم الشريحة: {camel.camelID}, الصف:{" "}
                  {translateAge(camel.age)})
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-between items-center">
          <Button onClick={handleRegister} disabled={!selectedCamel}>
            تسجيل
          </Button>
          <Button className="block text-white p-2 rounded" onClick={onClose}>
            اغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}
