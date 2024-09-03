import React, { useEffect, useState } from "react";
import { getUser } from "@/data/user";

interface UserData {
  id: string;
  FirstName: string;
  FatherName: string;
  GrandFatherName: string;
  FamilyName: string;
  username: string;
  email: string;
  NationalID: string;
  BDate: Date;
  MobileNumber: string;
  emailVerified: Date | null;
  password: string;
  image: string | null;
  role: string | null;
}

const ShowUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUser();
        const mappedUsers = fetchedUsers.map((user) => ({
          id: user.id,
          FirstName: user.FirstName,
          FatherName: user.FatherName,
          GrandFatherName: user.GrandFatherName,
          FamilyName: user.FamilyName,
          username: user.username,
          email: user.email,
          NationalID: user.NationalID,
          BDate: user.BDate,
          MobileNumber: user.MobileNumber,
          emailVerified: user.emailVerified,
          password: user.password,
          image: user.image,
          role: user.role,
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col space-y-2">
      {users.map((user) => (
        <div key={user.id} className="bg-white/30 rounded-lg p-4 shadow-md">
          <p>ID: {user.id}</p>
          <p>First Name: {user.FirstName}</p>
          <p>Father Name: {user.FatherName}</p>
          <p>Grand Father Name: {user.GrandFatherName}</p>
          <p>Family Name: {user.FamilyName}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>National ID: {user.NationalID}</p>
          <p>Birthdate: {new Date(user.BDate).toLocaleDateString()}</p>
          <p>Mobile Number: {user.MobileNumber}</p>
          {/* Add more fields as necessary */}
        </div>
      ))}
    </div>
  );
};

export default ShowUsers;
