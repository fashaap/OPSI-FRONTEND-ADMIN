import CountUp from "react-countup";
import AxiosInstance from "../auth/AxiosInstance";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import Spinner from "../../components/Spinner";

const HomePage = () => {
  const userToken = localStorage.getItem("userToken");
  const [dataTicket, setDataTicket] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchUsers = async () => {
    const userInformationJWT = jwtDecode(userToken);
    try {
      const response = await AxiosInstance.get(
        `/api/v1/auth/admin/${userInformationJWT._id}`,
        {
          headers: { token: userToken },
        }
      );

      if (response.status === 200) {
        setDataUser(response.data.data);
      } else {
        console.error("Unexpected response status:", response.status);
        setDataUser([]);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setDataUser([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await AxiosInstance.get(`/api/v1/tickets?expired=true`);
      setDataTicket(response.data.data);
    } catch (error) {
      console.error("Error fetching tickets data:", error);
      setDataTicket([]);
    } finally {
      setLoading(false); // Set loading to false when the data fetching is complete
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const historyCount = (period) => {
    const now = moment();

    let filteredTickets;

    if (period === "week") {
      filteredTickets = dataTicket.filter((ticket) =>
        moment(ticket.createdAt).isSame(now, "week")
      );
    } else if (period === "semester") {
      filteredTickets = dataTicket.filter((ticket) =>
        moment(ticket.createdAt).isSame(now.subtract(6, "months"), "month")
      );
    }

    const dispenCount = filteredTickets.filter(
      (ticket) => ticket.category === 7010
    ).length;
    const izinCount = filteredTickets.filter(
      (ticket) => ticket.category === 7020
    ).length;
    const pulangCount = filteredTickets.filter(
      (ticket) => ticket.category === 7030
    ).length;
    const nullCount = filteredTickets.filter(
      (ticket) => ticket.category === 5050
    ).length;

    return { dispenCount, izinCount, pulangCount, nullCount };
  };

  const weeklyCounts = historyCount("week");
  const semesterCounts = historyCount("semester");

  const weeklyChartData = [
    { name: "Dispen", value: weeklyCounts.dispenCount, fill: "#014B7C" },
    { name: "Izin", value: weeklyCounts.izinCount, fill: "#FFA700" },
    { name: "Pulang", value: weeklyCounts.pulangCount, fill: "#16A34A" },
    { name: "Tidak Diketahui", value: weeklyCounts.nullCount, fill: "#DC2626" },
  ];

  const semesterChartData = [
    { name: "Dispen", value: semesterCounts.dispenCount, fill: "#014B7C" },
    { name: "Izin", value: semesterCounts.izinCount, fill: "#FFA700" },
    { name: "Pulang", value: semesterCounts.pulangCount, fill: "#16A34A" },
    {
      name: "Tidak Diketahui",
      value: semesterCounts.nullCount,
      fill: "#DC2626",
    },
  ];

  return (
    <div className="flex flex-col">
      {loading ? ( // Show spinner while loading
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="w-full mb-5">
            <h1 className="text-xl font-semibold">Selamat datang</h1>
            <h2 className="text-2xl font-bold">{dataUser.displayName}</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-white font-semibold">
            <div
              className={`bg-[#014B7C] flex-grow rounded-xl py-5 px-4 md:w-40`}
            >
              <h1 className="text-2xl">Total Dispen</h1>
              <p className="text-2xl">
                <CountUp end={weeklyCounts.dispenCount} duration={5} />
              </p>
            </div>
            <div
              className={`bg-[#FFA700] flex-grow rounded-xl py-5 px-4 md:w-40`}
            >
              <h1 className="text-2xl">Total Izin</h1>
              <p className="text-2xl">
                <CountUp end={weeklyCounts.izinCount} duration={5} />
              </p>
            </div>
            <div
              className={`bg-[#16A34A] flex-grow rounded-xl py-5 px-4 md:w-40`}
            >
              <h1 className="text-2xl">Total Izin Pulang</h1>
              <p className="text-2xl">
                <CountUp end={weeklyCounts.pulangCount} duration={5} />
              </p>
            </div>
            <div
              className={`bg-[#DC2626] flex-grow rounded-xl py-5 px-4 md:w-40`}
            >
              <h1 className="text-2xl">Total Tidak Diketahui</h1>
              <p className="text-2xl">
                <CountUp end={weeklyCounts.nullCount} duration={5} />
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-lg mt-5">
            <h2 className="text-xl font-bold">Ticket Statistics - This Week</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={weeklyChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-lg mt-10">
            <h2 className="text-xl font-bold">
              Ticket Statistics - Semester 1
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={semesterChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
