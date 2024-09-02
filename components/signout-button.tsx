import { signOut } from "@/lib/auth";

export const SignOutButton = () => {
  return (
    <button onClick={() => signOut()} className="btn btn-primary">
      Sign Out
    </button>
  );
};
