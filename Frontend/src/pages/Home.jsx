import React from 'react'
import gradient from '../assets/gradient.png'
import Spline from '@splinetool/react-spline'
import { useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react'

const Home = () => {
  const navigate = useNavigate();
  return (
    
    <main>
            <HomeNavbar />

      <img src={gradient} alt="" className='absolute top-0 right-0 -z-1 opacity-60 w-fit' />
      <div className="h-0 w-[40rem] absolute top-[30%]  right-[-5%] shadow-[0_0_900px_20px_#e99b63] -z-10 -rotate-[30-deg] "></div>

      <div className='max-w-[40%] ml-[5%] z-10 mt-[90%] md:mt-[60%] lg:mt-[10%]'>

        <h1 className='text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-200'>
                        Manage Your Attendance, Smarter.
                    </h1>
        <button onClick={()=>{navigate("/signup")}} className='bg-amber-50 text-black p-3 rounded-2xl w-[10rem] ml-[25%] cursor-pointer '>Get Started </button>
        {/* <SignUp className='bg-amber-50 text-black p-3 rounded-2xl w-[10rem] ml-[25%] cursor-pointer '>Get Started </SignUp> */}
      </div>
      <Spline className='absolute lg:top-[-8%] top-[-25%] bottom-0 lg:left-[30%] sm:left-[-2%] h-full z-10  ' scene="https://prod.spline.design/UZCnJDawLv5JdULP/scene.splinecode" />
    </main>
  )
}
export default Home
