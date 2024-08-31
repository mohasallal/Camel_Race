"use client";
import { useRouter } from "next/navigation";

interface RedirectButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
  path: string;
}

export const RedirectButton = ({
  children,
  mode,
  asChild,
  path,
}: RedirectButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/auth/${path}`);
  };

  if (mode === "modal") {
    return <span></span>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer relative">
      {children}
    </span>
  );
};
