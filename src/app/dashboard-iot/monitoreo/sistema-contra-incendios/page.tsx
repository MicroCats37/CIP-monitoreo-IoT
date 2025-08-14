"use client";

import PageContainer from "@/components/Pages/Monitoreo/PageContainer";
import { useValidPageData } from "@/hooks/ValidPageData/useValidPageData";


interface PageProps {
  params: {
    id?: string;
  };
}

export default function Page({ params }: PageProps) {
  const data = useValidPageData(params.id);
  return <PageContainer data={data} />;
}