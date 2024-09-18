import { useState, useEffect } from "react";
import { Button } from "../ui/button";

interface Loop {
  id: string;
  eventId: string;
  capacity: number;
  age: string;
  sex: string;
  time: string;
  startRegister: Date;
  endRegister: Date;
}

interface UpdateLoopFormProps {
  loopData: Loop | null;
  onClose: () => void;
  onLoopUpdated: () => void;
}

const UpdateLoopForm: React.FC<UpdateLoopFormProps> = ({
  loopData,
  onClose,
  onLoopUpdated,
}) => {
  const [capacity, setCapacity] = useState(loopData?.capacity || 0);
  const [age, setAge] = useState(loopData?.age || "");
  const [sex, setSex] = useState(loopData?.sex || "");
  const [time, setTime] = useState(loopData?.time || "");
  const [startRegister, setStartRegister] = useState(
    loopData?.startRegister ? loopData.startRegister.toString().split("T")[0] : ""
  );
  const [endRegister, setEndRegister] = useState(
    loopData?.endRegister ? loopData.endRegister.toString().split("T")[0] : ""
  );

  useEffect(() => {
    if (loopData) {
      setCapacity(loopData.capacity);
      setAge(loopData.age);
      setSex(loopData.sex);
      setTime(loopData.time);
      setStartRegister(loopData.startRegister.toString().split("T")[0]);
      setEndRegister(loopData.endRegister.toString().split("T")[0]);
    }
  }, [loopData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    if (loopData) {
      try {
        const response = await fetch(
          `/api/events/${loopData.eventId}/getLoops/${loopData.id}/updateLoop`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              capacity,
              age,
              sex,
              time,
              startRegister: new Date(startRegister),
              endRegister: new Date(endRegister),
            }),
          }
        );
        if (response.ok) {
          onLoopUpdated();
          onClose();
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error("Error updating loop:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-end ">تحديث الشوط</h2>
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
          <div className="mb-4 text-end">
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
          <div className="flex justify-between space-x-1 items-center ">
          <Button className="bg-[#0F172A] text-white px-4 py-1 rounded-md">
              تحديث
            </Button>
            <Button onClick={onClose} variant="outline" >
              إغلاق
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateLoopForm;
