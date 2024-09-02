import { Link, useNavigate, useParams } from "react-router-dom";
import Badge from "../../../components/badge/Badge";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import AxiosInstance from "../../auth/AxiosInstance";

const Spinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

const VerifTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const [dataTicket, setDataTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`/api/v1/tickets/${id}`);
      if (response.status === 200) {
        setDataTicket(response.data.data);
      } else {
        setError("Unexpected response status.");
      }
    } catch (error) {
      setError("Error fetching ticket data.");
    } finally {
      setLoading(false);
    }
  };

  const allowedTicket = async () => {
    try {
      await AxiosInstance.put(
        `/api/v1/tickets/${id}`,
        { codeStatus: 2222 },
        { headers: { token: userToken } }
      );
      fetchTickets(); // Refresh the ticket data
    } catch (error) {
      setError("Error updating ticket status.");
    }
  };

  const deleteTicket = async () => {
    try {
      await AxiosInstance.delete(`/api/v1/tickets/${id}`, {
        headers: { token: userToken },
      });
      navigate("/verification-ticket"); // Navigate to the ticket list
    } catch (error) {
      setError("Error deleting ticket.");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [id]);

  const handleButtonTrue = async () => {
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
        await allowedTicket();
        Swal.fire({
          title: "Telah diizinkan!",
          text: "Pelajar diizinkan keluar",
          icon: "success",
        });
      }
    });
  };

  const handleButtonFalse = async () => {
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
        await deleteTicket();
        Swal.fire({
          title: "Tidak diizinkan!",
          text: "Pelajar tidak diizinkan keluar",
          icon: "success",
        });
      }
    });
  };

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  const ButtonModalImage = () => (
    <>
      <button
        className="py-2 px-5 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-75"
        onClick={() => document.getElementById("modal_view_image")?.showModal()}
      >
        Lihat Gambar
      </button>
      <dialog id="modal_view_image" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Bukti kuat : {dataTicket.username}
          </h3>
          <div className="mt-5">
            <img
              src={dataTicket.image || "https://via.placeholder.com/300"}
              className="w-[50vw] h-auto border rounded-xl"
              alt="bukti kuat"
            />
          </div>
          <div className="modal-action flex justify-between">
            <button
              onClick={() =>
                saveAs(
                  dataTicket.image,
                  `Bukti kuat ${dataTicket.username}.jpg`
                )
              }
              className="btn bg-orange-500 rounded-xl hover:bg-orange-300 text-white"
            >
              Download gambar
            </button>
            <form method="dialog">
              <button className="btn btn-outline rounded-xl">Kembali</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );

  return (
    <>
      {dataTicket?.codeStatus === 1111 ? (
        <div className="h-full w-full flex justify-center">
          <div className="bg-white shadow-md border rounded-xl py-10 px-20">
            <div className="flex flex-col justify-center gap-4">
              <div className="flex items-center gap-3 justify-between md:flex">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span>SY</span>
                  </div>
                </div>
                <div className="flex-1">
                  <Link
                    to={`/profile/user/${dataTicket.idUser}`}
                    className="font-bold text-2xl"
                  >
                    {dataTicket.username}
                  </Link>
                  <h5 className="font-semibold">
                    KELAS {dataTicket.classGrade} | NISN {dataTicket.nisn} | ID
                    USER {dataTicket.idUser}
                  </h5>
                </div>
                <div className="hidden md:block">
                  <Badge data={dataTicket.category} />
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4 mb w-auto">
                <header className="mb-2">
                  <h1 className="text-lg font-semibold">Id Tiket:</h1>
                </header>
                <p className="text-base leading-relaxed">{dataTicket._id}</p>
              </div>
              <div className="bg-white border rounded-xl p-4 mb w-auto">
                <header className="mb-2">
                  <h1 className="text-lg font-semibold">Alasan:</h1>
                </header>
                <p className="text-base leading-relaxed">
                  {dataTicket.description}
                </p>
              </div>
              <div className="bg-white border rounded-xl p-4 mb w-auto">
                <header className="mb-2">
                  <h1 className="text-lg font-semibold">Tanggal:</h1>
                </header>
                <p className="text-xl leading-relaxed">{dataTicket.date}</p>
              </div>
              <div className="bg-white border rounded-xl p-4 mb w-auto">
                <header className="mb-2">
                  <h1 className="text-lg font-semibold">
                    Waktu yang dibutuhkan:
                  </h1>
                </header>
                <p className="text-xl leading-relaxed">
                  {dataTicket.TimeCountdown}
                </p>
              </div>
              <div className="bg-white border rounded-xl p-4 mb w-auto">
                <header className="mb-2">
                  <h1 className="text-lg font-semibold">Mapel:</h1>
                </header>
                <div className="grid grid-flow-row-dense gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {Array.isArray(dataTicket.subjects) &&
                    dataTicket.subjects.length > 0 ? (
                      dataTicket.subjects.map((subject, index) => (
                        <span
                          className="badge bg-blue-500 text-white p-4 rounded-2xl font-semibold"
                          key={index}
                        >
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span>No subjects available</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4 mb w-auto">
                <div className="relative w-full h-[300px] group">
                  <img
                    src={dataTicket.image || "https://via.placeholder.com/300"}
                    className="w-full h-full object-cover rounded-xl object-top brightness-50"
                    alt={dataTicket.username}
                  />
                  <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                    <ButtonModalImage />
                  </div>
                </div>
              </div>
              <div>
                <span>
                  <p className="mt-5 mb-1">
                    Apakah anda yakin ingin mengizinkan tiket ini?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleButtonTrue}
                      className="btn hover:bg-green-600 bg-green-500 text-white"
                    >
                      Iya
                    </button>
                    <button
                      onClick={handleButtonFalse}
                      className="btn hover:bg-red-600 bg-red-500 text-white"
                    >
                      Tidak
                    </button>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-3xl font-bold my-10">
          Sudah diizinkan
        </div>
      )}
    </>
  );
};

export default VerifTicketDetail;
