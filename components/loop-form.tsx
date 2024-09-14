import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Loop {
  id: string;
  capacity: number;
  age: string;
  sex: string;
  time: string;
  startRegister: string;
  endRegister: string;
}

interface CreateLoopFormProps {
  eventId: string;
  onClose: () => void;
  onAddLoop: (newLoop: Loop) => void;
  onUpdateLoop: (updatedLoop: Loop) => void;
  editingLoop: Loop | null;
}

const CreateLoopForm: React.FC<CreateLoopFormProps> = ({
  eventId,
  onClose,
  onAddLoop,
  onUpdateLoop,
  editingLoop,
}) => {
  const [capacity, setCapacity] = useState<number>(0);
  const [age, setAge] = useState<string>("GradeOne");
  const [sex, setSex] = useState<string>("Male");
  const [time, setTime] = useState<string>("صباحي");
  const [startRegister, setStartRegister] = useState<string>("");
  const [endRegister, setEndRegister] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingLoop) {
      setCapacity(editingLoop.capacity);
      setAge(editingLoop.age);
      setSex(editingLoop.sex);
      setTime(editingLoop.time);
      setStartRegister(editingLoop.startRegister);
      setEndRegister(editingLoop.endRegister);
    }
  }, [editingLoop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Prepare the loop data to be sent to the server
    const loopData = {
      id: editingLoop ? editingLoop.id : "",
      eventId, // Include eventId to associate loop with the correct event
      capacity,
      age,
      sex,
      time,
      startRegister,
      endRegister,
    };
  
    try {
      let response;
      if (editingLoop) {
        // Update the existing loop (PUT request)
        response = await fetch(`/api/events/${eventId}/updateLoop`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loopData),
        });
      } else {
        // Create a new loop (POST request)
        response = await fetch(`/api/events/${eventId}/loops`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loopData),
        });
      }
  
      // Handle the server response
      const data = await response.json();
  
      if (data.error) {
        setError(data.error); // Display error message if any
      } else {
        if (editingLoop) {
          onUpdateLoop(data); // Call update function with the updated loop data
        } else {
          onAddLoop(data); // Call add function with the new loop data
        }
        onClose(); // Close the form after successful submission
      }
    } catch (error) {
      console.error("Error submitting loop:", error);
      setError("An error occurred while submitting the loop."); // Display generic error message
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{editingLoop ? "تحديث حلقة" : "إنشاء حلقة"}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">القدرة</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">الفئة / السن</label>
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
            <label className="block text-sm font-bold mb-1">النوع</label>
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
            <label className="block text-sm font-bold mb-1">الوقت</label>
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
            <label className="block text-sm font-bold mb-1">تاريخ البدء للتسجيل</label>
            <input
              type="date"
              value={startRegister}
              onChange={(e) => setStartRegister(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">تاريخ النهاية للتسجيل</label>
            <input
              type="date"
              value={endRegister}
              onChange={(e) => setEndRegister(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit">{editingLoop ? "تحديث" : "إنشاء"}</Button>
            <Button variant="outline" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLoopForm;
