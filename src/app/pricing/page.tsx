import React from "react";

type Props = {};

const Pricing = (props: Props) => {
  return (
    <main className="container flex justify-center items-center h-[calc(100vh-15rem)]">
      <div className="flex flex-col justify-center items-center gap-5">
        <p className="mt-10 text-2xl">Pay me coffee 😊</p>
        <h1 className="text-4xl font-semibold">ABA : 500 573 754</h1>
      </div>
    </main>
  );
};

export default Pricing;
