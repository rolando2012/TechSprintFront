import React from 'react'

export const Form1 = () => {
  return (
    <form className=" px-6 py-4 pt-6 pb-8 sm:px-8 sm:py-6 md:flex md:items-center mb-6 ">
    <div className="mb-4 w-full">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
    Username
  </label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        id="username" type="text" placeholder="Username"/>
    </div>
    </form>
  )
}
