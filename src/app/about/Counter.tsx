"use client";
import { useEffect, useState } from "react";
import { CustomButton } from "./components/Button";

const Counter = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("Counter mounted");

    return () => {
      console.log("Counter unmounted");
    };
  }, []);
  return (
    <>
      <CustomButton onPress={() => setCount((prev) => prev + 1)} label="Click me +" color="success" />
      <CustomButton onPress={() => setCount((prev) => prev - 1)} label="Click me -" color="danger" />
      <CustomButton onPress={() => setCount((prev) => prev - prev )} label="Reset" color="warning" />
      <p>Clicks: {count}</p>
    </>
  );
};

export { Counter };
