import React from 'react'
import gradient from '../assets/gradient.png'
import Spline from '@splinetool/react-spline'
import { useNavigate } from 'react-router-dom';
const Home = () => {
      const navigate = useNavigate();
  return (

    <main>
      <img src={gradient} alt="" className='absolute top-0 right-0 -z-1 opacity-60 w-fit' />
      <div className="h-0 w-[40rem] absolute top-[30%]  right-[-5%] shadow-[0_0_900px_20px_#e99b63] -z-10 -rotate-[30-deg] "></div>

      <div className='max-w-[60%] ml-[5%] z-10 mt-[90%] md:mt-[60%] lg:mt-[10%]'>

        <h1 className='text-3xl md:text-5xl lg:text-[80px] font-semi-bold tracking-tight my-13 max-w-[30rem] lg:max-w-[78%] text-yellow-200'>
          Want to manage your Attendance Smartly ?
        </h1>
        <button onClick={()=>{navigate("/signup")}} className='bg-amber-50 text-black p-3 rounded-2xl w-[10rem] ml-[25%] cursor-pointer '>Get Started </button>
      </div>
        <Spline className='absolute lg:top-[-8%] top-[-25%] bottom-0 lg:left-[30%] sm:left-[-2%] h-full z-10  ' scene="https://prod.spline.design/UZCnJDawLv5JdULP/scene.splinecode" />
    </main>
  )
}

export default Home
