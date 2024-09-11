import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEllipsisV } from "react-icons/fa";
import UserDetails from "./admin/ShowUserDetails";
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
}
export const ShowUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users/getUsers")
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

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseUserDetails = () => {
    setSelectedUserId(null);
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      {users.map((user) => (
        <div
          className="w-full h-20 flex-shrink-0 bg-white/30 rounded-lg flex flex-row-reverse items-center justify-between px-5 cursor-pointer mb-2"
          key={user.id}
          onClick={() => handleUserClick(user.id)}
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
      {selectedUserId && (
        <UserDetails userId={selectedUserId} onClose={handleCloseUserDetails} />
      )}
    </>
  );
};
