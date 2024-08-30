interface Props {
  className?: string;
  enablescroll?: () => void;
}

const NavLinks = ({ className, enablescroll }: Props) => {
  return (
    <ul className={className || `flex items-center gap-5 max-lg:hidden`}>
      <li onClick={enablescroll}>تواصل معنا</li>
      <li onClick={enablescroll}>رؤية الهجن</li>
      <li onClick={enablescroll}>اضافة هجن</li>
      <li onClick={enablescroll}>الملف الشخصي</li>
    </ul>
  );
};

export default NavLinks;
