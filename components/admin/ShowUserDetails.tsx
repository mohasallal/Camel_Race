import { useEffect, useState } from "react";
import Image from "next/image";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import AddCamelsForm from "../CamelForm";
import { IoIosClose } from "react-icons/io";

interface Camel {
  id: number;
  name: string;
  camelID: number;
  age: string;
  sex: string;
}

interface User {
  id: string;
  FirstName: string;
  FatherName: string;
  GrandFatherName: string;
  FamilyName: string;
  username: string;
  email: string;
  NationalID: string;
  BDate: string;
  MobileNumber: string;
  image?: string;
  role: string;
  camels?: Camel[];
  swiftCode: string;
  IBAN: string;
  bankName: string;
  accountId: string;
}

interface UserDetailsProps {
  userId: string;
  onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [camels, setCamels] = useState<Camel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddCamelForm, setShowAddCamelForm] = useState(false);
  const [showEditCamelForm, setShowEditCamelForm] = useState(false);
  const [editingCamel, setEditingCamel] = useState<Camel | null>(null);
  const [confirmDeleteCamel, setConfirmDeleteCamel] = useState<number | null>(
    null
  );
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<boolean>(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(`/api/users/${userId}`);
        const userData = await userResponse.json();
        if (userData.error) {
          setError(userData.error);
          return;
        }
        setUser(userData);

        const camelResponse = await fetch(`/api/camels/${userData.id}`);
        const camelData = await camelResponse.json();
        if (camelData.error) {
          setError(camelData.error);
        } else {
          setCamels(camelData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, [userId]);

  const fetchCamels = async () => {
    try {
      const response = await fetch(`/api/camels/${userId}`);
      const camelData = await response.json();
      if (camelData.error) {
        setError(camelData.error);
      } else {
        setCamels(camelData);
      }
    } catch (error) {
      console.error("Error fetching camels:", error);
      setError("An error occurred while fetching camels.");
    }
  };

  const handleAddCamel = (newCamel: Camel) => {
    setCamels((prevCamels) => [...prevCamels, newCamel]);
  };

  const handleEditCamel = (camel: Camel) => {
    setEditingCamel(camel);
    setShowEditCamelForm(true);
  };

  const handleUpdateCamel = async (camel: Camel) => {
    try {
      const response = await fetch(`/api/camels/${camel.id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(camel),
      });
      if (response.ok) {
        setShowEditCamelForm(false);
        setCamels(camels.map((c) => (c.id === camel.id ? camel : c)));
      }
    } catch (error) {
      console.error("Error updating camel:", error);
    }
  };

  const handleDeleteCamel = async () => {
    try {
      const response = await fetch(`/api/camels/${confirmDeleteCamel}/delete`, {
        method: "DELETE",
      });
      if (response.ok) {
        setConfirmDeleteCamel(null);
        setCamels(camels.filter((camel) => camel.id !== confirmDeleteCamel));
      }
    } catch (error) {
      console.error("Error deleting camel:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/deleteUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onClose();
      } else {
        const data = await response.json();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (updatedUser && user) {
      if (updatedUser.BDate) {
        // Validate ISO-8601 date format
        const isValidDate = !isNaN(Date.parse(updatedUser.BDate));
      }

      try {
        const response = await fetch(`/api/users/${user.id}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });

        const result = await response.json();

        if (response.ok) {
          setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
          setShowEditUserForm(false);
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
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

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 overflow-auto pt-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="mt-4 bg-gray-500 text-white p-2 rounded mb-5"
          >
            <IoIosClose size={24} />
          </button>
          <div>
            <Button
              onClick={() => setConfirmDeleteUser(true)}
              variant="destructive"
            >
              حذف المستخدم
            </Button>
            <Button onClick={() => setShowEditUserForm(true)} className="ml-2">
              تعديل بيانات المستخدم
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold mb-4">بيانات المستخدم</h2>
        </div>
        {user ? (
          <div className="text-end ">
            <p>
              <strong>الاسم الأول :</strong> {user.FirstName}
            </p>
            <p>
              <strong>اسم الاب :</strong> {user.FatherName}
            </p>
            <p>
              <strong> اسم الجد :</strong> {user.GrandFatherName}
            </p>
            <p>
              <strong> اسم العائلة :</strong> {user.FamilyName}
            </p>
            <p>
              <strong>اسم المستخدم : </strong> {user.username}
            </p>
            <p className="text-end">
              {user.email}
              <strong> : الجيميل </strong>{" "}
            </p>
            <p>
              <strong> الرقم الوطني : </strong> {user.NationalID}
            </p>
            <p>
              <strong>تاريخ الميلاد :</strong> {user.BDate.split("T")[0]}
            </p>
            <p>
              <strong> رقم الهاتف :</strong> {user.MobileNumber}
            </p>
            <div className="mt-4">
              <Button onClick={() => setShowAddCamelForm(true)}>
                إضافة جمل
              </Button>

              {showAddCamelForm && (
                <AddCamelsForm
                  className="mt-0"
                  userId={user.id}
                  onClose={() => {
                    fetchCamels();
                    setShowAddCamelForm(false);
                  }}
                  onAddCamel={handleAddCamel}
                  onUpdateCamel={handleUpdateCamel}
                  editingCamel={editingCamel}
                />
              )}
            </div>
            <div className="flex items-center justify-between mt-6">
              <h3 className="text-lg font-semibold">المطايا الخاص بي</h3>
            </div>
            <Table className="container text-right mt-4" id="myCamels">
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الجمل</TableHead>
                  <TableHead>الجنس</TableHead>
                  <TableHead>عمر الجمل</TableHead>
                  <TableHead>العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {camels.map((camel) => (
                  <TableRow key={camel.id}>
                    <TableCell>{camel.name}</TableCell>
                    <TableCell>{translateSex(camel.sex)}</TableCell>
                    <TableCell>{translateAge(camel.age)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => handleEditCamel(camel)}
                      >
                        <MdEdit />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setConfirmDeleteCamel(camel.id)}
                      >
                        <MdDelete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* امكانية الغاءها في حال عدم حل مشكلة اضافة الجمل */}
            {editingCamel && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4 md:mx-0">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    تعديل الجمل
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingCamel) {
                        handleUpdateCamel(editingCamel);
                      }
                    }}
                    className="space-y-4"
                  >
                    <label className="block">
                      <span className="text-gray-700 font-medium">الاسم:</span>
                      <input
                        type="text"
                        value={editingCamel.name}
                        onChange={(e) =>
                          setEditingCamel({
                            ...editingCamel,
                            name: e.target.value,
                          })
                        }
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        ID الجمل:
                      </span>
                      <input
                        type="number"
                        value={editingCamel.camelID}
                        onChange={(e) =>
                          setEditingCamel({
                            ...editingCamel,
                            camelID: +e.target.value,
                          })
                        }
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-medium">العمر:</span>
                      <select
                        value={editingCamel.age}
                        onChange={(e) =>
                          setEditingCamel({
                            ...editingCamel,
                            age: e.target.value,
                          })
                        }
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      >
                        <option value="">اختر العمر</option>
                        <option value="GradeOne">مفرد</option>
                        <option value="GradeTwo">حقايق</option>
                        <option value="GradeThree">لقايا</option>
                        <option value="GradeFour">جذاع</option>
                        <option value="GradeFive">ثنايا</option>
                        <option value="GradeSixMale">زمول</option>
                        <option value="GradeSixFemale">حيل</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-medium">النوع:</span>
                      <select
                        value={editingCamel.sex}
                        onChange={(e) =>
                          setEditingCamel({
                            ...editingCamel,
                            sex: e.target.value,
                          })
                        }
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      >
                        <option value="">اختر النوع</option>
                        <option value="Male">قعدان</option>
                        <option value="Female">بكار</option>
                      </select>
                    </label>
                    <div className="flex justify-end space-x-4">
                      <Button
                        onClick={() => {
                          alert("تم تحديث الجمل بنجاح الرجاء الخروج");
                        }}
                        type="submit"
                        className="bg-gray-800 text-white "
                      >
                        تحديث الجمل
                      </Button>
                      <Button
                        onClick={() => {
                          setShowEditCamelForm(false);
                          setEditingCamel(null);
                        }}
                        variant="destructive"
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {confirmDeleteCamel && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 overflow-auto pt-6">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md ">
                  <h2 className="text-xl font-bold mb-4">تأكيد الحذف</h2>
                  <p className="mb-3">هل أنت متأكد أنك تريد حذف هذا الجمل؟</p>
                  <Button
                    onClick={() => {
                      handleDeleteCamel();
                      setConfirmDeleteCamel(null);
                    }}
                    variant="destructive"
                  >
                    حذف
                  </Button>
                  <Button
                    onClick={() => setConfirmDeleteCamel(null)}
                    variant="secondary"
                    className="ml-2 "
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
            {confirmDeleteUser && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 overflow-auto pt-6">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                  <h3 className="text-lg font-semibold">
                    تأكيد حذف المستخدم ؟{" "}
                  </h3>
                  <p>هل أنت متاكد من حذف المستخدم ؟</p>
                  <div className="flex justify-between mt-4">
                    <Button onClick={handleDeleteUser} variant="destructive">
                      نعم
                    </Button>
                    <Button
                      onClick={() => setConfirmDeleteUser(false)}
                      variant="outline"
                    >
                      لا
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {showEditUserForm && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 overflow-y-auto pt-5">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                    تعديل بيانات المستخدم
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateUser();
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-gray-700"> : الاسم الاول</span>
                        <input
                          type="text"
                          value={updatedUser?.FirstName || user.FirstName}
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              FirstName: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                        />
                      </label>
                      <label className="block">
                        <span className="text-gray-700"> : اسم الاب</span>
                        <input
                          type="text"
                          value={updatedUser?.FatherName || user.FatherName}
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              FatherName: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                        />
                      </label>
                      <label className="block">
                        <span className="text-gray-700"> : اسم الجد</span>
                        <input
                          type="text"
                          value={
                            updatedUser?.GrandFatherName || user.GrandFatherName
                          }
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              GrandFatherName: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                        />
                      </label>
                      <label className="block">
                        <span className="text-gray-700"> : اسم العائلة</span>
                        <input
                          type="text"
                          value={updatedUser?.FamilyName || user.FamilyName}
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              FamilyName: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-gray-700"> : اسم المستخدم</span>
                      <input
                        type="text"
                        value={updatedUser?.username || user.username}
                        onChange={(e) =>
                          setUpdatedUser((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">
                        {" "}
                        : البريد الإلكتروني
                      </span>
                      <input
                        type="email"
                        value={updatedUser?.email || user.email}
                        onChange={(e) =>
                          setUpdatedUser((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700"> : الرقم الوطني</span>
                      <input
                        type="text"
                        value={updatedUser?.NationalID || user.NationalID}
                        onChange={(e) =>
                          setUpdatedUser((prev) => ({
                            ...prev,
                            NationalID: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700"> : تاريخ الميلاد</span>
                      <input
                        type="date"
                        defaultValue={user.BDate.split("T")[0]}
                        onChange={(e) =>
                          setUpdatedUser((prev) => ({
                            ...prev,
                            BDate: new Date(e.target.value).toISOString(),
                          }))
                        }
                        className="mt-1 block w-full text-end border-gray-300 rounded-md shadow-sm p-2 "
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700"> : رقم الهاتف </span>
                      <input
                        type="text"
                        value={updatedUser?.MobileNumber || user.MobileNumber}
                        onChange={(e) =>
                          setUpdatedUser((prev) => ({
                            ...prev,
                            MobileNumber: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full text-end border-gray-300 rounded-md shadow-sm p-2 "
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-gray-700"> : رمز السويفت </span>
                        <input
                          type="text"
                          value={updatedUser?.swiftCode || user.swiftCode}
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              swiftCode: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                        />
                      </label>
                      <label className="block">
                        <span className="text-gray-700"> : رقم الآيبان</span>
                        <input
                          type="text"
                          value={updatedUser?.IBAN || user.IBAN}
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              IBAN: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-end p-2 "
                        />
                      </label>
                      <label className="block  ">
                        <span className="text-gray-700 "> : اسم البنك</span>
                        <input
                          type="text"
                          value={updatedUser?.bankName || user.bankName}
                          onChange={(e) =>
                            setUpdatedUser((prev) => ({
                              ...prev,
                              bankName: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full item border-gray-300 rounded-md shadow-sm text-end p-2  "
                        />
                      </label>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button
                        type="submit"
                        className=" text-white p-2 rounded-md shadow"
                      >
                        حفظ التعديلات
                      </Button>
                      <Button
                        onClick={() => setShowEditUserForm(false)}
                        variant="outline"
                        className="bg-gray-200 p-2 rounded-md shadow"
                      >
                        الغاء
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>جاري التحميل ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
