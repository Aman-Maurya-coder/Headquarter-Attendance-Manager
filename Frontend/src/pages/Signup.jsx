import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";


const Signup = () => {
  const[formData,setFormData] = useState({});
  const [error, setError] = useState(null)

  const handleChange =(e) =>{
    setFormData({ ...formData,[e.target.id]: e.target.value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    try {
      const res = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Something went wrong while signing up");
      }

      const data = await res.json();
      console.log(data);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  console.log(formData)
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl text-center font-semibold  my-7 ">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center">
        <input
          type="text"
          placeholder="First Name"
          id="first_name"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Last Name"
          id="last_name"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Email"
          id="Email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Enter Password"
          id="e_pw"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          id="c_pw"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button className="bg-sky-700 rounded-lg uppercase hover:opacity-85 p-4 text-blue-50 w-48 m-auto" type="submit" >
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        <p>Already have a account ?</p>
        <Link to="/Signin" className="text-blue-400">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
