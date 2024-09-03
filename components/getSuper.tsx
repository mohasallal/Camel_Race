import Image from "next/image";
import { useEffect, useState } from "react";

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
          className="w-full h-20 flex-shrink-0 bg-white/30 rounded-lg flex flex-row-reverse items-center justify-between"
          key={user.id}
        >
          <div className="flex items-center flex-row-reverse">
            <Image
              src={user.image || "/PFP.jpg"}
              alt="pfp"
              className="rounded-full h-fit"
              width={75}
              height={75}
            />
            {user.username}
          </div>
          <div>Options</div>
        </div>
      ))}
    </>
  );
};
