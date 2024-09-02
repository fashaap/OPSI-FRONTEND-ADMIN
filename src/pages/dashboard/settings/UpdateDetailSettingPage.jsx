import { useEffect, useState } from "react";
import AxiosInstance from "../../auth/AxiosInstance";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner"; // Import your Spinner component

const UpdateDetailSettingPage = () => {
  const { id } = useParams();
  const userToken = localStorage.getItem("userToken");
  const [dataInformation, setDataInformation] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchInformationUpdate = async () => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/information/update?device=dekstop&version=${id}`,
        {
          headers: { token: userToken },
        }
      );

      if (response.status === 200) {
        setDataInformation(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching information update:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchInformationUpdate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> {/* Display spinner while loading */}
      </div>
    );
  }

  return (
    <>
      <div className="h-auto w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">
          Update Versi {dataInformation.version}
        </h1>
        <div className="mt-4 text-lg text-gray-600 xl:w-1/2 leading-relaxed">
          {dataInformation.description}
        </div>
        <div className="w-full xl:w-1/2 mt-6">
          <img
            src={dataInformation.image}
            alt="Update Image"
            className="object-cover h-[50vh] w-full rounded-xl shadow-md"
          />
        </div>
      </div>
    </>
  );
};

export default UpdateDetailSettingPage;
