import { useEffect, useState } from "react";
import Image from "next/image";
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

interface Camel {
  id: number;
  name: string;
  camelID: string;
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

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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
              <strong>Birth Date:</strong> {user.BDate}
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
            <div className="mt-4">
              <Button onClick={() => setShowAddCamelForm(true)}>
                Add Camel
              </Button>
              {showAddCamelForm && (
                <AddCamelsForm
                  className="mt-4"
                  userId={user.id}
                  onClose={() => {
                    fetchCamels();
                    setShowAddCamelForm(false);
                  }}
                  onAddCamel={handleAddCamel}
                />
              )}
            </div>
            <h3 className="text-lg font-semibold mt-6">Users Camels</h3>
            <Table className="container text-right mt-4" id="myCamels">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">الفئة / السن</TableHead>
                  <TableHead>رقم الشريحة</TableHead>
                  <TableHead>اسم الهجين</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {camels.length > 0 ? (
                  camels.map(
                    (camel) =>
                      camel && (
                        <TableRow key={camel.id}>
                          <TableCell className="font-medium">
                            {camel.age || "..."}
                          </TableCell>
                          <TableCell>{camel.camelID || "..."}</TableCell>
                          <TableCell>{camel.name || "..."}</TableCell>
                        </TableRow>
                      )
                  )
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
export default UserDetails;
