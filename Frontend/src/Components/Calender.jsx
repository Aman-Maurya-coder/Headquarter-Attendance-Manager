import { Calendar , CalendarDayButton  } from "@/components/ui/calendar"
import { useState } from "react"

function Calender() {
  const [date, setDate] = useState(new Date())
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
       <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-lg border"
  />

  <CalendarDayButton
  mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-lg border"
  />
    </div>
  )
}

export default Calender