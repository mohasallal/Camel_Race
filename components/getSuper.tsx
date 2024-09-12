import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

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
  swiftCode:string,
  IBAN:string,
  bankName:string,
  accountId:string,
}

export const ShowSupers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("An error occurred while fetching users.");
      });
  }, []);

  return (
    <>
      {error && <p>{error}</p>}
      {users.map((user) => (
        <div
          className="w-full h-20 flex-shrink-0 bg-white/30 rounded-lg flex flex-row-reverse items-center justify-between px-5"
          key={user.id}
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
          <div>
            <FaEllipsisV />
          </div>
        </div>
      ))}
    </>
  );
};
