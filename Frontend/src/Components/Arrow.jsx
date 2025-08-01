import React, { useState } from "react";

const QuantityInput = ({ Id, register, errors }) => {

  const [quantity, setQuantity] = useState("");
  const { onChange, ...restRegister } = register(Id, {    // destructuring to get onChange and other properties
    // required: true,
  });

  const updateQuantity = (val) => {
    setQuantity(val);
    onChange({ target: { name: Id, value: val } });
  };

  const handleIncrement = () => {
    if (quantity.length <= 5) {
      const newVal = String(Number(quantity || 0) + 1);
      updateQuantity(newVal);
    }
  };

  const handleDecrement = () => {
    if (Number(quantity) > 0) {
      const newVal = String(Number(quantity) - 1);
      updateQuantity(newVal);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if ((/^\d{0,5}$/).test(val)) {
      updateQuantity(val);
    }
  };

  return (
    <div className="max-w-xs mx-auto">
      <div className="relative flex items-center max-w-[8rem]">
        <button
          type="button"
          onClick={handleDecrement}
          className="bg-gray-100 dark:bg-color_button dark:hover:bg-gray-600  hover:bg-gray-200 border  rounded-s-lg p-3 h-10 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-3 h-3 text-gray-400 "
            onHover={(e) => e.currentTarget.style.color = 'white'}
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        </button>

        <input
          type="text"
          value={quantity}
          onChange={handleChange}
          placeholder="0"
          className="bg-gray-50 border-x-0 border-gray-300 h-10 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-color_button dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...restRegister}
        />

        <button
          type="button"
          onClick={handleIncrement}
          className="bg-gray-100 dark:bg-color_button dark:hover:bg-gray-600  hover:bg-gray-200 border rounded-e-lg p-3 h-10 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-3 h-3 text-gray-400 "
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>

      {errors[Id] && (
        <p className="text-red-500 text-sm mt-1">This field is required</p>
      )}
    </div>
  );
};

export default QuantityInput;
