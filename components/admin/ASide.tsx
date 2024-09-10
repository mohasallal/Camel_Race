"use client";
import { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../side-bar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import { RedirectButton } from "../auth/redirect-button";
import { useRouter } from "next/navigation";
import { ShowUsers } from "../users";
import { ShowSupers } from "../getSuper";
import { CreateEventForm } from "../event/EventsForm";
import { ShowEvents } from "../show-events";
import SearchBar from "./SearchBar";
import { signOut } from "@/lib/auth";

interface UserProfile {
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

export function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("! توكن مفقود ، الرجاء تسجيل الدخول");
        router.push("/auth/login");
        return;
      }

      try {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch user profile.");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("An unexpected error occurred.");
      }
    }

    fetchUserProfile();
  }, [router]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  if (user.role !== "ADMIN" && user.role !== "SUPERVISOR") {
    router.push("/error");
    return null;
  }

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("authToken");
      setToken(null);
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const links = [
    {
      label: "اللائحة",
      href: "/admin/dashboard/",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "المستخدمين",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "تسجيل الخروج",
      href: "#",
      onClick: async (e: React.MouseEvent) => {
        e.preventDefault();
        await handleSignOut();
      },
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={link.onClick ? (e) => link.onClick(e) : undefined}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.username,
                href: "#",
                icon: (
                  <Image
                    src="/PFP.jpg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard role={user.role} />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <span className="text-2xl">🐪</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        <h1 className="font-semibold"> سباق الهجن</h1>
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <span className="text-2xl flex">🐪</span>
    </Link>
  );
};

interface DashboardProps {
  role: string;
}
const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [block, setBlock] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (block) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }
  }, [block]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.statusText}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleFormChange = () => {
    setBlock((prev) => !prev);
  };

  return (
    <div className="flex flex-1">
      <div
        className={`p-2 md:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full ${
          block ? "overflow-hidden" : "overflow-y-scroll"
        }`}
      >
        <div className="flex">
          <div className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center py-1 px-4">
            <RedirectButton className="mr-2" path="/auth/register">
              <Button>
                <FaPlus />
                انشاء مستخدم
              </Button>
            </RedirectButton>
            <SearchBar />
          </div>
        </div>
        {role === "ADMIN" && (
          <div className="flex gap-2 flex-1 max-lg:flex-col">
            <div className="h-[30rem] w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col items-end py-1 px-4 max-lg:w-full">
              <div className="w-full flex items-center justify-end px-5 my-2">
                <h2 className="my-2 text-3xl font-semibold max-md:text-2xl">
                  : المشرفين
                </h2>
              </div>
              <div className="w-full h-full bg-gray-200 rounded-lg mb-4 p-2 overflow-y-scroll flex flex-col items-center gap-2">
                <ShowSupers />
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-2 flex-1 max-lg:flex-col">
          <div className="h-[30rem] w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col items-end py-1 px-4 max-lg:w-full">
            <div className="w-full flex items-center justify-end px-5 my-2">
              <h2 className="my-2 text-3xl font-semibold max-md:text-2xl">
                : المستخدمين
              </h2>
            </div>
            <div className="w-full h-full bg-gray-200 rounded-lg mb-4 p-2 overflow-y-scroll flex flex-col items-center gap-2">
              <ShowUsers />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-1 max-lg:flex-col">
          <div className="h-[30rem] w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col items-end py-1 px-4 max-lg:w-full">
            {block && (
              <CreateEventForm
                className={block ? "block" : "hidden"}
                onClose={() => setBlock(false)}
              />
            )}
            <div className="w-full flex items-center justify-between px-5 my-2">
              <Button onClick={handleFormChange}>
                <FaPlus />
                {block ? "إغلاق" : "إضافة فعالية"}
              </Button>
              <h2 className="my-2 text-3xl font-semibold max-md:text-2xl">
                : الفعاليات
              </h2>
            </div>
            <div className="w-full h-full bg-gray-200 rounded-lg mb-4 p-2 overflow-y-scroll flex flex-col items-center gap-2">
              <ShowEvents />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
