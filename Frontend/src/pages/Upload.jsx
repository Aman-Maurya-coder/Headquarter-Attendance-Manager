import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Arrow from "../Components/Arrow";
import Handlechange from "../Components/HandleChange";
import { ClockFading } from "lucide-react";


const Upload = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [user_sub, setUser_sub] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [day_sub, setDay_sub] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  const formSubmit = async (data) => {
    try {
      if (data.target_attendance === "") {
        data.target_attendance = 75;
      }
      if (data.present === "") {
        data.present = 0;
      }
      if (data.absent === "") {
        data.absent = 0;
      }
      if (data.cancelled === "") {
        data.cancelled = 0;
      }
      console.log(data);

      const res = await fetch("http://localhost:8000/api/v1/upload/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error("Something went wrong while Adding Subject");
      }
      const result = await res.json();
      console.log(result);
      setUser_sub((prev) => [...prev, data.sub_name]);
    } catch (err) {
      console.error(err);
    }
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/upload/getSubjects', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch Subjectsss');
        }
        let data = await res.json();
        console.log("Fetched data:", data);
        data = data.data;
        // console.log("Fetched data:", data);
        let unique_subjects = new Set();
        let subjects = [];
        for (let day of weekdays) {
          day = day.toLowerCase()
          // console.log("Day:", day);
          let weekday_sub = data[day];
          let day_sub_name = weekday_sub.map((sub) => sub.subjectId.name);
          // console.log(day_sub_name)
          setDay_sub((prev) => ({ ...prev, [day]: day_sub_name }));
          // console.log(day_sub)

          for (let subject of weekday_sub) {
            subjects.push(subject.subjectId.name)
          }
          // console.log("Subjects:", subjects);
          subjects.forEach(element => unique_subjects.add(element));
        }
        // console.log(day_sub);
        setUser_sub([...unique_subjects])
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("day Subjects:", day_sub);
  }, [day_sub]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <div className="font-space font-semibold bg-black">
      {" "}
      {/* div for the whole page */}
      <div className="flex ">
        {" "}
        {/* div for addSub and YourSub */}
        <div className="  w-1/2 m-3 rounded-2xl bg-gray-950 shadow-card_shadow   ">
          {" "}
          {/* div for addSubject */}
          <h1 className="font-medium text-3xl text-center mb-6 mt-6 text-blue_site " style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Add Subject :
          </h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="flex gap-3 justify-evenly items-center my-3 text-md pb-2 px-1 flex-wrap">
              {" "}
              {/* form mostOuter div */}
              <div className="grid grid-cols-3 grid-rows-1 gap-3 w-full ml-3">
                {" "}
                {/* div containing name , subjectCode and target attendance */}
                <div>
                  {" "}
                  {/* Div for Name */}
                  <span className="inline-block mb-1">Name:</span>
                  <input
                    type="text"
                    className="bg-slate-100 p-2 rounded-lg dark:bg-color_button placeholder-gray-600 dark:text-gray-700 font-normal"
                    placeholder="Name of subject"
                    {...register("sub_name", {
                      required: { value: true, message: "Field is required" },

                    })}
                  />
                </div>
                <div>
                  {" "}
                  {/* Div for Subject Code */}
                  <span className="inline-block mb-1">Subject Code: </span>
                  <input
                    type="text"
                    className="p-2 rounded-lg dark:bg-color_button placeholder-gray-600 dark:text-gray-700 "
                    placeholder="Code of subject "
                    {...register("sub_code", { required: true })}
                  />
                </div>
                <div>
                  {" "}
                  {/* Div for Target Attendance */}
                  <span className="inline-block mb-1">Target Attendance :</span>
                  <input
                    type="number"
                    id="targetAttendance"
                    // onChange={(e) => Handlechange(e, setValue)}
                    {...register("target_attendance", {
                      // required: { value: false, message: "Field is required" },
                      defaultValue: "75",

                    })}
                    aria-describedby="helper-text-explanation"
                    className="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-color_button  dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="75"
                  // required
                  />
                </div>
              </div>
              <div className="w-full flex gap-3 items-center mt-2 mr-3">
                {" "}
                {/* div for weekdays */}
                <span className="px-3">Days:</span>
                <ul className="grid w-full gap-2 md:grid-cols-5 md:grid-rows-2">
                  {weekdays.map((day) => (
                    <li key={day.toLowerCase()}>
                      <input
                        type="checkbox"
                        id={day.toLowerCase()}
                        value={day.toLowerCase()}
                        className="hidden peer"
                        {...register("days", {
                          required: { value: true, message: "field is imp" },
                        })}
                      />
                      <label
                        htmlFor={day.toLowerCase()}
                        className="flex items-center text-center justify-evenly w-full p-1 text-gray-600 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300  peer-checked:border-blue-600 dark:peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 
                        dark:peer-checked:bg-gray-600 hover:bg-gray-50 dark:text-gray-600 dark:bg-color_button dark:hover:bg-gray-700"
                      >
                        <div className="block">
                          <div className="w-full text-m font-semibold">
                            {day}
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-7 justify-start w-full mt-3 flex-wrap">
                {" "}
                {/* div for present, absent and cancelled */}
                <div className="flex  gap-2 items-center">
                  {" "}
                  {/* div for present */}
                  <span className="px-3 ">Present :</span>
                  <Arrow Id="present" register={register} errors={errors} />
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  {/* div for absent */}
                  <span>Absent:</span>

                  <Arrow Id="absent" register={register} errors={errors} />
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  {/* div for cancelled */}
                  <span>Cancelled :</span>
                  <Arrow Id="cancelled" register={register} errors={errors} />
                </div>
              </div>
              <button
                type="submit"
                className="focus:outline-none text-white bg-blue_site hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue_site dark:hover:bg-purple-700 dark:focus:ring-purple-900 w-6/10 mt-4"
              >
                Add
              </button>
            </div>
          </form>
          {/* {errors.sub_name && <div className="text-red-500 p-0 my-0">{errors.sub_name.message} </div>} */}
        </div>
        <div className=" w-1/2 m-3 rounded-2xl bg-gray-950 shadow-card_shadow">
          <h1 className="font-medium text-3xl text-center mt-6 mb-4">
            Your Subjects :
          </h1>
          <div>
            <ul className="flex contain-content flex-wrap gap-2 p-2.5 ">
              {user_sub.map((subject) => (
                <li
                  key={subject}
                  className="focus:outline-none text-white bg-blue_site hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue_site dark:hover:bg-purple-700 dark:focus:ring-purple-900 "

                >
                  {subject}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="m-2 p-3 rounded-xl bg-black shadow-card_shadow">
        <h1 className="p-3 text-center text-2xl font-bold bg-gray-950"> Time Table :</h1>
        <div className="flex gap-1.5 justify-evenly ">
          {weekdays.map((day, index) => (
            <div key={index} className="Time_table overflow-y-scroll bg-gray-900  ">
              <div className="">
                <h1 className="text-lg font-bold capitalize ">{day}:</h1>
                {/* <div className=" "> */}
                <ul className="flex contain-content flex-wrap gap-1 p-2.5 mt-3">
                  {(day_sub[day.toLowerCase()] || []).map((subject) => (<li
                    key={subject}
                    className="focus:outline-none w-full text-white bg-blue_site hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 truncate dark:bg-blue_site dark:hover:bg-purple-700 dark:focus:ring-purple-900 "
                  >
                    {subject}
                  </li>
                  ))}
                </ul>
                {/* </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upload;
