import { Link, useParams } from "react-router-dom";
import MapComponent from "../../../components/tracking/MapComponent";
import AxiosInstance from "../../auth/AxiosInstance";
import { useEffect, useState } from "react";
import HeadingComponent from "../../../components/text/HeadingComponent";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosSpeedometer } from "react-icons/io";
import { useFormik } from "formik";
import Badge from "../../../components/badge/Badge";
import { saveAs } from "file-saver";
import CountdownTimer from "../../../features/CountdownTimer";

const MonitoringTicketDetail = () => {
  const userToken = localStorage.getItem("userToken");
  const { idUser } = useParams();
  const [dataLocation, setDataLocation] = useState({});
  const [dataTicket, setDataTicket] = useState([]);
  const [dataUser, setDataUser] = useState([]);

  const fetchLocation = async () => {
    try {
      const url = `/api/v1/location/${idUser}`;
      const response = await AxiosInstance.get(url);

      if (response.status === 200) {
        setDataLocation(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const fetchTicket = async () => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/tickets?idUser=${idUser}`
      );
      if (response.status === 200) {
        // Added status check
        // console.log(response.data.data[0]);
        setDataTicket(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching Ticket data:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/auth/users?id=${idUser}`
      );

      if (response.status === 200) {
        // Added status check
        // console.log(response.data.data[0]);
        setDataUser(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching User data:", error);
    }
  };

  const handleMessageSubmit = async (values) => {
    const data = {
      idUser: idUser,
      title: "Monitoring",
      message: values.message,
      date: new Date().toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    try {
      const response = await AxiosInstance.post(
        "/api/v1/notifications/create",
        data,
        {
          headers: { token: userToken },
        }
      );

      if (response.status === 200) {
        alert("Berhasil");
      }
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      alert("Gagal");
    }
  };

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: handleMessageSubmit,
  });

  const ButtonModalImage = () => {
    return (
      <>
        <button
          className="py-2 px-5 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-75"
          onClick={() =>
            document.getElementById("modal_view_image").showModal()
          }
        >
          Lihat Gambar
        </button>
        <dialog id="modal_view_image" className="modal ">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Bukti kuat : {dataTicket.displayName}
            </h3>
            <div className="mt-5">
              <div>
                <img
                  src={dataTicket.image}
                  className="w-[50vw] h-auto border rounded-xl"
                  alt="bukti kuat"
                />
              </div>
            </div>
            <div className="modal-action flex justify-between ">
              <button
                onClick={() =>
                  saveAs(
                    dataTicket.image,
                    `Bukti kuat ${dataTicket.displayName}.jpg`
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
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchLocation(), await fetchTicket(), fetchUser();
    }, 1000);

    return () => clearInterval(interval);
  }, [idUser]);

  // console.log(dataTicket);

  return (
    <>
      <HeadingComponent title="GPS" font="bold" />
      <div className="bg-white border rounded-xl p-4 mt-4">
        <div className="flex flex-col gap-4 xl:flex-row lg:gap-6">
          <div className="bg-gray-100 p-4 rounded-md flex items-center w-full lg:w-full">
            <FaMapMarkerAlt className="text-blue-500 mr-4 text-xl" />
            <div>
              <h1 className="text-lg font-semibold">Latitude</h1>
              <p className="text-gray-700">{dataLocation.latitude}</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-md flex items-center w-full lg:w-full">
            <FaMapMarkerAlt className="text-blue-500 mr-4 text-xl" />
            <div>
              <h1 className="text-lg font-semibold">Longitude</h1>
              <p className="text-gray-700">{dataLocation.longitude}</p>
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-md flex items-center w-full lg:w-full">
            <IoIosSpeedometer className="text-green-500 mr-4 text-xl" />
            <div>
              <h1 className="text-lg font-semibold">Speed</h1>
              <p className="text-gray-700">{dataLocation.speed} km/h</p>
            </div>
          </div>
          <div className="bg-red-100 p-4 rounded-md flex items-center w-full lg:w-full">
            <FaMapMarkerAlt className="text-red-500 mr-4 text-xl" />
            <div>
              <h1 className="text-lg font-semibold">Accuracy</h1>
              <p className="text-gray-700">{dataLocation.accuracy} meters</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-md flex items-center w-full lg:w-full">
            <FaClock className="text-gray-500 mr-4 text-xl" />
            <div>
              <h1 className="text-lg font-semibold">Date</h1>
              <p className="text-gray-700">
                {new Date(dataLocation.timestamp).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4 mt-4">
        <CountdownTimer countdown={`${dataTicket.TimeCountdown}`} />
      </div>

      <div className="flex flex-col lg:flex-row mt-6 gap-4">
        <div className={`bg-white border rounded-xl p-4 w-full lg:${dataTicket.expired ? null : "w-2/3"} shadow-md`}>
          <MapComponent
            prms={true}
            idUser={idUser}
            lat={dataLocation.latitude}
            lng={dataLocation.longitude}
          />
        </div>
        {dataTicket.expired === false ? (
          <div className="bg-white border rounded-xl p-4 w-full lg:w-1/3 shadow-md">
            <h1 className="text-center text-xl font-semibold mb-4">
              Kirim Pesan
            </h1>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4"
            >
              <textarea
                className="textarea border-[#014B7C] textarea-secondary max-h-[200px]"
                placeholder="Tulis pesan"
                name="message"
                id="message"
                value={formik.values.message}
                onChange={formik.handleChange}
              />

              <button
                type="submit"
                className="btn bg-[#014B7C] btn-primary w-full"
              >
                <span className="text-white">Kirim</span>
              </button>
            </form>
            <Link
              to={`/profile/user/${dataUser.nisn}`}
              className="btn bg-[#014B7C] btn-primary w-full mt-4"
            >
              <span className="text-white">Lihat profil pelajar</span>
            </Link>
          </div>
        ) : null}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full mt-8 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">ID User</h1>
            <span className="text-blue-500 text-sm font-semibold">
              {dataUser.id}
            </span>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">ID Ticket</h1>
            <span className="text-blue-500 text-sm font-semibold">
              {dataTicket._id}
            </span>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">NISN</h1>
            <span className="text-blue-500 text-sm font-semibold">
              {dataUser.nisn}
            </span>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">Nama</h1>
            <span className="text-blue-500 text-sm font-semibold">
              {dataUser.displayName}
            </span>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">Kelas</h1>
            <span className="text-blue-500 text-sm font-semibold">
              {dataUser.classGrade}
            </span>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">Kode Status</h1>
            <span className="text-blue-500 text-sm font-semibold">
              {dataTicket.codeStatus}
            </span>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">Tanggal</h1>
            <span className="text-blue-500 text-sm font-semibold">
              {dataTicket.date}
            </span>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">Jenis</h1>
            <Badge data={dataTicket.category} />
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h1 className="text-lg font-medium text-gray-900">Durasi</h1>
            <span className="text-blue-500 text-sm font-semibold">
              {dataTicket.TimeCountdown}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-lg font-medium text-gray-900">Alasan</h1>
          <div className="border border-gray-200 rounded-xl mt-2">
            <p className="text-gray-700 text-sm  p-5 rounded-xl  leading-relaxed">
              {dataTicket.description}
            </p>
          </div>
        </div>

        <div className="mt-5 relative w-full h-[300px] group">
          <img
            src={dataTicket.image}
            className="w-full h-full object-cover rounded-xl object-center brightness-50 "
            alt={dataTicket.displayName}
          />
          <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]  ">
            <ButtonModalImage />
          </div>
        </div>
      </div>
    </>
  );
};

export default MonitoringTicketDetail;
