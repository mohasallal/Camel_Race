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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    if (!capacity || !age || !sex || !time || !startRegister || !endRegister) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    const loopData = {
      id: editingLoop ? editingLoop.id : "",
      eventId,
      capacity,
      age,
      sex,
      time,
      startRegister,
      endRegister,
    };

    setIsLoading(true);

    try {
      let response;
      if (editingLoop) {
        // Update existing loop
        console.log("looooop")
        response = await fetch(`api/events/${eventId}/getLoops/${editingLoop.id}/updateLoop`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loopData),
        
        });
      } else {
        // Create new loop
        response = await fetch(`/api/events/${eventId}/loops`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loopData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "حدث خطأ غير محدد");
      }

      const data = await response.json();
      if (editingLoop) {
        onUpdateLoop(data); // Update loop in parent component
      } else {
        onAddLoop(data); // Add new loop in parent component
      }
      onClose();
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء إرسال البيانات.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (window.confirm("هل أنت متأكد أنك تريد إغلاق النموذج دون حفظ التغييرات؟")) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{editingLoop ? "تحديث حلقة" : "إنشاء حلقة"}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {isLoading && <div className="text-blue-500 mb-4">جاري إرسال البيانات...</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="capacity" className="block text-sm font-bold mb-1">القدرة</label>
            <input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-bold mb-1">الفئة / السن</label>
            <select
              id="age"
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
            <label htmlFor="sex" className="block text-sm font-bold mb-1">النوع</label>
            <select
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-bold mb-1">الوقت</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Morning">صباحي (Morning)</option>
              <option value="Evening">مسائي (Evening)</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="startRegister" className="block text-sm font-bold mb-1">تاريخ البدء للتسجيل</label>
            <input
              id="startRegister"
              type="date"
              value={startRegister}
              onChange={(e) => setStartRegister(e.target.value)}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endRegister" className="block text-sm font-bold mb-1">تاريخ النهاية للتسجيل</label>
            <input
              id="endRegister"
              type="date"
              value={endRegister}
              onChange={(e) => setEndRegister(e.target.value)}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit">{editingLoop ? "تحديث" : "إنشاء"}</Button>
            <Button variant="outline" onClick={handleClose}>
              إغلاق
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLoopForm;
