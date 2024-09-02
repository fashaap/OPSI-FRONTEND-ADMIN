import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeadingComponent from "../../../components/text/HeadingComponent";
import AxiosInstance from "../../auth/AxiosInstance";
import { MultiSelect } from "react-multi-select-component";
import Spinner from "../../../components/Spinner";
import Swal from "sweetalert2";

const CreateTicketDetail = () => {
  const { nisn } = useParams();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");

  const [dataUser, setDataUser] = useState(null);
  const [dataTicket, setDataTicket] = useState([]);
  const [selectedOption, setSelectedOption] = useState(7010);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [keterangan, setKeterangan] = useState("");
  const [isHonest, setIsHonest] = useState(true);
  const [multipleItem, setMultipleItem] = useState([]);
  const [loading, setLoading] = useState(false);

  const options = [
    { value: "math", label: "Matematika" },
    { value: "science", label: "Ilmu Pengetahuan Alam" },
    { value: "history", label: "Sejarah" },
    { value: "english", label: "Bahasa Inggris" },
    { value: "indonesian", label: "Bahasa Indonesia" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#014B7C",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#014B7C",
      },
    }),
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(
        `/api/v1/auth/users?nisn=${nisn}`
      );
      if (response.status === 200) {
        setDataUser(response.data.data[0]);
      } else {
        setDataUser(null);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setDataUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    if (!dataUser || !dataUser.id) return;

    setLoading(true);
    try {
      const response = await AxiosInstance.get(
        `/api/v1/tickets?idUser=${dataUser.id}`
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [nisn]);

  useEffect(() => {
    if (dataUser?.id) {
      fetchTickets();
    }
  }, [dataUser]);

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

  const handleOptionChange = (event) => {
    setSelectedOption(Number(event.target.value));
  };

  const handleHourChange = (e) => {
    const value = Number(e.target.value);
    if (value < 1 || value > 10) {
      Swal.fire({
        icon: "warning",
        title: "Jumlah jam harus antara 0 dan 10",
        confirmButtonText: "OK",
      });
      return;
    }
    setSelectedHour(value);
  };
  const handleMinuteChange = (e) => {
    const value = Number(e.target.value);
    if (value < 1 || value > 60) {
      Swal.fire({
        icon: "warning",
        title: "Jumlah menit harus antara 0 dan 60",
        confirmButtonText: "OK",
      });
      return;
    }
    setSelectedMinute(value);
  };
  const handleKeteranganChange = (event) => {
    setKeterangan(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setIsHonest(event.target.checked);
  };

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
  let hourCustom = hour + parseInt(selectedHour); // add 6 hours to current time
  let minuteCustom = minute + parseInt(selectedMinute); // keep minutes as is

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

  let formatTime = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}T${String(hourCustom).padStart(2, "0")}:${String(
    minuteCustom
  ).padStart(2, "0")}:${String(second).padStart(2, "0")}Z`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const subjects = multipleItem.map((item) => item.label);

    const formData = {
      idUser: dataUser.id,
      username: dataUser.username,
      nisn: dataUser.nisn,
      classGrade: dataUser.classGrade,
      email: dataUser.email,
      TimeCountdown:
        selectedOption === 7030 ? "2020-02-02T00:00:00Z" : formatTime,
      startTime: "00:00:00",
      endTime: "00:00:00",
      category: selectedOption,
      subjects,
      description: keterangan,
      codeStatus: 1111,
      date: new Date().toLocaleDateString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      image: null,
      expired: false,
    };

    try {
      const response = await AxiosInstance.post(
        `/api/v1/tickets/create`,
        formData,
        {
          headers: { token: userToken },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Ticket created successfully",
        });
        navigate("/create-tickets");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create ticket",
      });
      console.error("Error submitting form:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      alert("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeadingComponent title="Membuat Tiket" />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          {dataUser ? (
            <div className="flex justify-center min-h-screen">
              <div className="w-full h-full">
                <div className="w-full h-full border border-gray-300 bg-white mt-5 rounded-md p-5">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 font-mono w-full h-[50%] max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between p-4 rounded-lg shadow-xl">
                      <div className="flex justify-between items-start">
                        <div className="mb-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-12">
                              <img src={dataUser.img} alt={dataUser.username} />
                            </div>
                          </div>
                        </div>
                        <div className="text-white font-semibold text-lg w-full ps-4">
                          <div>{dataUser.username}</div>
                          <div>{dataUser.nisn}</div>
                        </div>

                        <div className="backdrop-blur-sm bg-white/30 rounded-full w-auto px-3 py-1 text-white font-light text-sm">
                          {dataUser.code}
                        </div>
                      </div>
                      <div className="flex gap-3 items-center justify-center text-white text-opacity-50 py-5">
                        <div className="p-1">Dispen: {dispenCount}</div>
                        <div className="p-1">Izin: {izinCount}</div>
                        <div className="p-1">Pulang: {pulangCount}</div>
                      </div>
                    </div>

                    <div className="px-4">
                      <form onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full flex flex-col gap-2">
                            <label className="text-lg font-medium">
                              Kategori Tiket
                            </label>
                            <select
                              value={selectedOption}
                              onChange={handleOptionChange}
                              className="p-2 border border-gray-300 rounded-md"
                            >
                              <option value={7010}>Dispen</option>
                              <option value={7020}>Izin</option>
                              <option value={7030}>Pulang</option>
                            </select>
                          </div>

                          {selectedOption === 7030 ? null : (
                            <div className="w-full flex flex-col gap-2">
                              <div className="w-full flex flex-col gap-2">
                                <label className="text-lg font-medium">
                                  Jumlah Jam
                                </label>
                                <input
                                  type="number"
                                  value={selectedHour}
                                  onChange={handleHourChange}
                                  className="p-2 border border-gray-300 rounded-md"
                                  min="0"
                                  max="10"
                                />
                              </div>

                              <div className="w-full flex flex-col gap-2">
                                <label className="text-lg font-medium">
                                  Jumlah Menit
                                </label>
                                <input
                                  type="number"
                                  value={selectedMinute}
                                  onChange={handleMinuteChange}
                                  className="p-2 border border-gray-300 rounded-md"
                                  min="0"
                                  max="60"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="my-4">
                          <label className="text-lg font-medium">
                            Mata Pelajaran
                          </label>
                          <MultiSelect
                            options={options}
                            value={multipleItem}
                            onChange={setMultipleItem}
                            labelledBy="Select"
                            className="border border-gray-300 rounded-md"
                            styles={customStyles}
                          />
                        </div>

                        <div className="my-4">
                          <label className="text-lg font-medium">
                            Keterangan
                          </label>
                          <textarea
                            value={keterangan}
                            onChange={handleKeteranganChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="my-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isHonest}
                              onChange={handleCheckboxChange}
                              className="mr-2"
                            />
                            Saya bersedia memberikan informasi yang benar
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                          Kirim
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mt-5">
              <p>Data pengguna tidak ditemukan.</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CreateTicketDetail;
