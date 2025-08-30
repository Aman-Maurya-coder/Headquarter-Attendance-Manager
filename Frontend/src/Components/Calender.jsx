import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { useState, useEffect } from "react"

function Calender() {
  const [date, setDate] = useState(new Date())
  const [dateSubj, setDateSubj] = useState([]);

  useEffect(() => {

    let ddata = { req_date: date };

    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/dashboard/DateData",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ddata),
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch subjects");
        let resp = await res.json();
        setDateSubj(resp.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [date]);

  // useEffect(() => {
  //   console.log(date.toDateString())
  // }, [date])

  return (
    <div className="flex min-h-[90vh]  items-center justify-evenly flex-wrap flex-row">
      <div className="w-fit">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border bg-black"
        />
      </div>
      <div className="grid grid-cols-1 grid-rows-5 gap-4 items-center m-3 border-2 border-gray-600 rounded-2xl p-4 bg-black w-fit">
        <h1 className="text-center text-2xl font-bold p-3">
          Date :{" "}
          {date
            ? date.toLocaleDateString("en-GB", {
              weekday: "short", // Fri
              day: "2-digit",   // 16
              month: "short",   // Jul
              year: "numeric",  // 2025
            })
            : "No Date Selected"}
        </h1>

        {dateSubj.map(({ subjectId, status }) => (
          <div
            key={subjectId.subjCode}
            className="flex justify-between items-center border-2 border-gray-600 rounded-2xl p-4 bg-[#2A2A2A] hover:bg-gray-700 transition duration-300"
          >
            <div className="w-1/3 ">
              <h2 className="text-xl font-semibold truncate">{subjectId.name}</h2>
            </div>
            <div className="flex gap-4 items-center">
              {/* Present */}
              <div>
                <input
                  type="radio"
                  id={`${subjectId.subjCode}-present`}
                  name={subjectId.subjCode}
                  value="present"
                  checked={status === "present"}
                  onChange={(e) =>
                    handleChange(subjectId.subjCode, e.target.value)
                  }
                  className="hidden"
                />
                <label
                  htmlFor={`${subjectId.subjCode}-present`}
                  className={`me-2 border-2 border-gray-600 rounded-lg p-2 cursor-pointer ${status === "present"
                    ? "bg-green-600"
                    : "hover:bg-gray-600"
                    }`}
                >
                  Present
                </label>
              </div>

              {/* Absent */}
              <div>
                <input
                  type="radio"
                  id={`${subjectId.subjCode}-absent`}
                  name={subjectId.subjCode}
                  value="absent"
                  checked={status === "absent"}
                  onChange={(e) =>
                    handleChange(subjectId.subjCode, e.target.value)
                  }
                  className="hidden"
                />
                <label
                  htmlFor={`${subjectId.subjCode}-absent`}
                  className={`me-2 border-2 border-gray-600 rounded-lg p-2 cursor-pointer ${status === "absent"
                    ? "bg-red-600"
                    : "hover:bg-gray-600"
                    }`}
                >
                  Absent
                </label>
              </div>

              {/* Cancelled */}
              <div>
                <input
                  type="radio"
                  id={`${subjectId.subjCode}-cancel`}
                  name={subjectId.subjCode}
                  value="cancel"
                  checked={status === "cancel"}
                  onChange={(e) =>
                    handleChange(subjectId.subjCode, e.target.value)
                  }
                  className="hidden"
                />
                <label
                  htmlFor={`${subjectId.subjCode}-cancel`}
                  className={`me-2 border-2 border-gray-600 rounded-lg p-2 cursor-pointer ${status === "cancel"
                    ? "bg-yellow-600"
                    : "hover:bg-gray-600"
                    }`}
                >
                  Cancelled
                </label>
              </div>

              {/* ✅ Reset button */}
              <div>
                <button
                  type="button"
                  onClick={() => handleChange(subjectId.subjCode, "pending")}
                  className="border-2 border-gray-600 rounded-lg p-2 cursor-pointer hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    // </div>
  )
}

export default Calender