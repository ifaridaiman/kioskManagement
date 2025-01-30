import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-80 mx-auto flex flex-col justify-between h-screen">
      <div className="flex justify-center items-center p-4">
        {/* logo */}
        <Image className="rounded-full border border-black" src={"/assets/logo/static/lemangtul_logo.jpeg"} height={100} width={100}  alt="LE-MANGTUL"/>
      </div>
      <div className="flex flex-col justify-top items-center gap-4">
        {/* Choice of Order */}
        <Link href={"/order/daily"} className="w-72 bg-gray-300 rounded border border-gray-500 p-4 flex flex-col justify-center items-center">
          <p className="text-base font-bold ">Daily</p>
          <p className="text-base font-light ">Order before 3pm</p>
        </Link>
        <Link href={"/order/preorder"} className="w-72 bg-gray-300 rounded border border-gray-500 p-4 flex flex-col justify-center items-center">
          <p className="text-base font-bold ">Preorder</p>
          <p className="text-base font-light ">Order before 3pm</p>
        </Link>
        <Link href={"/order/raya"} className="w-72 bg-gray-300 rounded border border-gray-500 p-4 flex flex-col justify-center items-center">
          <p className="text-base font-bold ">Raya Catering</p>
          <p className="text-base font-light ">Order before 3pm</p>
        </Link>
      </div>
      <div className="text-center p-2">
        <p className="text-xs text-gray-500">Developed by Naisu Technology</p>
      </div>
    </div>
  );
}
