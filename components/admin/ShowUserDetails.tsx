"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
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
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

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

  const handleDeleteCamel = async () => {
    if (confirmDelete !== null) {
      try {
        const response = await fetch(`/api/camels/${confirmDelete}/delete`, {
          method: "DELETE",
        });

        if (response.ok) {
          setCamels((prevCamels) =>
            prevCamels.filter((camel) => camel.id !== confirmDelete)
          );
          alert("Camel deleted successfully");
          setConfirmDelete(null);
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error("Error deleting camel:", error);
        alert("An error occurred while deleting the camel.");
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/users/${userToDelete}/deleteUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("User deleted successfully");
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white p-2 rounded mb-5"
        >
          <IoIosClose size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        {user ? (
          <div>
            <p>
              <strong>First Name:</strong> {user.FirstName}
            </p>
            <p>
              <strong>Father Name:</strong> {user.FatherName}
            </p>
            <p>
              <strong>Grand Father Name:</strong> {user.GrandFatherName}
            </p>
            <p>
              <strong>Family Name:</strong> {user.FamilyName}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>National ID:</strong> {user.NationalID}
            </p>
            <p>
              <strong>Birth Date:</strong> {user.BDate.split("T")[0]}
            </p>
            <p>
              <strong>Mobile Number:</strong> {user.MobileNumber}
            </p>
            <Image
              src={user.image || "/PFP.jpg"}
              alt="Profile Picture"
              className="rounded-full"
              width={100}
              height={100}
            />
            <div className="flex items-center justify-between mt-5">
              <Button variant="ghost">Edit</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setUserToDelete(user?.id || "");
                  setShowDeleteConfirm(true);
                }}
              >
                Delete
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mt-6">Users Camels</h3>
              <div className="mt-4">
                <Button onClick={() => setShowAddCamelForm(true)}>
                  Add Camel
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
                  />
                )}
              </div>
            </div>
            <Table className="container text-right mt-4" id="myCamels">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">الفئة / السن</TableHead>
                  <TableHead>رقم الشريحة</TableHead>
                  <TableHead>اسم الهجين</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {camels.length > 0 ? (
                  camels.map((camel) => (
                    <TableRow key={camel.id}>
                      <TableCell className="font-medium">
                        {camel.age || "..."}
                      </TableCell>
                      <TableCell>{camel.camelID || "..."}</TableCell>
                      <TableCell>{camel.name || "..."}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => setConfirmDelete(camel.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Delete camel"
                        >
                          <MdDelete size={24} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No camels found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this camel?</p>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setConfirmDelete(null)}
                className="mr-2 bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCamel}
                className="bg-red-500 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this camel?</p>
            <div className="mt-4 flex justify-end">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-500 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteUser}
                  className="bg-red-500 text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
           
        </div>
      )}
    </div>
  );
};

export default UserDetails;
