import { LucideIcon } from "lucide-react"

export interface PageType {
  title: string
  url: string
  icon: LucideIcon
  pages?: PageType[]
}