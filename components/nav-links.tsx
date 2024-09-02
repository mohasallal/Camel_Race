"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  className?: string;
  enablescroll?: () => void;
}

interface UserProfile {
  role: string;
}

const NavLinks = ({ className, enablescroll }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);

    if (storedToken) {
      fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, []);

  return (
    <ul className={className || `flex items-center gap-5 max-lg:hidden`}>
      {user && (user.role === "ADMIN" || user.role === "SUPERVISOR") && (
        <li onClick={enablescroll}>
          <Link href="/admin/dashboard">لائحة المسؤول</Link>
        </li>
      )}
      {token && (
        <>
          <li onClick={enablescroll}>
            <Link href="mailto:info@jocrc.com">تواصل معنا</Link>
          </li>
          <li onClick={enablescroll}>
            <Link href="/profile#myCamels">المطايا الخاصة بي</Link>
          </li>
          <li onClick={enablescroll}>
            <Link href="/profile">الملف الشخصي</Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavLinks;
