import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Arrow from "../Components/Arrow"


const Upload = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formSubmit = async (data) => {
    console.log(data);
    try {
      const res = await fetch("http://localhost:8000/api/v1/addSubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Something went wrong while signing up");
      }
      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="flex ">
        <div className="  w-1/2 m-3 rounded-2xl bg-card_bg shadow-card_shadow ">
          <h1 className="font-medium text-3xl text-center mb-4 mt-6">
            Add Subject :
          </h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="flex gap-3 justify-evenly items-center my-3 text-md pb-2 px-1 flex-wrap">
              <span>Name:</span>
              <input
                type="text"
                className="bg-slate-100 p-2 rounded-lg "
                placeholder="Name of subject"
                {...register("sub_name", {
                  required: { value: true, message: "Field is required" },
                })}
              />
              <span>Subject Code: </span>
              <input
                type="text"
                className="bg-slate-100 p-2 rounded-lg "
                placeholder="Code of subject :"
                {...register("sub_code", { required: true })}
              />
              <button
                type="submit"
                className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              >Add
              </button>

              <div className="w-full flex gap-3 items-center mt-2 mr-3">
                <span className="px-3">Days:</span>
                <ul className="grid w-full gap-2 md:grid-cols-5 md:grid-rows-2">
                  {weekdays.map((day) => (
                    <li key={day.toLowerCase()}>
                      <input
                        type="checkbox"
                        id={day.toLowerCase()}
                        value={day}
                        className="hidden peer"
                        {...register("days", { required: { value: true, message: "field is imp" } })}
                      />
                      <label
                        htmlFor={day.toLowerCase()}
                        className="flex items-center text-center justify-evenly w-full p-1 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <div className="block">
                          <div className="w-full text-m font-semibold">{day}</div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-7 justify-start w-full mt-3 flex-wrap">
                <div className="flex  gap-3 items-center">
                  <span className="px-3 ">Present :</span>
                  {/* <input
                    type="text"
                    className="underline padding-1"
                    placeholder="0"
                    {...register("present", {
                      required: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers are allowed",
                      },
                    })}
                  /> */}
                  <Arrow 
                   Id="present" register={register} errors={errors}
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <span>Absent:</span>
                  {/* <input
                    type="text"
                    className="bg-slate-100 p-2 rounded-lg "
                    placeholder="Name "
                    {...register("absent", {
                      required: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers are allowed",
                      },
                    })}
                  /> */}
                  <Arrow 
                    Id="absent" register={register} errors={errors}
                  />
                </div>

                <div className="flex gap-3 items-center">
                  <span>Cancelled :</span>
                  <Arrow 
                  Id="cancelled" register={register} errors={errors}/>
                  {/* <input
                    type="text"
                    className="bg-slate-100 p-2 rounded-lg "
                    placeholder="Name of subject"
                    {...register("missed", {
                      required: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers are allowed",
                      },
                    })}
                  /> */}

                </div>
              </div>
            </div>
          </form>
          {/* {errors.sub_name && <div className="text-red-500 p-0 my-0">{errors.sub_name.message} </div>} */}
        </div>

        <div className=" w-1/2 m-3 rounded-2xl bg-card_bg shadow-card_shadow">
          <h1 className="font-medium text-3xl text-center mt-6 mb-4">
            Your Subjects :
          </h1>
          <div>
            <ul className="flex contain-content flex-wrap gap-1 p-2.5 ">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="m-2 p-3 rounded-xl bg-card_bg shadow-card_shadow">
        <h1 className="p-3 text-center text-2xl font-bold"> Time Table :</h1>
        <div className="flex gap-1.5 justify-evenly">
          <div className="Time_table">
            <div>
              <h1>Monday:</h1>
            <ul className="flex contain-content flex-wrap gap-1 p-2.5 ">
              {/* {users.days.map((day) => (
                <li
                  key={day}
                  className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  if (day=="Monday") {
                    {day}
                  }
                </li>
              ))} */}
            </ul>
          </div>
          </div>
          <div className="Time_table">Tuesday</div>
          <div className="Time_table">wednesday</div>
          <div className="Time_table">thrusday</div>
          <div className="Time_table">friday</div>
          <div className="Time_table">saturday</div>
          <div className="Time_table">sunday</div>
        </div>
      </div>
    </div>

  );
};

export default Upload;
