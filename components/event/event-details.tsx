import { useEffect, useState } from "react";
import CreateLoopForm from "../loop-form";
import { Button } from "../ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

interface Event {
  id: string;
  name: string;
  StartDate: string;
  EndDate: string;
}

interface Loop {
  id: string;
  capacity: number;
  age: string;
  sex: string;
  time: string;
  startRegister: string;
  endRegister: string;
}

interface EventDetailsProps {
  eventId: string;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onClose }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateLoopModalOpen, setIsCreateLoopModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(`/api/events/${eventId}`);

        if (!eventResponse.ok) {
          throw new Error(`Event fetch error: ${eventResponse.statusText}`);
        }

        const eventData = await eventResponse.json();

        console.log("Event API response data:", eventData);

        if (eventData.error) {
          setError(eventData.error);
        } else {
          setEvent(eventData);
        }

        const loopsResponse = await fetch(`/api/events/${eventId}/getLoops`);

        if (!loopsResponse.ok) {
          throw new Error(`Loops fetch error: ${loopsResponse.statusText}`);
        }

        const loopsData = await loopsResponse.json();
        console.log("Loops API response data:", loopsData);
        if (Array.isArray(loopsData)) {
          setLoops(loopsData);
        } else {
          setError("Unexpected data format for loops.");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError(`An error occurred while fetching event details: ${error}`);
      }
    };

    fetchEventData();
  }, [eventId]);

  const fetchLoops = async () => {
    try {
      const loopsResponse = await fetch(`/api/events/${eventId}/getLoops`);
      if (!loopsResponse.ok) {
        throw new Error(
          `Loops fetch error: ${loopsResponse.status} - ${loopsResponse.statusText}`
        );
      }
      const loopsData = await loopsResponse.json();
      if (loopsData.error) {
        console.log("Error from server:", loopsData.error);
        setError(loopsData.error);
      } else {
        setLoops(loopsData);
      }
    } catch (error) {
      console.error("Error fetching loops:", error);
      setError(`An error occurred while fetching loops: ${error}`);
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Event Details</h2>
        {event ? (
          <div>
            <p>
              <strong>Name:</strong> {event.name}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(event.StartDate).toISOString().split("T")[0]}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(event.EndDate).toISOString().split("T")[0]}
            </p>

            <Table className="container text-right mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">الفئة / السن</TableHead>
                  <TableHead>القدرة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الوقت</TableHead>
                  <TableHead>تاريخ البدء</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loops.length > 0 ? (
                  loops.map((loop) => (
                    <TableRow key={loop.id}>
                      <TableCell className="font-medium">{loop.age}</TableCell>
                      <TableCell>{loop.capacity}</TableCell>
                      <TableCell>{loop.sex}</TableCell>
                      <TableCell>{loop.time}</TableCell>
                      <TableCell>
                        {new Date(loop.startRegister).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(loop.endRegister).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No loops found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="flex justify-between mt-5">
          <Button onClick={() => setIsCreateLoopModalOpen(true)}>
            Create Loop
          </Button>

          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>

      {isCreateLoopModalOpen && (
        <CreateLoopForm
          eventId={eventId}
          onClose={() => {
            setIsCreateLoopModalOpen(false);
            fetchLoops();
          }}
        />
      )}
    </div>
  );
};

export default EventDetails;
