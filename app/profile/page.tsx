import { BackButton } from "@/components/auth/back-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

const page = () => {
  return (
    <section className="w-full">
      <div className="bg-[url('/WadiRam.jpeg')] h-[300px] relative bg-no-repeat bg-cover bg-top">
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="container relative w-full h-full">
          <BackButton
            className="bg-white/70 text-black w-[50px] absolute top-4 left-4"
            href="/"
          >
            <FiArrowLeft size={30} />
          </BackButton>
          <Image
            src="/PFP.jpg"
            width={200}
            height={200}
            alt="ProfilePic"
            className="rounded-full border-2 border-black absolute bottom-0 right-0 translate-x-[-25%] translate-y-[25%] max-sm:right-[50%] max-sm:translate-x-[50%] shadow-lg"
          />
        </div>
      </div>
      <div
        className="container w-full text-right
       mt-20 max-sm:text-center"
      >
        <h1 className="text-5xl font-semibold">أهلا (الاسم)</h1>
        <div className="mt-10">
          <h2 className="text-2xl">: الهجن المسجلة</h2>
          <Button className="mt-5">اضف هجين</Button>
        </div>
        <div className="w-full h-full overflow-auto">
          <div className="w-full h-full overflow-x-auto sm:overflow-x-visible snap-end">
            <table className="w-full h-full border-2 border-black mt-5 whitespace-nowrap">
              <thead>
                <tr>
                  <td className="border-2 border-black">الفئة / السن</td>
                  <td className="border-2 pr-5 border-black">رقم الشريحة</td>
                  <td className="border-2 pr-5 border-black">اسم الهجين</td>
                  <td className="border-2 pr-5 border-black">التسلسل</td>
                </tr>
                <tr>
                  <td className="border-2 border-black">0</td>
                  <td className="border-2 pr-5 border-black"></td>
                  <td className="border-2 pr-5 border-black"></td>
                  <td className="border-2 pr-5 border-black"></td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
