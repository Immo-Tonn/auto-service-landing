import { Counter } from "./Counter";
import Link from "next/link";

const About = () => {
  return (
<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href="/">Go to Home</Link>
      <div className="flex flex-col flex-1 items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      {/* <div style={{ margin: "20vw auto" }}> */}
        <h1>PAGE "About"</h1>
        <Counter />
      </div>
    </div>
  );
};

export default About;
