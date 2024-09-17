import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface Loop {
  eventId: string;
  id: string;
  capacity: number;
  age: string;
  sex: string;
  time: string;
  startRegister: Date;
  endRegister: Date;
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
  const [time, setTime] = useState<string>("Morning");
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
      setStartRegister(startRegister);
      setEndRegister(endRegister);
    }
  }, [editingLoop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!capacity || !age || !sex || !time || !startRegister || !endRegister) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    const loopData: Loop = {
      id: editingLoop ? editingLoop.id : "",
      eventId,
      capacity,
      age,
      sex,
      time,
      startRegister: new Date(startRegister),
      endRegister: new Date(endRegister),
    };

    setIsLoading(true);

    try {
      const url = editingLoop
        ? `/api/events/${eventId}/getLoops/${editingLoop.id}/updateLoop`
        : `/api/events/${eventId}/loops`;

      const method = editingLoop ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loopData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فعالية خطأ غير محدد");
      }

      const data = await response.json();
      if (editingLoop) {
        onUpdateLoop(data);
      } else {
        onAddLoop(data);
      }
      onClose();
    } catch (error: any) {
      setError(error.message || "فعالية خطأ أثناء إرسال البيانات.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          {editingLoop ? "تحديث شوط" : "إنشاء شوط"}
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {isLoading && <div className=" mb-4">جاري إرسال البيانات...</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-end">
            <label htmlFor="capacity" className="block text-sm font-bold mb-1">
              سعة الشوط
            </label>
            <input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 0)}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4 text-end">
            <label htmlFor="age" className="block text-sm font-bold mb-1">
              الفئة / السن
            </label>
            <select
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="GradeOne">مفرد</option>
              <option value="GradeTwo">حقايق</option>
              <option value="GradeThree">لقايا</option>
              <option value="GradeFour">جذاع</option>
              <option value="GradeFive">ثنايا</option>
              <option value="GradeSixMale">زمول</option>
              <option value="GradeSixFemale">حيل</option>
            </select>
          </div>
          <div className="mb-4 text-end">
            <label htmlFor="sex" className="block text-sm font-bold mb-1">
              النوع
            </label>
            <select
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Male">قعدان</option>
              <option value="Female">بكار</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-bold mb-1">
              الوقت
            </label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Morning">صباحي</option>
              <option value="Evening">مسائي</option>
            </select>
          </div>
          <div className="mb-4 text-end">
            <label
              htmlFor="startRegister"
              className="block text-sm font-bold mb-1"
            >
              تاريخ البدء للتسجيل
            </label>
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
            <label
              htmlFor="endRegister"
              className="block text-sm font-bold mb-1 text-right"
            >
              تاريخ النهاية للتسجيل
            </label>
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
