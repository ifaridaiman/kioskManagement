import Image from "next/image";

export default function Home() {
  return (
    <div className=" h-screen grid grid-rows-[auto,1fr,auto] bg-[url('/assets/background/lemang-bg.png')] bg-cover bg-center">
      <main className="flex flex-col gap-8 row-start-2 justify-center items-center ">
        <Image
          src="/assets/logo/static/lemangtul_logo_white.svg"
          alt="Lemangtul logo"
          width={180}
          height={38}
          priority
        />
        <div>
          <h1 className="text-5xl md:text-9xl font-bold text-center text-white">
            COMING SOON
          </h1>
          <p className="text-base md:text-4xl font-light text-center text-white mt-4">
            100% buatan Saujana Utama
          </p>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-center">
        <p className="text-xs text-gray-50">Develop by Naisu Technologies</p>
      </footer>
    </div>
  );
}