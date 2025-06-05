import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signin = () => {
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

      const result = await res.json();
      if (result.success === false) {
        throw new Error("Something went wrong while signing in");
      }

      console.log(result);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-3 max-w-lg mx-auto mt-6">
        <h1 className="text-3xl text-center font-semibold  my-7 ">Sign In</h1>

        <form
          action=" "
          onSubmit={handleSubmit(onSubmitt)}
          className="flex flex-col gap-4 justify-center"
        >
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

          <button
            className={`rounded-lg uppercase hover:opacity-85 p-3.5 text-white w-48 m-auto ${
              isSubmitting ? "bg-blue-500" : "bg-sky-700"
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex gap-2 mt-5 justify-center">
          <p>Do not have a account ?</p>
          <Link to="/Signup" className="text-blue-400">
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signin;
