import { Calendar , CalendarDayButton  } from "@/components/ui/calendar"
import { useState , useEffect } from "react"

function Calender() {
  const [date, setDate] = useState(new Date())
  useEffect(() => {
    console.log(date.toDateString())
  }, [date])
  return (
    <div className="flex min-h-[90vh]  flex-col items-center justify-center">
       <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />
    </div>
  )
}

export default Calender