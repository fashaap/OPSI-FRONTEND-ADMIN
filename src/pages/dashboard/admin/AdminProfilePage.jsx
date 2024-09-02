import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../auth/AxiosInstance";
import Spinner from "../../../components/Spinner";

const AdminProfilePage = () => {
  const [dataUser, setDataUser] = useState(null); // Use `null` to check if data is loaded
  const [loading, setLoading] = useState(true); // State to track loading
  let { id } = useParams();

  const userToken = localStorage.getItem("userToken");

  const fetchUsers = async () => {
    try {
      const response = await AxiosInstance.get(`/api/v1/auth/admin/${id}`, {
        headers: { token: userToken },
      });

      if (response.status === 200) {
        setDataUser(response.data.data);
      } else {
        console.error("Unexpected response status:", response.status);
        setDataUser(null);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setDataUser(null);
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  const getRoleText = (roleCode) => {
    switch (roleCode) {
      case 2344:
        return "Super Admin";
      case 1932:
        return "Admin";
      default:
        return "Unknown Role";
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchUsers();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // console.log(dataUser);

  return (
    <>
      <div className="w-full min-h-full bg-white p-5 border rounded-md">
        {loading ? (
          <div className="w-full h-screen flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col items-center">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-32">
                  <span className="text-3xl">D</span>
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-4">{`Detail ${dataUser.displayName}`}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Nama</h2>
                  <p>{dataUser.username}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Id</h2>
                  <p>{dataUser._id}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Role</h2>
                  <p>{getRoleText(dataUser.role)}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Code</h2>
                  <p>{dataUser.code}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h2 className="font-semibold">Email</h2>
                  <p>{dataUser.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProfilePage;
