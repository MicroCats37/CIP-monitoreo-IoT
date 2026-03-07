"use client";

import PageContainer from "@/components/Pages/Monitoreo/PageContainer";
import { useValidPageData } from "@/hooks/ValidPageData/useValidPageData";

export default function Page() {
  const data = useValidPageData();
  return <PageContainer data={data} />;
}