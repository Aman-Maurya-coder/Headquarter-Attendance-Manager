import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const delay = (d) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const onSubmitt = async (data) => {
    console.log(data);
    try {
      const res = await fetch("http://localhost:8000/", {
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

  return (
    <>
      <div className="p-3 max-w-lg mx-auto mt-6">
        <h1 className="text-3xl text-center font-semibold  my-7 ">Sign Up</h1>

        <form
          action=" "
          onSubmit={handleSubmit(onSubmitt)}
          className="flex flex-col gap-4 justify-center"
        >
          <input
            type="text"
            placeholder="First Name"
            className="bg-slate-100 p-3 rounded-lg"
            {...register("first_name", {
              required: { value: true, message: "This field is equired " },
            })}
          />
          {errors.first_name && (
            <div
              style={{
                marginTop: "-15px",
                marginBottom: "-10px",
                fontSize: "10px",
              }}
              className="text-red-500 p-0 my-0"
            >
              {" "}
              {errors.first_name.message}{" "}
            </div>
          )}

          <input
            type="text"
            placeholder="Last Name"
            className="bg-slate-100 p-3 rounded-lg"
            {...register("last_name", { required: true })}
          />
          {errors.last_name && (
            <div
              style={{
                marginTop: "-15px",
                marginBottom: "-10px",
                fontSize: "10px",
              }}
              className="text-red-500 p-0 my-0"
            >
              {errors.first_name.message}{" "}
            </div>
          )}

          <input
            type="text"
            placeholder="Email"
            className="bg-slate-100 p-3 rounded-lg"
            {...register("email", {
              required: { value: true, message: "This field is required" },
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <div
              style={{
                marginTop: "-15px",
                marginBottom: "-10px",
                fontSize: "10px",
              }}
              className="text-red-500 p-0 my-0"
            >
              {errors.email.message}{" "}
            </div>
          )}

          <input
            type="password"
            placeholder="Enter Password"
            className="bg-slate-100 p-3 rounded-lg"
            {...register("e_pw", {
              required: { value: true, message: "This field is required" },
              minLength: {
                value: 8,
                message: "Atleast 8 characters are required",
              },
            })}
          />
          {errors.e_pw && (
            <div
              style={{
                marginTop: "-15px",
                marginBottom: "-10px",
                fontSize: "10px",
              }}
              className="text-red-500 p-0 my-0"
            >
              {errors.e_pw.message}{" "}
            </div>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="bg-slate-100 p-3 rounded-lg"
            {...register("c_pw", {
              required: { value: true, message: "This field is required" },
              minLength: {
                value: 8,
                message: "Atleast 8 characters are required",
              },
            })}
          />
          {errors.c_pw && (
            <div
              style={{
                marginTop: "-15px",
                marginBottom: "-10px",
                fontSize: "10px",
              }}
              className="text-red-500 p-0 my-0"
            >
              {errors.c_pw.message}{" "}
            </div>
          )}

          <button
            className={`rounded-lg uppercase hover:opacity-85 p-3.5 text-white w-48 m-auto ${
              isSubmitting ? "bg-blue-500" : "bg-sky-700"
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="flex gap-2 mt-5 justify-center">
          <p>Already have a account ?</p>
          <Link to="/Signin" className="text-blue-400">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
