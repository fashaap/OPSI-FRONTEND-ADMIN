import { useEffect, useState } from "react";

const PickTimer = () => {
  // Get the current date in UTC
  const now = new Date();
  console.log("Current Date:", now.toUTCString());

  // Extract year, month, and day from the current date
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1; // getUTCMonth() returns 0-based index, so add 1
  const day = now.getUTCDate();

  // Extract current hour and minute in UTC
  let hour = now.getUTCHours(); // get current hour in UTC
  let minute = now.getUTCMinutes(); // get current minute in UTC

  // Custom addition to hour and minute
  let hourCustom = hour + 6; // add 6 hours to current time
  let minuteCustom = minute + 0; // keep minutes as is

  // Handle minute overflow
  if (minuteCustom >= 60) {
    hourCustom += Math.floor(minuteCustom / 60); // Add extra hour(s) if minutes exceed 60
    minuteCustom = minuteCustom % 60; // Get remaining minutes
  }

  // Handle hour overflow (rolling over midnight)
  if (hourCustom >= 24) {
    hourCustom = hourCustom % 24; // Keep the hour within 0-23 range
  }

  const second = 0; // Set seconds to 0 or as desired

  // Construct the date-time string in UTC
  let formatTime = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}T${String(hourCustom).padStart(2, "0")}:${String(
    minuteCustom
  ).padStart(2, "0")}:${String(second).padStart(2, "0")}Z`; // Append 'Z' for UTC

  console.log(`UTC Format: ${formatTime}`);

  // Create a Date object with the constructed UTC time
  const utcDate = new Date(formatTime);
  console.log(`UTC Date Object: ${utcDate.toUTCString()}`);

  // Mendapatkan waktu target dari string
  const targetTime = new Date("2024-09-01T10:14:00Z");

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
    return <div>Countdown selesai!</div>;
  }

  return (
    <div>
      Sisa waktu: {timeLeft.days} hari {timeLeft.hours} jam {timeLeft.minutes}{" "}
      menit {timeLeft.seconds} detik
    </div>
  );
};

export default PickTimer;
