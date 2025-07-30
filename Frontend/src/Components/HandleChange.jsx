import { useState } from "react";
// const [value, setValue] = useState("");

const handlechange = (e,setValue) => {
  const val = e.target.value;
  setValue(val);
  }
  export default handlechange;