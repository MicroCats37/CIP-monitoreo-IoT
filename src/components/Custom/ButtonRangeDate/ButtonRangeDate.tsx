"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CalendarIcon, ClockIcon, ChevronDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format, parse, isBefore, isAfter, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { DateRange } from "react-day-picker"



interface DateButtonProps {
  dateRange: DateRange | undefined
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>
  includeTime?: boolean
}

export function ButtonRangeDate({ dateRange, setDateRange, includeTime = true }: DateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(dateRange)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [startHour, setStartHour] = useState<string>("00")
  const [startMinute, setStartMinute] = useState<string>("00")
  const [endHour, setEndHour] = useState<string>("23")
  const [endMinute, setEndMinute] = useState<string>("59")
  const [error, setError] = useState<string | undefined>()

  // Update temp date range and time values when the actual date range changes
  useEffect(() => {
    if (dateRange) {
      setTempDateRange(dateRange)

      if (dateRange.from) {
        setStartDate(format(dateRange.from, "yyyy-MM-dd"))
        setStartHour(format(dateRange.from, "HH"))
        setStartMinute(format(dateRange.from, "mm"))
      }

      if (dateRange.to) {
        setEndDate(format(dateRange.to, "yyyy-MM-dd"))
        setEndHour(format(dateRange.to, "HH"))
        setEndMinute(format(dateRange.to, "mm"))
      }
    }
  }, [dateRange])

  // Update temp date range when date inputs change
  useEffect(() => {
    const newTempRange: DateRange = {
      from: startDate ? parse(startDate, "yyyy-MM-dd", new Date()) : undefined,
      to: endDate ? parse(endDate, "yyyy-MM-dd", new Date()) : undefined,
    }

    // Actualizar el estado tempDateRange incluso cuando las fechas están vacías
    setTempDateRange(newTempRange)

    // Limpiar el error cuando se borran las fechas
    if (isOpen && (!startDate || !endDate)) {
      setError(startDate ? (endDate ? undefined : "La fecha final es requerida") : "La fecha inicial es requerida")
    } else if (isOpen && startDate && endDate) {
      // Validar solo cuando ambas fechas están presentes
      validateDateRange()
    }
  }, [startDate, endDate, isOpen])

  // Validate the date range and time
  const validateDateRange = () => {
    // Limpiar el error previo
    setError(undefined)

    if (!startDate) {
      setError("La fecha inicial es requerida")
      return false
    }

    if (!endDate) {
      setError("La fecha final es requerida")
      return false
    }

    if (!tempDateRange?.from || !tempDateRange?.to) {
      return false
    }

    // Create full date-time objects for comparison
    const startDateTime = new Date(tempDateRange.from)
    const endDateTime = new Date(tempDateRange.to)
    const now = new Date()

    if (includeTime) {
      // Set hours and minutes
      startDateTime.setHours(Number.parseInt(startHour, 10))
      startDateTime.setMinutes(Number.parseInt(startMinute, 10))
      endDateTime.setHours(Number.parseInt(endHour, 10))
      endDateTime.setMinutes(Number.parseInt(endMinute, 10))
    }

    // Check if start date-time is in the future
    if (isAfter(startDateTime, now)) {
      setError("La fecha y hora inicial no puede ser posterior a la fecha y hora actual")
      return false
    }

    // Check if end date-time is in the future
    if (isAfter(endDateTime, now)) {
      setError("La fecha y hora final no puede ser posterior a la fecha y hora actual")
      return false
    }

    // Check if end date-time is before start date-time
    if (isBefore(endDateTime, startDateTime)) {
      setError("La fecha y hora final no puede ser anterior a la fecha y hora inicial")
      return false
    }

    // Check if dates are the same day and times are the same
    if (isSameDay(startDateTime, endDateTime) && startHour === endHour && startMinute === endMinute) {
      setError("Las horas inicial y final no pueden ser iguales en el mismo día")
      return false
    }

    return true
  }

  // Run validation whenever any of the date or time values change
  useEffect(() => {
    if (isOpen) {
      if (!startDate) {
        setError("La fecha inicial es requerida")
      } else if (!endDate) {
        setError("La fecha final es requerida")
      } else if (tempDateRange?.from && tempDateRange?.to) {
        validateDateRange()
      }
    }
  }, [tempDateRange, startHour, startMinute, endHour, endMinute, isOpen, startDate, endDate])

  // Format dates to display in the button
  const displayText = dateRange?.from ? (
    dateRange.to ? (
      <>
        {format(dateRange.from, includeTime ? "d MMM yyyy HH:mm" : "d MMM yyyy", { locale: es })} -{" "}
        {format(dateRange.to, includeTime ? "d MMM yyyy HH:mm" : "d MMM yyyy", { locale: es })}
      </>
    ) : (
      format(dateRange.from, includeTime ? "d MMM yyyy HH:mm" : "d MMM yyyy", { locale: es })
    )
  ) : (
    <span>Seleccionar fechas{includeTime ? " y horas" : ""}</span>
  )

  // Handle applying changes
  const handleApply = () => {
    // Validar primero
    if (!validateDateRange()) {
      return
    }

    if (tempDateRange?.from && tempDateRange?.to) {
      const newFrom = new Date(tempDateRange.from)
      const newTo = new Date(tempDateRange.to)

      if (includeTime) {
        // Set hours and minutes for from date
        newFrom.setHours(Number.parseInt(startHour, 10))
        newFrom.setMinutes(Number.parseInt(startMinute, 10))

        // Set hours and minutes for to date
        newTo.setHours(Number.parseInt(endHour, 10))
        newTo.setMinutes(Number.parseInt(endMinute, 10))
      }

      setDateRange({
        from: newFrom,
        to: newTo,
      })
      setIsOpen(false)
    }
  }

  // Generate hours options (00-23)
  const hoursOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return (
      <SelectItem key={`hour-${hour}`} value={hour}>
        {hour}
      </SelectItem>
    )
  })

  // Generate minutes options in increments of 5 (00, 05, 10, 15, etc.)
  const generateMinutesOptions = () => {
    const options = []
    for (let i = 0; i <= 55; i += 5) {
      const minute = i.toString().padStart(2, "0")
      options.push(
        <SelectItem key={`minute-${minute}`} value={minute}>
          {minute}
        </SelectItem>,
      )
    }
    return options
  }

  const minutesOptions = generateMinutesOptions()

  // Check if the end minute is already in the list of options
  const isEndMinuteInOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0")).includes(
    endMinute,
  )

  // Add the exact end minute if it's not already in the list of options
  const exactEndMinuteOption = !isEndMinuteInOptions ? (
    <SelectItem key={`minute-exact-${endMinute}`} value={endMinute}>
      {endMinute}
    </SelectItem>
  ) : null

  // Get today's date in yyyy-MM-dd format for max attribute
  const today = format(new Date(), "yyyy-MM-dd")

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full md:w-auto justify-between text-left font-normal border-2 px-4 shadow-sm transition-all ",
            !dateRange?.from && "text-muted-foreground",
            error && isOpen && "border-red-300",
          )}
        >
          <div className="flex items-center">
            <CalendarIcon className={cn("mr-2 h-5 w-5", error && isOpen ? "text-red-500" : "text-gray-500")} />
            <span className="truncate">{displayText}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200 flex-shrink-0",
              error && isOpen ? "text-red-500" : "text-gray-500",
              isOpen && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="center"
        side="bottom"
        sideOffset={4}
        alignOffset={0}
        avoidCollisions={true}
      >
        <div className="p-4 space-y-4 max-w-[95vw] overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium text-gray-700">
                Fecha inicial
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-medium text-gray-700">
                Fecha final
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={today}
                className="w-full"
              />
            </div>
          </div>

          {includeTime && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Hora inicial</Label>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  <div className="flex space-x-1">
                    <Select value={startHour} onValueChange={setStartHour}>
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Hora" />
                      </SelectTrigger>
                      <SelectContent>{hoursOptions}</SelectContent>
                    </Select>
                    <span className="flex items-center">:</span>
                    <Select value={startMinute} onValueChange={setStartMinute}>
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent>{minutesOptions}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Hora final</Label>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  <div className="flex space-x-1">
                    <Select value={endHour} onValueChange={setEndHour}>
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Hora" />
                      </SelectTrigger>
                      <SelectContent>{hoursOptions}</SelectContent>
                    </Select>
                    <span className="flex items-center">:</span>
                    <Select value={endMinute} onValueChange={setEndMinute}>
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutesOptions}
                        {exactEndMinuteOption}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center text-sm text-red-500 bg-red-50 p-2 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleApply}
              className={cn(
                "transition-colors",
                error
                  ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gray-800 hover:bg-gray-700 text-white",
              )}
              disabled={!!error}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

