import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
   const [dateSubj, setDateSubj] = useState([]);
   const [statusUpdate, setstatusUpdate] = useState(null);
   const [TotalData, setTotalData] = useState([]);

   useEffect(() => {
      let Cdate = new Date();
      Cdate.setDate(Cdate.getDate());

      let ddata = { req_date: Cdate };

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
   }, []);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await fetch(
               "http://localhost:8000/api/v1/dashboard/subjData",
               {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
               }
            );

            if (!res.ok) throw new Error("Failed to fetch subjects");
            let TotalData = await res.json();
            console.log("TotalData", TotalData);
            setTotalData(TotalData.data);

         } catch (err) {
            console.error(err);
         }
      };

      fetchData();
   }, []);

   const handleChange = (subjectId, value) => {
      setDateSubj((prev) =>
         prev.map((sub) =>
            sub.subjectId.subjCode === subjectId ? { ...sub, status: value } : sub
         )
      );

      // ✅ store info for backend call
      setstatusUpdate({
         subject_id: subjectId,
         subj_status: value,
         req_date: new Date(),
      });
   };

   // Debug
   useEffect(() => {
      console.log("dateSubj updated:", dateSubj);
   }, [dateSubj]);

   // Send update whenever statusUpdate changes
   useEffect(() => {
      if (!statusUpdate) return;
      const sendUpdate = async () => {
         try {
            const res = await fetch(
               "http://localhost:8000/api/v1/dashboard/subjAttendance",
               {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(statusUpdate),
                  credentials: "include",
               }
            );

            if (!res.ok) throw new Error("Failed to update attendance");
            console.log("✅ Updated:", statusUpdate);
         } catch (err) {
            console.error("❌ Update failed:", err);
         }
      };

      sendUpdate();
   }, [statusUpdate]);

   return (
      <div className="flex bg-black w-[100%] text-white flex-wrap justify-evenly">
         {/* Left: Subjects + radios */}
         <div className="w-[48%] border-2 rounded-2xl  m-3 bg-[#1C1C1C] border-gray-600 h-fit ">
            <h1 className="text-center text-2xl font-bold p-3">Todays Sub :</h1>
            <div className="grid grid-cols-1 grid-rows-5 gap-4 items-center m-3 ">
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

         {/* Right: Total Attendance */}
         <div className="w-[48%] border-2 border-gray-600 rounded-2xl m-3 bg-[#1C1C1C]">
            <h1 className="text-center text-2xl font-bold p-3">Total Attendance</h1>
            <div className="flex flex-wrap ">
               {TotalData.map((subject) => {
                  const percentage =
                     subject.totalClasses > 0
                        ? (subject.attendedClasses / subject.totalClasses) * 100
                        : 0;

                  // choose color dynamically
                  let barColor = "#ef4444"; // red
                  if (percentage >= 75) barColor = "#22c55e"; // green
                  else if (percentage >= 50) barColor = "#eab308"; // yellow

                  const data = {
                     datasets: [
                        {
                           data: [percentage, 100 - percentage],
                           backgroundColor: [barColor, "#374151"], // trail gray
                           borderWidth: 0,
                        },
                     ],
                  };

                  const options = {
                     cutout: "70%",
                     plugins: { tooltip: { enabled: false } },
                     animation: {
                        animateRotate: true,
                        duration: 1200,
                     },
                  };

                  return (
                     <div
                        key={subject._id}
                        className="flex items-center border-2 border-gray-600 rounded-2xl p-4 bg-[#2A2A2A] hover:bg-gray-700 transition duration-300 m-3 w-[45%] h-[200px]"
                     >
                        {/* Left: Circle chart */}
                        <div className="relative w-[90px] h-[90px] mr-4">
                           <Doughnut data={data} options={options} />
                           <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                              {percentage.toFixed(0)}%
                           </div>
                        </div>

                        {/* Right: Details */}
                        <div className="grid grid-cols-2 grid-rows-4 gap-4 w-[75%]">
                           <div className="col-span-2 truncate">
                              <h3 className="font-semibold text-lg">{subject.name}</h3>
                           </div>
                           <div className="row-start-2"><h4>Present : {subject.attendedClasses}</h4></div>
                           <div className="row-start-2"><h4>Absent : {subject.missedClasses}</h4></div>
                           <div className="row-start-3"><h4>Cancel : {subject.cancelledClasses}</h4></div>
                           <div className="row-start-3"><h4>Total : {subject.totalClasses}</h4></div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
}
