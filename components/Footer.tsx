import {
  FaEnvelope,
  FaMobileAlt,
  FaInstagram,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white w-full mt-10 py-20 px-10">
      <div className="container flex items-start justify-between max-sm:flex-col max-sm:items-center max-sm:gap-5">
        <div className="text-right max-sm:text-center">
          <h2 className="font-bold text-3xl">رياضة الهجن الأردنية</h2>
          <p>البطولات المحلية في الاردن لسباق الهجن</p>
        </div>
        <div className="flex flex-col items-end justify-center gap-3 max-sm:items-center">
          <h2 className="font-bold text-3xl">تواصل معنا</h2>
          <p>
            <span className="flex items-center gap-2">
              <a className="underline" href="mailto:info@jocrc.com">
                info@jocrc.com
              </a>
              : ايميل <FaEnvelope />
            </span>
          </p>
          <p>
            <span className="flex items-center gap-2">
              <a className="underline" href="tel:+962796150202">
                0796150202
              </a>
              : اتصل بنا
              <FaMobileAlt />
            </span>
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/desert_magic/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                size={40}
                color="#FFFFFF"
                className="border-2 border-white rounded-full p-2"
              />
            </a>
            <a
              href="https://www.facebook.com/desert.Magic.rum/?locale=ar_AR"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook
                size={40}
                color="#FFFFFF"
                className="border-2 border-white rounded-full p-2"
              />
            </a>
            <a
              href="https://www.youtube.com/@camelracejo/videos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube
                size={40}
                color="#FFFFFF"
                className="border-2 border-white rounded-full p-2"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="container flex items-center mt-5">
        <span className="w-full border border-1 border-white h-[1px] max-sm:hidden" />
        <p className="whitespace-nowrap mx-2 max-sm:text-center max-sm:w-full">
          جميع الحقوق محفوظة &copy; 2024
        </p>
      </div>
    </footer>
  );
};

export default Footer;
