import { useParams } from "react-router-dom";
import HeadingComponent from "../../../components/text/HeadingComponent";
import AxiosInstance from "../../auth/AxiosInstance";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner"; // Import your Spinner component

const ComplaintDetailSettingPage = () => {
  const userToken = localStorage.getItem("userToken");
  const { id, idUser } = useParams();
  const [reportData, setReportData] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchReports = async () => {
    try {
      const response = await AxiosInstance.get(`/api/v1/report?id=${id}`, {
        headers: { token: userToken },
      });
      if (response.status === 200) {
        setReportData(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/auth/users?idUser=${idUser}`,
        {
          headers: { token: userToken },
        }
      );
      if (response.status === 200) {
        setUserData(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      await fetchReports();
      await fetchUsers();
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();

    // Optional: If you want to refetch reports periodically
    const interval = setInterval(() => {
      fetchReports();
    }, 1000);

    return () => clearInterval(interval);
  }, [id, idUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> {/* Display spinner while loading */}
      </div>
    );
  }

  return (
    <>
      <HeadingComponent title={`ID Pengaduan : #${id}`} />
      <div className="h-screen mt-5 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="flex-shrink-0"></div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {userData.displayName}
                  </h1>
                  <h2 className="text-lg text-gray-600">{reportData.date}</h2>
                </div>
                <div className="ml-auto flex gap-2">
                  {reportData.read ? (
                    <div className="bg-blue-400 text-white px-4 py-1 rounded-full shadow-md hover:bg-blue-500 transition-colors duration-300">
                      Read
                    </div>
                  ) : (
                    <div className="bg-purple-300 text-white px-4 py-1 rounded-full shadow-md hover:bg-purple-400 transition-colors duration-300">
                      Queueing
                    </div>
                  )}

                  {reportData.pending && (
                    <div className="bg-orange-400 text-white px-4 py-1 rounded-full shadow-md hover:bg-orange-500 transition-colors duration-300">
                      Pending
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  Pengaduan :
                </h3>
                <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-800">
                    Perihal :
                  </h4>
                  <p className="mt-1 text-gray-700">{reportData.title}</p>
                </div>
                <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-800">
                    Deskripsi :
                  </h4>
                  <p className="mt-1 text-gray-700">{reportData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplaintDetailSettingPage;
