import React from 'react'
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

interface TableCarsProps {
  nombre: string
  children: React.ReactNode
}

export const TableCars: React.FC<TableCarsProps> = ({ nombre, children }) => {
  return (
    <Card className="flex w-full sm:hidden">
      <CardContent className="p-6 w-full">
        <h2 className="text-center text-2xl font-bold mb-4">{nombre}</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-full text-center">Espacio</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
