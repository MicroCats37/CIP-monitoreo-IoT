import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";



export function RealTimeCondition(range: QueryTimeType): boolean {
    return range === "30m" || range === "1h";
  }
  