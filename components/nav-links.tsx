import Link from "next/link";

interface Props {
  className?: string;
  enablescroll?: () => void;
}

const NavLinks = ({ className, enablescroll }: Props) => {
  return (
    <ul className={className || `flex items-center gap-5 max-lg:hidden`}>
      <li onClick={enablescroll}>
        <Link href="/admin/dashboard">لائحة المسؤول</Link>
      </li>
      <li onClick={enablescroll}>
        <Link href="mailto:info@jocrc.com">تواصل معنا</Link>
      </li>
      <li onClick={enablescroll}>
        <Link href="/profile#myCamels">المطايا الخاصة بي </Link>
      </li>
      <li onClick={enablescroll}>
        <Link href="/profile">الملف الشخصي</Link>
      </li>
    </ul>
  );
};

export default NavLinks;
