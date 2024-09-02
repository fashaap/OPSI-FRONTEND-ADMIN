import HeadingComponent from "../../components/text/HeadingComponent";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { createTicket } from "../../data/data";

const CreateTicketPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ticket, setTicket] = useState(null);

  const data = createTicket;

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  function checkNISN(nisn) {
    if (nisn.length === 10) {
      const foundItem = data.find((item) => item.nisn === nisn);

      if (foundItem) {
        toast.success("NISN found successfully!", {
          description: "Mohon lihat dengan teliti akun tersebut.",
          position: "top-center",
        });

        // console.log(nisn)
        setTicket({
          id: foundItem.id,
          nisn: foundItem.nisn,
          username: foundItem.username,
          kelas: foundItem.kelas,
          walikelas: foundItem.walikelas,
          img: foundItem.img,
        });
      } else {
        toast.warning("NISN not found", {
          description: "silahkan periksa dan coba lagi.",
          position: "top-center",
        });
      }
    } else {
      toast.info("NISN is required.", {
        description: "Masukan 10 digit angka",
        position: "top-center",
      });
    }
  }

  // console.log(data.nisn.length)
  const handleSubmit = (event) => {
    event.preventDefault();
    setTicket(null);

    checkNISN(searchTerm);
  };

  return (
    <>
      <HeadingComponent title="Membuat Tiket" />
      <div className="flex flex-col h-auto">
        <div className="border h-auto border-gray-300 bg-white mt-5 rounded-md p-5">
          <div className="">
            <h1 className="text-xl mb-5 ">
              Cari akun berdasarkan NISN terlebih dahulu
            </h1>
            <div className="flex flex-col lg:flex-row">
              <form onSubmit={handleSubmit} className="mb-4 lg:mb-0 flex-1">
                <div className="mb-4">
                  <label
                    htmlFor="nisn"
                    className="block text-xl font-medium text-gray-700"
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
                              <img src={ticket.img} alt={ticket.username} />
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
                        <div className=" p-1">Dispen: 12</div>
                        <div className=" p-1">Izin: 12</div>
                        <div className=" p-1">Bolos: 12</div>
                        <div className=" p-1">Pulang: 12</div>
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
                          <div className="">{ticket.kelas}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 text-[#014B7C]">
                    <h1>Apakah ini akun anda?</h1>
                    <Link
                      to={`/create-tickets/c/${ticket.nisn}/${ticket.id}/${ticket.username}`}
                      className="btn btn-primary mt-1 text-white bg-[#014B7C]"
                    >
                      Ya, Buat tiket
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center my-5 ">
                  <p>No account information found. Please search again.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster closeButton richColors />
    </>
  );
};

export default CreateTicketPage;
