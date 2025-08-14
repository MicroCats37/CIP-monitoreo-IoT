"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Circle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import type { PageType } from "@/components/Custom/SidebarComponent/Sidebar.types"

interface NestedMenuItemProps {
  item: PageType
  level: number
  parentPath?: string
}

// Versión simplificada sin refs problemáticas
export const NestedMenuItem = memo(function NestedMenuItem({ item, level, parentPath = "" }: NestedMenuItemProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isManuallyControlled, setIsManuallyControlled] = useState(false)

  // Función recursiva memoizada
  const checkActiveRecursive = useMemo(() => {
    const check = (pages: PageType[]): boolean => {
      return pages.some((page) => {
        if (pathname === page.url) return true
        if (page.pages) return check(page.pages)
        return false
      })
    }
    return check
  }, [pathname])

  // Estados calculados y memoizados
  const itemState = useMemo(() => {
    const isActive = pathname === item.url
    const hasActiveChild = item.pages ? checkActiveRecursive(item.pages) : false
    const shouldHighlight = isActive || hasActiveChild
    const isExactMatch = pathname === item.url && item.url !== "#"

    return { isActive, hasActiveChild, shouldHighlight, isExactMatch }
  }, [pathname, item.url, item.pages, checkActiveRecursive])

  // Padding memoizado
  const style = useMemo(
    () => ({
      paddingLeft: `${0.75 + level * 0.75}rem`,
    }),
    [level],
  )

  // Auto-expandir solo cuando cambia la ruta y hay hijo activo
  useEffect(() => {
    if (itemState.hasActiveChild && !isManuallyControlled) {
      setIsOpen(true)
    }
  }, [itemState.hasActiveChild, isManuallyControlled])

  // Handler que permite control manual completo
  const handleOpenChange = useCallback((open: boolean) => {
    setIsManuallyControlled(true)
    setIsOpen(open)
  }, [])

  // Función para obtener las clases CSS
  const getButtonClasses = useCallback(() => {
    const baseClasses = "w-full justify-start sidebar-item shadow-sm rounded-md transition-all duration-200"

    if (itemState.isExactMatch) {
      return `${baseClasses} bg-primary text-primary-foreground shadow-md border-l-4 border-primary-foreground/20`
    } else if (itemState.isActive) {
      return `${baseClasses} bg-primary/80 text-primary-foreground shadow-sm`
    } else if (itemState.shouldHighlight) {
      return `${baseClasses} bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary/30`
    } else {
      return `${baseClasses} hover:bg-sidebar-accent/50 hover:shadow-md`
    }
  }, [itemState])

  // Elemento sin hijos
  if (!item.pages || item.pages.length === 0) {
    return (
      <div style={style} className="p-1">
        <SidebarMenuButton asChild className={getButtonClasses() }>
          <Link href={item.url} >
            {item.icon ? (
              <item.icon
                className={`h-4 w-4 ${
                  itemState.isExactMatch
                    ? "text-primary-foreground"
                    : itemState.isActive
                      ? "text-primary-foreground/90"
                      : itemState.shouldHighlight
                        ? "text-sidebar-accent-foreground"
                        : ""
                }`}
              />
            ) : (
              <Circle className="h-2 w-2 fill-current" />
            )}
            <span className="flex-1 font-medium">{item.title}</span>
            {itemState.isExactMatch && <div className="h-2 w-2 rounded-full bg-primary-foreground/40 animate-pulse " />}
          </Link>
        </SidebarMenuButton>
      </div>
    )
  }

  // Elemento con hijos
  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <div style={style} className="p-1">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={`w-full justify-start shadow-sm rounded-md sidebar-item transition-all duration-200 ${
              itemState.shouldHighlight
                ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary/30"
                : "hover:bg-sidebar-accent/50 hover:shadow-md"
            }`}
          >
            {item.icon ? (
              <item.icon className={`h-4 w-4 ${itemState.shouldHighlight ? "text-sidebar-accent-foreground" : ""}`} />
            ) : (
              <Circle className="h-2 w-2 fill-current" />
            )}
            <span className="flex-1 font-medium">{item.title}</span>
            <ChevronRight
              className={`h-4 w-4 rounded-full transition-all duration-300 ease-out ${
                isOpen ? "rotate-90 bg-sidebar-accent/20" : ""
              } ${itemState.shouldHighlight ? "text-sidebar-accent-foreground" : ""}`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="overflow-hidden">
        <div className={level === 0 ? "animate-in slide-in-from-top-2 duration-300" : ""}>
          {item.pages.map((subItem, index) => (
            <NestedMenuItem
              key={`${subItem.url || subItem.title}-${level}-${index}`}
              item={subItem}
              level={level + 1}
              parentPath={`${parentPath}/${item.title}`}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
})

// Configurar displayName para debugging
NestedMenuItem.displayName = "NestedMenuItem"
