"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
 
  const router = useRouter();

  useEffect(() => {
    router.push("/"); // Redirige al usuario a la página de login
  }, [router]);

  return null; // No renderiza nada en esta página porque redirige.
  
  
}
