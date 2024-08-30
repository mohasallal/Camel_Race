import Image from "next/image";
import { Button } from "./ui/button";
import { FaBars } from "react-icons/fa";
import { RedirectButton } from "./auth/redirect-button";

const Nav = () => {
  return (
    <nav className="container flex justify-between mb-5">
      <div className="lg:hidden flex items-center justify-center">
        <FaBars size={24} />
      </div>
      <div className="flex items-center gap-5 max-lg:hidden">
        <RedirectButton path="login">
          <Button className="rounded-xl bg-gray-200 opacity-60 text-black font-bold hover:bg-gray-300 duration-200">
            تسجيل الدخول
          </Button>
        </RedirectButton>
        <RedirectButton path="register">
          <Button className="rounded-xl bg-gray-200 opacity-60 text-black font-black hover:bg-gray-300 duration-200">
            انشاء حساب
          </Button>
        </RedirectButton>
      </div>
      <div className="flex items-center gap-5 justify-end">
        <ul className="flex items-center gap-5 max-lg:hidden">
          <li>تواصل معنا</li>
          <li>رؤية الهجن</li>
          <li>اضافة هجن</li>
          <li>الملف الشخصي</li>
        </ul>
        <div className="bold text-2xl flex items-center justify-center">
          <Image
            src="/LogoHeader.png"
            height={75}
            width={225}
            alt="Logo Header"
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
