"use client";

import PageContainer from "@/components/Pages/Monitoreo/PageContainer";
import { useValidPageData } from "@/hooks/ValidPageData/useValidPageData";
import { use } from "react";


interface PageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);
  const data = useValidPageData(resolvedParams.id);
  return <PageContainer data={data} />;
}