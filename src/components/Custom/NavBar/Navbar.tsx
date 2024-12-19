import { Menu } from "lucide-react"
import { Sheet,SheetContent,SheetTrigger } from "../../ui/sheet"

export default function Navbar() {
  return (
    <div className="flex items-center px-2 gap-x-4 md:px-6 justify-between w-full bg-background border-b h-20">
        <div className="block md:hidden">
            <Sheet>
                <SheetTrigger className="flex items-center">
                   <Menu></Menu> 
                </SheetTrigger>
                <SheetContent side="left">
                    <div>asdas</div>
                </SheetContent>
            </Sheet>
        </div>

      
    </div>
  )
}
