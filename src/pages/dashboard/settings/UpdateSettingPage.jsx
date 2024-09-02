import { Link } from "react-router-dom";
import HeadingComponent from "../../../components/text/HeadingComponent";
import AxiosInstance from "../../auth/AxiosInstance";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner"; // Import your Spinner component

const UpdateSettingPage = () => {
  const userToken = localStorage.getItem("userToken");
  const [dataInformation, setDataInformation] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchInformationUpdate = async () => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/information/update?device=dekstop`,
        {
          headers: { token: userToken },
        }
      );

      if (response.status === 200) {
        setDataInformation(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching information updates:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchInformationUpdate();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> {/* Display spinner while loading */}
      </div>
    );
  }

  return (
    <>
      <HeadingComponent title={"UPDATE SI MIKA"} />
      <div className="w-full h-screen flex flex-col items-center bg-gray-100 pt-5 overflow-y-auto">
        {dataInformation.map((item, idx) => (
          <Link
            key={idx}
            to={`/settings/update/${item.version}`}
            className="w-full bg-white p-6 border border-gray-300 rounded-lg mb-3 cursor-pointer hover:shadow-md transition duration-300 ease-in-out flex justify-between items-center"
          >
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Update Versi {item.version}
              </h1>
              <p className="text-sm font-normal text-gray-700">{item.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default UpdateSettingPage;
