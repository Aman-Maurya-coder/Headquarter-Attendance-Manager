import { useEffect, useState } from "react";

export default function Dashboard() {
   const [dateSubj, setDateSubj] = useState([]);
   const [statusUpdate, setstatusUpdate] = useState(null); 

   useEffect(() => {
      let Cdate = new Date();
      Cdate.setDate(Cdate.getDate() - 2);

      console.log(Cdate);
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
      
      // console.log(dateSubj);
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

   useEffect(() => {
   console.log("dateSubj updated:", dateSubj);
}, [dateSubj]);

   // useEffect → send update whenever statusUpdate changes
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
      <div className="flex bg-black w-[100%] h-4/5 text-white">
         {/* Left: Subjects + radios */}
         <div className="w-1/2 border-2 rounded-2xl h-[100vh] m-3 bg-[#1C1C1C] border-gray-600">
            <h1 className="text-center text-2xl font-bold p-3">Todays Sub :</h1>
            <div className="grid grid-cols-1 grid-rows-5 gap-4 items-center m-3 ">
               {dateSubj.map(({ subjectId, status }) => (
                  <div
                     key={subjectId.subjCode}
                     className="flex justify-between items-center border-2 border-gray-600 rounded-2xl p-4 bg-[#2A2A2A] hover:bg-gray-700 transition duration-300"
                  >
                     <h2 className="text-xl font-semibold">{subjectId.name}</h2>
                     <div className="flex gap-4">
                        {/* Present */}
                        <div>
                           <input
                              type="radio"
                              id={`${subjectId.subjCode}-present`}
                              name={subjectId.subjCode}
                              value="present"
                              checked={status === "present"}
                              onChange={(e) =>
                                 handleChange(subjectId.subjCode , e.target.value)
                              }
                              className="hidden"
                           />
                           <label
                              htmlFor={`${subjectId.subjCode}-present`}
                              className={`me-2 border-2 border-gray-600 rounded-lg p-2 cursor-pointer ${status === "present" ? "bg-green-600" : "hover:bg-gray-600"
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
                              className={`me-2 border-2 border-gray-600 rounded-lg p-2 cursor-pointer ${status === "absent" ? "bg-red-600" : "hover:bg-gray-600"
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
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Debug / Preview */}
         <div className="w-1/2 border-2 border-gray-600 rounded-2xl m-3 bg-[#1C1C1C]">
            <h1 className="text-center text-2xl font-bold p-3">Weekly Time Table</h1>
            <pre className="p-4">{JSON.stringify(statusUpdate, null, 2)}</pre>
         </div>
      </div>
   );
}
