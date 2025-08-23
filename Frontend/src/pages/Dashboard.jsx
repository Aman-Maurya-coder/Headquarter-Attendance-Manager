import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


export default function Dashboard() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    console.log("data");
    let Cdate = new Date();
    let ddata = { req_date: Cdate };
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/dashboard/DateData', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ddata),
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch Subjectsss');
        }
        let data = await res.json();
        console.log("Fetched data:", data);
        data = data.data;
        // console.log("Fetched data:", data);
        // let unique_subjects = new Set();
        // let subjects = [];
        // for (let day of weekdays) {
        //   day = day.toLowerCase()
        //   // console.log("Day:", day);
        //   let weekday_sub = data[day];
        //   let day_sub_name = weekday_sub.map((sub) => sub.subjectId.name);
        //   // console.log(day_sub_name)
        //   setDay_sub((prev) => ({ ...prev, [day]: day_sub_name }));
        //   // console.log(day_sub)

        //   for (let subject of weekday_sub) {
        //     subjects.push(subject.subjectId.name)
        //   }
        //   // console.log("Subjects:", subjects);
        //   subjects.forEach(element => unique_subjects.add(element));
        // }
        // console.log(day_sub);
        // setUser_sub([...unique_subjects])
      } catch (err) {
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, []);





  const options = ["Option 1", "Option 2", "Option 3"];

  return (
    <div className="flex  bg-black w-[100%] h-4/5 text-white "  >
      <div className=" w-1/2 border-2  rounded-2xl h-[100vh] m-3 bg-[#1C1C1C] border-gray-600">
        <h1 className="text-center text-2xl font-bold p-3">Todays Sub :</h1>
        <div className="grid grid-cols-1 grid-rows-5 gap-4 items-center m-3 ">
          <div className="bg-[#3F3F3F] ">1</div>
          <div >2</div>
          <div >3</div>
          <div >4</div>
          <div >5</div>
        </div>
      </div>
      <div className="w-1/2 border-2 border-gray-600 rounded-2xl m-3 bg-[#1C1C1C] ">
        <h1 className="text-center text-2xl font-bold p-3">Weekly Time Table</h1>
      </div>
    </div>
  );
}
