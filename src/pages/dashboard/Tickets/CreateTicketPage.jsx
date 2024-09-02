import HeadingComponent from "../../../components/text/HeadingComponent";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import AxiosInstance from "../../auth/AxiosInstance";
import Spinner from "../../../components/Spinner";


const CreateTicketPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ticket, setTicket] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [dataTicket, setDataTicket] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchUsers = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await AxiosInstance.get(`/api/v1/auth/users`);
      if (response.status === 200) {
        setDataUser(response.data.data);
      } else {
        console.error("Unexpected response status:", response.status);
        setDataUser([]);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setDataUser([]);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, []);

  const fetchTickets = useCallback(async (userId) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await AxiosInstance.get(
        `/api/v1/tickets?idUser=${userId}`
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
      setLoading(false); // Set loading to false after fetching
    }
  }, []);

  const historyCount = useCallback(() => {
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
  }, [dataTicket]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (dataUser.length > 0 && ticket) {
      fetchTickets(ticket.id);
    }
  }, [ticket, dataUser, fetchTickets]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const checkNISN = (nisn) => {
    if (nisn.length !== 10) {
      toast.info("NISN is required.", {
        description: "Masukkan 10 digit angka",
        position: "top-center",
      });
      return;
    }

    const foundItem = dataUser.find((item) => item.nisn.toString() === nisn);

    if (foundItem) {
      toast.success("NISN found successfully!", {
        description: "Mohon lihat dengan teliti akun tersebut.",
        position: "top-center",
      });

      setTicket({
        id: foundItem.id,
        nisn: foundItem.nisn,
        username: foundItem.username,
        classGrade: foundItem.classGrade,
        code: foundItem.code,
        displayImage: foundItem.displayImage,
      });
    } else {
      toast.warning("NISN not found", {
        description: "Silahkan periksa dan coba lagi.",
        position: "top-center",
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkNISN(searchTerm);
  };

  const { dispenCount, izinCount, pulangCount } = historyCount();

  return (
    <>
      <HeadingComponent title="Membuat Tiket" />
      <div className="flex flex-col h-auto">
        <div className="border h-auto border-gray-300 bg-white mt-5 rounded-md p-5">
          {loading ? ( // Display spinner when loading is true
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <div>
              <h1 className="text-xl mb-5 ">
                Cari akun berdasarkan NISN terlebih dahulu
              </h1>
              <div className="flex flex-col lg:flex-row">
                <form onSubmit={handleSubmit} className="mb-4 lg:mb-0 flex-1">
                  <div className="mb-4">
                    <label
                      htmlFor="nisn"
                      className="block text-xl font-medium text-gray-700 mb-1"
                    >
                      NISN
                    </label>
                    <input
                      type="number"
                      placeholder="Masukan NISN 10 digit"
                      className="input input-bordered input-secondary border-[#014B7C] w-full"
                      name="nisn"
                      id="nisn"
                      onChange={handleInputChange}
                    />
                  </div>
                  <button className="btn bg-blue-500 text-white btn-primary w-full lg:w-auto">
                    Search
                  </button>
                </form>
              </div>
              <div>
                {ticket && ticket.nisn ? (
                  <div>
                    <div className=" flex flex-col items-center">
                      <div className="bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 font-mono mt-10  w-full h-[50%] max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between p-4 rounded-lg shadow-xl">
                        <div className="flex justify-between items-start">
                          <div className="mb-2">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-12">
                                <img
                                  src={ticket.displayImage}
                                  alt={ticket.username}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-semibold text-lg w-full ps-4">
                            <div>{ticket.username}</div>
                            <div>{ticket.nisn}</div>
                          </div>

                          <div className="backdrop-blur-sm bg-white/30   rounded-full w-auto px-3 py-1 text-white font-light text-sm">
                            YYT
                          </div>
                        </div>
                        <div className="flex gap-3 items-center justify-center text-white text-opacity-50 py-5">
                          <div className=" p-1">Dispen: {dispenCount} </div>
                          <div className=" p-1">Izin: {izinCount}</div>
                          <div className=" p-1">Pulang: {pulangCount}</div>
                        </div>

                        <div className="flex justify-between items-center text-white">
                          <div>
                            <div className="text-gray-600 text-xs">
                              Id pengguna
                            </div>
                            <div className="">{ticket.id}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 text-xs">Kelas</div>
                            <div className="">{ticket.classGrade}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 text-[#014B7C]">
                      <h1>Apakah ini akun anda?</h1>
                      <Link
                        to={`/create-tickets/c/${ticket.nisn}/${ticket.id}/${ticket.username}`}
                        className="btn mt-1 btn-primary text-white bg-[#014B7C]"
                      >
                        Ya, Buat tiket
                      </Link>
                      <button
                        onClick={() => window.location.reload()}
                        className="btn ms-2 btn-error  mt-1 text-white bg-[#7c0501]"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center my-5 ">
                    <p>No account information found. Please search again.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster closeButton richColors />
    </>
  );
};

export default CreateTicketPage;
