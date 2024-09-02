import HeadingComponent from "../../../components/text/HeadingComponent";
import Badge from "../../../components/badge/Badge";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaFilter } from "react-icons/fa";
import { useEffect, useState } from "react";
import AxiosInstance from "../../auth/AxiosInstance";
import { IoMdRefreshCircle } from "react-icons/io";
import Spinner from "../../../components/Spinner";

const VerifTicketPage = () => {
  const userToken = localStorage.getItem("userToken");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [dataTicket, setDataTicket] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const filters = [7010, 7020, 7030];

  const handleFilterButtonClick = (selectedCategory) => {
    setSelectedFilters((prev) =>
      prev.includes(selectedCategory)
        ? prev.filter((el) => el !== selectedCategory)
        : [...prev, selectedCategory]
    );
  };

  const fetchTickets = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await AxiosInstance.get(
        `/api/v1/tickets?codeStatus=1111`
      );
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
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchTickets();

    const interval = setInterval(() => {
      fetchTickets();
    }, 30000);

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedFilters, dataTicket]);

  const allowedTicket = async (id) => {
    try {
      await AxiosInstance.put(
        `/api/v1/tickets/${id}`,
        { codeStatus: 2222 },
        { headers: { token: userToken } }
      );
      fetchTickets(); // Re-fetch tickets after update
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const deleteTicket = async (id) => {
    try {
      await AxiosInstance.delete(`/api/v1/tickets/${id}`, {
        headers: { token: userToken },
      });
      fetchTickets(); // Re-fetch tickets after deletion
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleButtonTrue = async (id) => {
    Swal.fire({
      title: "Apa kamu yakin?",
      text: "Anda akan mengizinkan keluar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Izinkan!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await allowedTicket(id);
        Swal.fire({
          title: "Telah diizinkan!",
          text: "Pelajar diizinkan keluar",
          icon: "success",
        });
      }
    });
  };

  const handleButtonFalse = async (id) => {
    Swal.fire({
      title: "Apa kamu yakin?",
      text: "Anda tidak akan mengizinkan keluar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Jangan izinkan!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteTicket(id);
        Swal.fire({
          title: "Tidak diizinkan!",
          text: "Pelajar tidak diizinkan keluar",
          icon: "success",
        });
      }
    });
  };

  const filterItems = () => {
    if (selectedFilters.length > 0) {
      const tempItems = dataTicket.filter((item) =>
        selectedFilters.includes(item.category)
      );
      setFilteredItems(tempItems);
    } else {
      setFilteredItems(dataTicket); // Use all tickets as default display
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
      {loading ? (
        <Spinner />
      ) : (
        <>
          <HeadingComponent title={"Verifikasi Tiket"} />
          <div className=" mt-5">
            <div className="my-5">
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-blue-200 rounded-md hover:bg-blue-300"
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
                  <h3 className="font-bold text-lg">Filter jenis izin</h3>
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
            </div>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-md border p-4"
                  >
                    <div className="flex items-center gap-3 justify-between md:flex">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                          <span>SY</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/profile/user/${item.nisn}`}
                          className="font-bold text-2xl"
                        >
                          {item.username}
                        </Link>
                        <h5 className="font-semibold">
                          KELAS {item.classGrade} | NISN {item.nisn} | ID USER{" "}
                          {item.idUser}
                        </h5>
                      </div>
                      <div className="hidden md:block">
                        <Badge data={item.category} />
                      </div>
                    </div>
                    <div className="bg-blue-50 my-8 p-4 text-center rounded">
                      <Link
                        to={`/verification-ticket/detail/${item._id}`}
                        className="hover:link link-primary text-blue-400"
                      >
                        Lihat tiket lebih detail
                      </Link>
                    </div>
                    <div>
                      <p className="mt-5 mb-1">
                        Apakah anda yakin ingin mengizinkan tiket ini?
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="w-1/2 btn btn-outline btn-success"
                          onClick={() => handleButtonTrue(item._id)}
                        >
                          Izinkan
                        </button>
                        <button
                          className="w-1/2 btn btn-outline btn-error"
                          onClick={() => handleButtonFalse(item._id)}
                        >
                          Jangan izinkan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-gray-500">
                  Tidak ada data tiket yang tersedia
                </h3>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default VerifTicketPage;
