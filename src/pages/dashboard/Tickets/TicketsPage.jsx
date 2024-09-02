import { Link } from "react-router-dom";
import HeadingComponent from "../../../components/text/HeadingComponent";
import { FaFilter } from "react-icons/fa";
import { useEffect, useState } from "react";
import CountdownTimer from "../../../features/CountdownTimer";
import Badge from "../../../components/badge/Badge";
import AxiosInstance from "../../auth/AxiosInstance";
import { IoMdRefreshCircle } from "react-icons/io";
import Spinner from "../../../components/Spinner"; // Import your Spinner component

const TicketsPage = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [dataTicket, setDataTicket] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const filters = [7010, 7020, 7030];

  const handleFilterButtonClick = (selectedCategory) => {
    if (selectedFilters.includes(selectedCategory)) {
      const filters = selectedFilters.filter((el) => el !== selectedCategory);
      setSelectedFilters(filters);
    } else {
      setSelectedFilters([...selectedFilters, selectedCategory]);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await AxiosInstance.get(`/api/v1/tickets?expired=false`);
      if (response.status === 200) {
        setDataTicket(response.data.data);
        setFilteredItems(response.data.data);
      } else {
        console.error(
          "Unexpected response status or data format:",
          response.status
        );
        setDataTicket([]);
        setFilteredItems([]);
      }
    } catch (error) {
      console.error("Error fetching tickets data:", error);
      setDataTicket([]);
      setFilteredItems([]);
    } finally {
      setLoading(false); // Set loading to false after fetching is done
    }
  };

  const handleButtonBolos = async (ticketId) => {
    try {
      const response = await AxiosInstance.put(`/api/v1/tickets/${ticketId}`, {
        codeStatus: 7777,
        expired: true,
      });

      if (response.status === 200) {
        fetchTickets();
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error(
        "Error updating ticket status:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleButtonSelesai = async (ticketId) => {
    try {
      const response = await AxiosInstance.put(`/api/v1/tickets/${ticketId}`, {
        codeStatus: 5555,
        expired: true,
      });

      if (response.status === 200) {
        fetchTickets();
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error(
        "Error updating ticket status:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchTickets();

    const fetchTicketsInterval = setInterval(() => {
      fetchTickets();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(fetchTicketsInterval);
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedFilters]);

  const filterItems = () => {
    if (selectedFilters.length > 0) {
      const tempItems = dataTicket.filter((item) =>
        selectedFilters.includes(item.category)
      );
      setFilteredItems(tempItems);
    } else {
      setFilteredItems(dataTicket);
    }
  };

  const DispenButton = () => (
    <button
      className={`btn m-2 rounded-md ${
        selectedFilters.includes(7010)
          ? "bg-blue-500 text-white"
          : "bg-blue-200 text-blue-700"
      }`}
      onClick={() => handleFilterButtonClick(7010)}
    >
      Dispen
    </button>
  );

  const IzinButton = () => (
    <button
      className={`btn m-2 rounded-md ${
        selectedFilters.includes(7020)
          ? "bg-blue-500 text-white"
          : "bg-blue-200 text-blue-700"
      }`}
      onClick={() => handleFilterButtonClick(7020)}
    >
      Izin
    </button>
  );

  const PulangButton = () => (
    <button
      className={`btn m-2 rounded-md ${
        selectedFilters.includes(7030)
          ? "bg-blue-500 text-white"
          : "bg-blue-200 text-blue-700"
      }`}
      onClick={() => handleFilterButtonClick(7030)}
    >
      Izin Pulang
    </button>
  );

  const getButtonType = (category) => {
    switch (category) {
      case 7010:
        return <DispenButton />;
      case 7020:
        return <IzinButton />;
      case 7030:
        return <PulangButton />;
      default:
        return null;
    }
  };

  return (
    <>
      <HeadingComponent title="Tiket Pengguna" />
      <div className="w-full h-full">
        <div className="overflow-x-auto border border-gray-300 bg-white mt-5 rounded-md">
          <div className="flex justify-between items-center gap-2 p-3">
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 px-3 py-2  bg-blue-200 rounded-md hover:bg-blue-300 "
                onClick={() =>
                  document.getElementById("modal_filter").showModal()
                }
              >
                <FaFilter className="w-5 h-5 text-blue-700" />
                <span className="hidden lg:inline-block text-blue-700">
                  Filter jenis izin
                </span>
              </button>

              <button
                className="flex items-center gap-2 px-3 py-2 bg-orange-200 rounded-md hover:bg-orange-300"
                onClick={() => window.location.reload()}
              >
                <IoMdRefreshCircle className="w-5 h-5 text-orange-700" />
                <span className="hidden lg:inline-block text-orange-700">
                  Refresh
                </span>
              </button>
            </div>
            <dialog id="modal_filter" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg ">Filter jenis izin</h3>
                <div className="flex flex-row">
                  {filters.map((category, index) => {
                    return (
                      <div key={category.toString() + index}>
                        {getButtonType(category)}
                      </div>
                    );
                  })}
                </div>

                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Simpan</button>
                  </form>
                </div>
              </div>
            </dialog>

            <div className="flex justify-end">
              <form action="">
                <label className="input input-bordered flex items-center w-auto">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Cari akun siswa"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
              </form>
            </div>
          </div>

          <div className="p-3">
            {loading ? ( // Conditionally render spinner or content
              <div className="flex justify-center items-center h-64">
                <Spinner /> {/* Display spinner while loading */}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="bg-[#014B7C] text-white text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                        Kelas
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                        Timer
                      </th>
                      <th className="px-5 py-3 text-xs text-center font-semibold uppercase tracking-wider">
                        Jenis
                      </th>
                      <th className="px-5 py-3 text-xs text-center font-semibold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-center">
                        Profil
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-center">
                        Monitoring
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-center">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-center">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                              <img src={item.displayImage} alt="" />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-bold ">{item.username}</td>
                        <td className="py-3 text-center">{item.classGrade}</td>
                        <td className="py-3 text-center">
                          {item.codeStatus <= 2222 ? (
                            <p>
                              Pelajar belum menyelesaikan proses pemindaian QR.
                            </p>
                          ) : (
                            <CountdownTimer countdown={item.TimeCountdown} />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <Badge data={item.category} />
                        </td>
                        <td className="py-3 text-center">{item.codeStatus}</td>
                        <td className="py-3 text-center">
                          <Link
                            to={`/profile/user/${item.nisn}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Profil
                          </Link>
                        </td>
                        <td className="py-3 text-center">
                          <Link
                            to={`/monitoring/user/ticket/${item._id}/${item.idUser}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Detail
                          </Link>
                        </td>
                        <td className="py-3 text-center">
                          <div className="dropdown dropdown-left dropdown-end">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="m-1 text-orange-700"
                            >
                              Edit
                            </button>
                            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                              <li>
                                <button
                                  onClick={() => handleButtonBolos(item._id)}
                                  className="text-red-600 bg-red-200 hover:bg-red-100 mb-2"
                                >
                                  Bolos
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleButtonSelesai(item._id)}
                                  className="text-green-600 bg-green-200 hover:bg-green-100"
                                >
                                  Selesai
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketsPage;
