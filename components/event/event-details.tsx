import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Button } from "../ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import UpdateLoopForm from "../Forms/UpdateLoopForm";
import CreateLoopForm from "../Forms/loop-form";

interface Event {
  id: string;
  name: string;
  StartDate: Date;
  EndDate: Date;
}

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

interface EventDetailsProps {
  eventId: string;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onClose }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateLoopModalOpen, setIsCreateLoopModalOpen] = useState(false);
  const [isUpdateLoopModalOpen, setIsUpdateLoopModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [editingLoop, setEditingLoop] = useState<Loop | null>(null);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<boolean | null>(null);
  const [confirmDeleteLoop, setConfirmDeleteLoop] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(`/api/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error(`Event fetch error: ${eventResponse.statusText}`);
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);
        setName(eventData.name);
        setStartDate(eventData.StartDate.toString().split('T')[0]);
        setEndDate(eventData.EndDate.toString().split('T')[0]);

        const loopsResponse = await fetch(`/api/events/${eventId}/getLoops`);
        if (!loopsResponse.ok) {
          throw new Error(`Loops fetch error: ${loopsResponse.statusText}`);
        }
        const loopsData = await loopsResponse.json();
        setLoops(loopsData.filter((loop: Loop) => loop.eventId === eventId) || []);
      } catch (error: any) {
        setError(`An error occurred while fetching event details: ${error.message}`);
      }
    };

    fetchEventData();
  }, [eventId]);

  const fetchLoops = async () => {
    try {
      const loopsResponse = await fetch(`/api/events/${eventId}/getLoops`);
      if (!loopsResponse.ok) {
        throw new Error(`Loops fetch error: ${loopsResponse.statusText}`);
      }
      const loopsData = await loopsResponse.json();
      setLoops(loopsData.filter((loop: Loop) => loop.eventId === eventId) || []);
    } catch (error) {
      setError(`An error occurred while fetching loops: ${error}`);
    }
  };

  const handleEditLoop = (loop: Loop) => {
    setEditingLoop(loop);
    setIsUpdateLoopModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/deleteEvent`, {
        method: "DELETE",
      });
      if (response.ok) {
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await fetch(`/api/events/${eventId}/updateEvent`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          StartDate: startDate,
          EndDate: endDate,
        }),
      });
      if (response.ok) {
        setIsEditEventModalOpen(false);
        await fetchEventData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
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
  const handleDeleteLoop = async (loopId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/getLoops/${loopId}/deleteLoop`, {
        method: "DELETE",
      });
      if (response.ok) {
        setConfirmDeleteLoop(null);
        await fetchLoops(); // Fetch updated loops
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting loop:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        
        <h2 className="text-xl font-bold mb-4 justify-between text-end ">
          تفاصيل الفعالية
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsEditEventModalOpen(true)}
              variant="outline"
            >
              <MdEdit className="mr-2" size={18} /> تعديل فعالية
            </Button>
            <Button
              onClick={() => setConfirmDeleteEvent(true)}
              variant="destructive"
            >
              <FaTrash className="mr-2" size={18} /> حذف فعالية
            </Button>
          </div>
        </h2>

        {event ? (
          <div className="text-end pb-4 pt-4">
            <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
            <p>تاريخ البداية: {event.StartDate.toString().split('T')[0]}</p>
            <p>تاريخ النهاية: {event.EndDate.toString().split('T')[0]}</p>

            <Button
              onClick={() => setIsCreateLoopModalOpen(true)}
              className="mt-4"
            >
              إضافة شوط
            </Button>

            <Table className="container text-right mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>السعة</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الوقت</TableHead>
                  <TableHead>تاريخ البدء</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
  {loops.length > 0 ? (
    loops.map((loop) => (
      <TableRow key={loop.id}>
        <TableCell>{loop.capacity}</TableCell>
        <TableCell className="font-medium">
          {translateAge(loop.age)} {/* ترجمة الفئة */}
        </TableCell>
        <TableCell>{translateSex(loop.sex)} {/* ترجمة النوع */}</TableCell>
        <TableCell>{translateTime(loop.time)} {/* ترجمة الوقت */}</TableCell>
        <TableCell>{loop.startRegister.toString().split('T')[0]}</TableCell>
        <TableCell>{loop.endRegister.toString().split('T')[0]}</TableCell>
        <TableCell>
          <button
            onClick={() => handleEditLoop(loop)}
            className="text-blue-950"
          >
            <MdEdit size={20} />
          </button>
          <button
            onClick={() => setConfirmDeleteLoop(loop.id)}
            className="text-red-500 ml-2"
          >
            <MdDelete size={20} />
          </button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} className="text-center">
        لا يوجد أشواط
      </TableCell>
    </TableRow>
  )}
</TableBody>

            </Table>

            {confirmDeleteEvent && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                  <p className="mb-4 text-lg font-bold">هل أنت متأكد من حذف الفعالية؟</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleDeleteEvent}
                      className="bg-red-500 text-white px-6 py-2 rounded-md"
                    >
                      نعم
                    </button>
                    <button
                      onClick={() => setConfirmDeleteEvent(null)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md"
                    >
                      لا
                    </button>
                  </div>
                </div>
              </div>
            )}

            {confirmDeleteLoop && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                  <p className="mb-4">هل أنت متأكد من حذف الشوط؟</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleDeleteLoop(confirmDeleteLoop)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      نعم
                    </button>
                    <button
                      onClick={() => setConfirmDeleteLoop(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      لا
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={onClose} variant="outline" className="mt-4">
              إغلاق
            </Button>
          </div>
        ) : (
          <p>...تحميل التفاصيل</p>
        )}

        {isCreateLoopModalOpen && event && (
          <CreateLoopForm
            eventId={eventId}
            loopData={null}
            isEditing={false}
            onClose={() => setIsCreateLoopModalOpen(false)}
            onLoopSaved={fetchLoops}
          />
        )}

        {isUpdateLoopModalOpen && editingLoop && (
          <UpdateLoopForm
            loopData={editingLoop}
            onClose={() => {
              setIsUpdateLoopModalOpen(false);
              setEditingLoop(null); // Reset editing loop after closing
            }}
            onLoopUpdated={fetchLoops} // Refetch loops after updating
          />
        )}

        {isEditEventModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
              <h3 className="text-lg font-bold mb-4">تعديل الفعالية</h3>
              <form onSubmit={handleUpdateEvent}>
                <div className="mb-4">
                  <label className="block text-right">الاسم</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-right">تاريخ البداية</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-right">تاريخ النهاية</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div className="flex justify-between space-x-4">
                  <button
                    type="submit"
                    className="bg-[#1F2638] text-white px-3 py-2 rounded-md"
                  >
                    حفظ التعديلات
                  </button>
                  <button
                    onClick={() => setIsEditEventModalOpen(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
