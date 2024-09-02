import HeadingComponent from "../../components/text/HeadingComponent";
import MapComponent from "../../components/tracking/MapComponent";

import { useFormik } from "formik";

const MonitoringPage = () => {
  const handleMessageSubmit = () => {
    if(formik.values.idUser === "B3oFcYdRqVql78IX2RGU") {
      alert(formik.values.idUser);
    } else {
      alert("id pengguna tidak ditemukan");
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
        <div className="flex  flex-col w-full lg:w-[30%] lg:ml-4">
          <div className="bg-white h-auto w-full border rounded-xl px-4 py-3  flex flex-col gap-4">
            <h1 className="text-center">Berikan pesan kepada pelajar</h1>
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
                type="text"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default MonitoringPage;
