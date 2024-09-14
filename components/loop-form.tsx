import { useState } from "react";
import { Button } from "./ui/button";

interface CreateLoopFormProps {
  eventId: string;
  onClose: () => void;
}

const CreateLoopForm: React.FC<CreateLoopFormProps> = ({
  eventId,
  onClose,
}) => {
  const [capacity, setCapacity] = useState<number>(0);
  const [age, setAge] = useState<string>("GradeOne");
  const [sex, setSex] = useState<string>("Male");
  const [time, setTime] = useState<string>("صباحي");
  const [startRegister, setStartRegister] = useState<string>("");
  const [endRegister, setEndRegister] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loopData = {
      eventId,
      capacity,
      age,
      sex,
      time,
      startRegister: new Date(startRegister),
      endRegister: new Date(endRegister),
    };

    try {
      const response = await fetch(`/api/events/${eventId}/loops/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loopData),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error creating loop:", error);
      setError("An error occurred while creating the loop.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Loop</h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Age Group</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="GradeOne">Grade One</option>
              <option value="GradeTwo">Grade Two</option>
              <option value="GradeThree">Grade Three</option>
              <option value="GradeFour">Grade Four</option>
              <option value="GradeFive">Grade Five</option>
              <option value="GradeSixMale">Grade Six Male</option>
              <option value="GradeSixFemale">Grade Six Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Sex</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Morning">صباحي (Morning)</option>
              <option value="Evening">مسائي (Evening)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">
              Start Register Date
            </label>
            <input
              type="date"
              value={startRegister}
              onChange={(e) => setStartRegister(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">
              End Register Date
            </label>
            <input
              type="date"
              value={endRegister}
              onChange={(e) => setEndRegister(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit">انشئ</Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLoopForm;
