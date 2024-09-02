import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Link, useParams } from "react-router-dom";
import AxiosInstance from "../../auth/AxiosInstance";
import Badge from "../../../components/badge/Badge";
import Spinner from "../../../components/Spinner";

const UserProfilePage = () => {
  const { id } = useParams();
  const [dataUser, setDataUser] = useState([]);
  const [dataTicket, setDataTicket] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  const fetchUsers = async () => {
    setIsLoadingUser(true);
    try {
      const response = await AxiosInstance.get(`/api/v1/auth/users?nisn=${id}`);

      if (response.status === 200) {
        setDataUser(response.data.data[0]);
      } else {
        console.error("Unexpected response status:", response.status);
        setDataUser([]);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setDataUser([]);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchTickets = async () => {
    if (!dataUser.id) return;

    setIsLoadingTickets(true);
    try {
      const response = await AxiosInstance.get(
        `/api/v1/tickets?idUser=${dataUser.id}&expired=true`
      );

      if (response.status === 200 && Array.isArray(response.data.data)) {
        setDataTicket(response.data.data);
      } else {
        console.error(
          "Unexpected response status or data format:",
          response.status
        );
        setDataTicket([]);
      }
    } catch (error) {
      console.error("Error fetching tickets data:", error);
      setDataTicket([]);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [id]);

  useEffect(() => {
    if (!isLoadingUser && dataUser.id) {
      fetchTickets();
    }
  }, [dataUser, isLoadingUser]);

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(10);

  const handlePrevious = () => {
    if (left - 10 >= 0) {
      setLeft(left - 10);
      setRight(right - 10);
    }
  };

  const handleNext = () => {
    if (right + 10 <= dataTicket.length) {
      setLeft(left + 10);
      setRight(right + 10);
    }
  };

  const historyCount = () => {
    const dispenCount = dataTicket.filter(
      (ticket) => ticket.category === 7010
    ).length;
    const izinCount = dataTicket.filter(
      (ticket) => ticket.category === 7020
    ).length;
    const pulangCount = dataTicket.filter(
      (ticket) => ticket.category === 7030
    ).length;

    return { dispenCount, izinCount, pulangCount };
  };

  const { dispenCount, izinCount, pulangCount } = historyCount();

  return (
    <div className="w-full min-h-screen bg-white p-5 border rounded-md">
      {isLoadingUser ? (
        <Spinner />
      ) : isLoadingTickets ? (
        <Spinner />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">EXPORT TIKET</h1>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col items-center">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-32">
                  <span className="text-3xl">D</span>
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-4">
                {dataUser.displayName}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Nama</h2>
                  <p>{dataUser.username}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Id</h2>
                  <p>{dataUser.id}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Role</h2>
                  <p>{dataUser.role}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Kelas</h2>
                  <p>{dataUser.classGrade}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Code</h2>
                  <p>{dataUser.code}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Email</h2>
                  <p>{dataUser.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-3xl font-bold mb-4">Statistics</h2>
            <div className="w-full h-full mt-5 ">
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 text-white font-semibold">
                <div className="text-2xl w-full h-auto rounded-md bg-[#014b7c] py-5 px-4">
                  <h1 className="text-2xl">Dispen</h1>
                  <p className="text-2xl">
                    <CountUp end={dispenCount} duration={5} />
                  </p>
                </div>
                <div className="text-2xl w-full h-auto rounded-md bg-[#ffc107] py-5 px-4">
                  <h1 className="text-2xl">Izin</h1>
                  <p className="text-2xl">
                    <CountUp end={izinCount} duration={5} />
                  </p>
                </div>
                <div className="text-2xl w-full h-auto rounded-md bg-[#16a34a] py-5 px-4">
                  <h1 className="text-2xl">Pulang</h1>
                  <p className="text-2xl">
                    <CountUp end={pulangCount} duration={5} />
                  </p>
                </div>
                <div className="text-2xl w-full h-auto rounded-md bg-[#dc2626] py-5 px-4 col-span-3 xl:col-span-1">
                  <h1 className="text-2xl">Tidak Pulang</h1>
                  <p className="text-2xl">
                    <CountUp end={0} duration={5} />
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <div className="overflow-x-auto">
                  <table className="table table-xs ">
                    <thead>
                      <tr className="bg-[#014b7c] text-white">
                        <th className="px-4 py-2 text-center text-lg ">No</th>
                        <th className="px-4 py-2 text-lg">Id tiket</th>
                        <th className="px-4 py-2 text-lg">Tanggal</th>
                        <th className="px-4 py-2 text-lg">Jenis</th>
                        <th className="px-4 py-2 text-center text-lg  ">
                          Lebih Detail
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataTicket.slice(left, right).map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <th className="border text-center">{idx + 1}</th>
                            <td className="border">{item._id}</td>
                            <td className="border">{item.date}</td>
                            <td className="border">
                              <Badge data={item.category} />
                            </td>
                            <td className="border text-center">
                              <Link
                                to={`/monitoring/user/ticket/${item._id}/${item.idUser}`}
                                className="link"
                              >
                                Detail
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="flex justify-between mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={handlePrevious}
                      disabled={left === 0}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={right >= dataTicket.length}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
