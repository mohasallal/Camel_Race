import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

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
  role: string;
}

export const UsersTabel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users/getUsers")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          const usersWithoutImages = data.map((user: User) => ({
            ...user,
            image: undefined,
          }));
          setUsers(usersWithoutImages);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("An error occurred while fetching users.");
      });
  }, []);

  if (error) return <p>{error}</p>;




  return (
    <Table className="w-full" id="myUsers">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">الاسم الكامل</TableHead>
          <TableHead className="w-[200px]">اسم المستخدم</TableHead>
          <TableHead className="w-[200px]">البريد الإلكتروني</TableHead>
          <TableHead className="w-[200px]">رقم الجوال</TableHead>
          <TableHead className="w-[200px]">رقم الهوية</TableHead>
          <TableHead className="w-[200px]">تاريخ الميلاد</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="text-right">
              {`${user.FirstName} ${user.FatherName} ${user.GrandFatherName} ${user.FamilyName}`}
            </TableCell>
            <TableCell className="text-right">{user.username}</TableCell>
            <TableCell className="text-right">{user.email}</TableCell>
            <TableCell className="text-right">{user.MobileNumber}</TableCell>
            <TableCell className="text-right">{user.NationalID}</TableCell>
            <TableCell className="text-right">{new Date(user.BDate).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
