import { Link } from "react-router-dom";
import HeadingComponent from "../../../components/text/HeadingComponent";
import { GoPlusCircle } from "react-icons/go";
import AxiosInstance from "../../auth/AxiosInstance";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Spinner from "../../../components/Spinner"; // Import your Spinner component

const ComplaintSettingPage = () => {
  const userToken = localStorage.getItem("userToken");
  const [reports, setReports] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false); // Add loading state

  const token = jwtDecode(userToken);

  const fetchReports = async () => {
    setLoading(true); // Set loading to true when starting the request
    try {
      const response = await AxiosInstance.get(`/api/v1/report/${token._id}`, {
        headers: { token: userToken },
      });
      if (response.status === 200) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  const handleAddReport = async (event) => {
    event.preventDefault();
    const { title, description } = formData;

    try {
      await AxiosInstance.post(
        `/api/v1/report/create`,
        {
          idUser: token._id,
          title,
          description,
        },
        {
          headers: { token: userToken },
        }
      );
      setModalOpen(false);
      fetchReports(); // Refresh the reports list after adding a new report
    } catch (error) {
      console.error("Error adding report:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchReports(); // Fetch reports when component mounts

    // Optional: If you want to refetch reports when a new report is added
    // useEffect(() => {
    //   fetchReports();
    // }, [/* Dependencies to trigger refetch */]);
  }, [token._id]); // Add token._id as a dependency if it changes

  return (
    <>
      <HeadingComponent title={"Pengaduan SI MIKA"} />
      <div className="h-full bg-white p-7 border rounded-md mt-5 flex-col">
        <div className="flex justify-end">
          <button
            className="btn bg-[#014B7C] text-white rounded-lg btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <GoPlusCircle size={20} />
            <h1 className="font-semibold text-md">Pengaduan & Laporkan</h1>
          </button>
        </div>

        {isModalOpen && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Pengaduan & Laporkan</h3>
              <form
                className="form-control flex flex-col gap-3 w-full mt-5"
                onSubmit={handleAddReport}
              >
                <input
                  name="title"
                  type="text"
                  placeholder="Judul"
                  className="input input-bordered w-full max-w-xs border-[#014B7C]"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  className="textarea textarea-bordered max-h-[300px] w-full border-[#014B7C]"
                  placeholder="Pesan"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <div className="modal-action">
                  <button
                    type="submit"
                    className="btn bg-green-500 hover:bg-green-300 text-white"
                  >
                    Kirim
                  </button>
                  <button
                    type="button"
                    className="btn bg-red-500 hover:bg-red-300 text-white"
                    onClick={() => setModalOpen(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner />
          </div>
        ) : reports.length > 0 ? (
          reports.map((item) => (
            <div
              key={item._id}
              className="w-full h-auto bg-white p-4 border border-gray-300 rounded-md mt-5 flex flex-col sm:flex-row justify-between shadow-lg"
            >
              <div className="flex-1 mb-4 sm:mb-0">
                <div className="mb-2">
                  <h1 className="text-xl font-bold">Pengaduan</h1>
                  <p className="text-[#014B7C] text-md">ID : #{item._id}</p>
                </div>
                <p className="text-md font-medium text-gray-600">{item.date}</p>
              </div>
              <Link
                to={`/settings/complaint/${item._id}/${item.idUser}`}
                className="btn btn-sm bg-[#014B7C] text-white rounded-lg flex items-center justify-center h-10 sm:w-24 w-full sm:h-full sm:mt-0 mt-4"
              >
                <h1 className="font-semibold text-md">Lihat</h1>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-96">
            <h1 className="text-xl font-bold">Belum ada pengaduan</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default ComplaintSettingPage;
