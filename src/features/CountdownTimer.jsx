import { useState, useEffect } from "react";

const CountdownTimer = ({ countdown }) => {
  const targetTime = new Date(countdown);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const timeDiff = targetTime - now;

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor(timeDiff / 1000) % 60;
    const minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return (
      <div className="flex space-x-4 justify-center items-center text-center font-mono text-lg">
        <div className="flex flex-col items-center">
          <span className="block text-lg font-bold text-red-700  bg-gray-200 border-2 border-gray-700 rounded-lg px-4 py-2">
            00
          </span>
          <span className="text-sm text-gray-600">Jam</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="block text-lg font-bold text-red-700 bg-gray-200 border-2 border-gray-700 rounded-lg px-4 py-2">
            00
          </span>
          <span className="text-sm text-gray-600">Menit</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="block text-lg font-bold text-red-700 bg-gray-200 border-2 border-gray-700 rounded-lg px-4 py-2">
            00
          </span>
          <span className="text-sm text-gray-600">Detik</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 justify-center items-center text-center font-mono text-lg">
      <div className="flex flex-col items-center">
        <span className="block text-lg font-bold bg-gray-200 border-2 border-gray-700 rounded-lg px-4 py-2">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-sm text-gray-600">Jam</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="block text-lg font-bold bg-gray-200 border-2 border-gray-700 rounded-lg px-4 py-2">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-sm text-gray-600">Menit</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="block text-lg font-bold bg-gray-200 border-2 border-gray-700 rounded-lg px-4 py-2">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-sm text-gray-600">Detik</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
