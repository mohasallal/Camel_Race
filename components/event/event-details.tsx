import { useEffect, useState } from "react";

interface Event {
  id: string;
  name: string;
  StartDate: string;
  EndDate: string;
}

interface EventDetailsProps {
  eventId: string;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onClose }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        console.log("API response data:", data);
        if (data.error) {
          setError(data.error);
        } else {
          setEvent(data);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("An error occurred while fetching event details.");
      }
    };

    fetchEvent();
  }, [eventId]);

  if (error) return <div>Error: {error}</div>;

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
              {new Date(event.StartDate).toLocaleString("en-GB")}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(event.EndDate).toLocaleString("en-GB")}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white p-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
