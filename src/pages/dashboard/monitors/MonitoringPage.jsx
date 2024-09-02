import HeadingComponent from "../../../components/text/HeadingComponent";
import MapComponent from "../../../components/tracking/MapComponent";
import { useFormik } from "formik";
import AxiosInstance from "../../auth/AxiosInstance";
import { useState } from "react";
import Spinner from "../../../components/Spinner";


const MonitoringPage = () => {
  const [loading, setLoading] = useState(false); // Add loading state
  const userToken = localStorage.getItem("userToken");

  const handleMessageSubmit = async () => {
    const data = {
      idUser: formik.values.idUser,
      title: "Monitoring",
      message: formik.values.message,
      date: new Date().toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setLoading(true); // Set loading to true when starting the request

    try {
      const userResponse = await AxiosInstance.get(
        `/api/v1/auth/users?id=${data.idUser}`
      );
      if (userResponse.status === 200 && userResponse.data) {
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
      } else {
        alert("Pengguna tidak ditemukan");
      }
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      alert("Gagal");
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  const formik = useFormik({
    initialValues: {
      idUser: "",
      message: "",
    },
    onSubmit: handleMessageSubmit,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  return (
    <>
      <HeadingComponent title="Pemantauan Pengguna" />
      <div className="flex flex-col lg:flex-row font-poppins mt-5">
        <div className="bg-white h-auto w-full lg:w-[70%] border rounded-xl px-4 py-3 mt-4 lg:mt-0 flex flex-col gap-5">
          <MapComponent />
        </div>
        <div className="flex flex-col w-full lg:w-[30%] lg:ml-4">
          <div className="bg-white h-auto w-full border rounded-xl px-4 py-3 flex flex-col gap-4">
            <h1 className="text-center">Berikan pesan kepada pelajar</h1>
            {loading ? ( // Conditionally render spinner or form
              <div className="flex justify-center items-center h-64">
                <Spinner /> {/* Display spinner while loading */}
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} className="grid gap-5">
                <input
                  type="text"
                  placeholder="Masukan id pengguna"
                  className="input input-bordered input-secondary border-[#014B7C] w-full"
                  name="idUser"
                  id="idUser"
                  onChange={handleForm}
                />
                <textarea
                  className="textarea border-[#014B7C] textarea-secondary max-h-[200px]"
                  placeholder="Tulis pesan"
                  name="message"
                  id="message"
                  onChange={handleForm}
                ></textarea>
                <button
                  type="submit"
                  className="btn bg-[#014B7C] btn-primary w-full justify-self-center"
                >
                  <span className="text-white">Kirim</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MonitoringPage;
