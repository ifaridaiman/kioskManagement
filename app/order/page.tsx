"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/order/daily");
  }, [router]);

  return (
    <div className="h-screen flex justify-center items-center">
      <p>Redirecting...</p>
    </div>
  );
}
