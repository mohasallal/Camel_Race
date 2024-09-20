import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
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
  swiftCode: string;
  IBAN: string;
  bankName: string;
}

const ShowSupers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [updatedSupervisor, setUpdatedSupervisor] = useState<Partial<User>>({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // حالة لتأكيد الحذف

  useEffect(() => {
    fetch("/api/users/getSuper")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUsers(data);
        }
      })
      .catch(() => {
        setError("An error occurred while fetching users.");
      });
  }, []);

  const handleSuperClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleUpdateSupervisor = async () => {
    if (updatedSupervisor.BDate) {
      // Validate ISO-8601 date format
      const isValidDate = !isNaN(Date.parse(updatedSupervisor.BDate));
      if (!isValidDate) {
        return;
      }
    }

    try {
      const response = await fetch(`/api/users/${selectedUser?.id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSupervisor),
      });

      if (response.ok) {
        setSelectedUser((prevUser) => ({ ...prevUser, ...updatedSupervisor }));
        setShowEditUserForm(false);
      }
    } catch (error) {
      console.error("Error updating supervisor:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}/deleteUser`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error deleting user.");
      }

      setUsers(users.filter(user => user.id !== selectedUser.id));
      setSelectedUser(null); // Close the details view after deletion
      setShowDeleteConfirmation(false); // Close the delete confirmation popup
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      {error && <p>{error}</p>}
      {selectedUser ? (
        <UserDetail 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)}
          onEdit={() => setShowEditUserForm(true)}
          onDelete={() => setShowDeleteConfirmation(true)} // افتح نافذة التأكيد عند محاولة الحذف
          updatedSupervisor={updatedSupervisor}
          setUpdatedSupervisor={setUpdatedSupervisor}
          handleUpdateSupervisor={handleUpdateSupervisor}
          showEditUserForm={showEditUserForm}
          setShowEditUserForm={setShowEditUserForm}
        />
      ) : (
        <div>
          {users.map((user) => (
            <div
              className="w-full h-20 flex-shrink-0 mb-2 bg-white/30 rounded-lg flex flex-row-reverse items-center justify-between px-5 cursor-pointer"
              key={user.id}
              onClick={() => handleSuperClick(user)}
            >
              <div className="flex items-center flex-row-reverse gap-2">
                <Image
                  src={user.image || "/PFP.jpg"}
                  alt="pfp"
                  className="rounded-full h-fit"
                  width={60}
                  height={60}
                />
                <span className="font-semibold">{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showDeleteConfirmation && (
        <DeleteConfirmationPopup
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </>
  );
};

// Component to display user details
interface UserDetailProps {
  user: User;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  updatedSupervisor: Partial<User>;
  setUpdatedSupervisor: React.Dispatch<React.SetStateAction<Partial<User>>>;
  handleUpdateSupervisor: () => void;
  showEditUserForm: boolean;
  setShowEditUserForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDetail: React.FC<UserDetailProps> = ({
  user,
  onClose,
  onEdit,
  onDelete,
  updatedSupervisor,
  setUpdatedSupervisor,
  handleUpdateSupervisor,
  showEditUserForm,
  setShowEditUserForm
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md ">
        <div className="flex justify-between items-center ">
        <button
            onClick={onClose}
            className="mt-4 bg-gray-500 text-white p-2 rounded mb-5"
          >
            <IoIosClose size={24} />
          </button>   
          <div className=" flex gap-4">
        <button
            className="bg-blue-950 text-white px-4 py-2 rounded"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </button>
          </div>
        </div>
        <hr className="mb-4" />
            <h1 className="text-xl font-semibold mb-4 text-center">بيانات المسؤول</h1>
        <hr />
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={user.image || "/PFP.jpg"}
            alt="pfp"
            className="rounded-full"
            width={100}
            height={100}
          />
          <div className="text-end">
            <p><strong>اسم المستخدم:</strong> {user.username}</p>
            <p><strong>البريد الالكتروني:</strong> {user.email}</p>
          </div>
        </div>
        {showEditUserForm && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Username"
              value={updatedSupervisor.username || ''}
              onChange={(e) => setUpdatedSupervisor({ ...updatedSupervisor, username: e.target.value })}
              className="border border-gray-300 p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Email"
              value={updatedSupervisor.email || ''}
              onChange={(e) => setUpdatedSupervisor({ ...updatedSupervisor, email: e.target.value })}
              className="border border-gray-300 p-2 rounded mb-2 w-full"
            />
            <button
              className="bg-blue-950 text-white px-4 py-2 rounded"
              onClick={handleUpdateSupervisor}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
              onClick={() => setShowEditUserForm(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Delete confirmation popup component
interface DeleteConfirmationPopupProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">تأكيد الحذف</h2>
        <p className="mb-4">هل أنت متأكد أنك تريد حذف هذا المسؤول؟ لا يمكن التراجع عن هذه العملية.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={onConfirm}>
            نعم، احذف
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onCancel}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowSupers;
