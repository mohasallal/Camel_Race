import React from "react";
import { RedirectButton } from "./auth/redirect-button";
import { Button } from "./ui/button";

interface Props {
  className?: string;
  enablescroll?: () => void;
}

const NavButtons = ({ className, enablescroll }: Props) => {
  return (
    <div className={className || `flex items-center gap-5 max-lg:hidden`}>
      <RedirectButton path="login">
        <Button
          onClick={enablescroll}
          className="rounded-xl bg-gray-200 opacity-60 text-black font-bold hover:bg-gray-300 duration-200"
        >
          تسجيل الدخول
        </Button>
      </RedirectButton>
      {/* <RedirectButton path="register">
        <Button
          onClick={enablescroll}
          className="rounded-xl bg-gray-200 opacity-60 text-black font-black hover:bg-gray-300 duration-200"
        >
          انشاء حساب
        </Button>
      </RedirectButton> */}
    </div>
  );
};

export default NavButtons;
