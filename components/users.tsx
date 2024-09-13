import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
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
  swiftCode: string;
  IBAN: string;
  bankName: string;
  accountId: string;
}

export const ShowUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  const fetchUsers = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/users/getUsers?page=${page}&limit=6`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setUsers((prevUsers) => {
          const existingUserIds = new Set(prevUsers.map((user) => user.id));
          const newUsers = data.users.filter(
            (user: User) => !existingUserIds.has(user.id)
          );
          return [...prevUsers, ...newUsers];
        });
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]);

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseUserDetails = () => {
    setSelectedUserId(null);
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-auto">
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
        </div>
      ))}
      {selectedUserId && (
        <UserDetails userId={selectedUserId} onClose={handleCloseUserDetails} />
      )}
      <div ref={ref} className="loading-indicator text-center">
        {loading
          ? "Loading more users..."
          : hasMore
          ? "Scroll down for more"
          : ""}
      </div>
    </div>
  );
};
