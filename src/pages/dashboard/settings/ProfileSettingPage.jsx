import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../auth/AxiosInstance";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Spinner from "../../../components/Spinner"; // Import your Spinner component

const ProfileSettingPage = () => {
  const userToken = localStorage.getItem("userToken");
  const decodeToken = jwtDecode(userToken);
  const navigate = useNavigate();
  const [dataUser, setDataUser] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    code: "",
    email: "",
    displayImage: "",
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchUser = async () => {
    setLoading(true); // Set loading to true when starting the request
    try {
      const response = await AxiosInstance.get(
        `/api/v1/auth/admin/${decodeToken._id}`,
        {
          headers: { token: userToken },
        }
      );
      if (response.status === 200) {
        const userData = response.data.data;
        setDataUser(userData);
        setFormData({
          username: userData.username || "",
          displayName: userData.displayName || "",
          code: userData.code || "",
          email: userData.email || "",
        });
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  };

  const handleButtonDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Set loading to true when starting the request
        try {
          await AxiosInstance.delete(`/api/v1/auth/admin/${dataUser._id}`, {
            headers: { token: userToken },
          });
          navigate(`/admin`);
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire(
            "Error!",
            `An error occurred while deleting the user: ${error.message}`,
            "error"
          );
        } finally {
          setLoading(false); // Set loading to false after the request is complete
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Set loading to true when starting the request
        try {
          await AxiosInstance.put(
            `/api/v1/auth/admin/${dataUser._id}`,
            formData,
            {
              headers: { token: userToken },
            }
          );
          Swal.fire("Saved!", "User profile has been updated.", "success");
        } catch (error) {
          console.error("Error updating user:", error);
          Swal.fire(
            "Error!",
            `An error occurred while updating the user. Please try again later. Error details: ${
              error.response?.data?.message || error.message
            }`,
            "error"
          );
        } finally {
          setLoading(false); // Set loading to false after the request is complete
        }
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDataUser((prev) => ({
          ...prev,
          displayImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full bg-gray-50 p-8 border border-gray-200 rounded-lg shadow-md">
      {loading ? ( // Conditionally render spinner or the rest of the component
        <div className="flex justify-center items-center h-96">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col items-center lg:w-1/4">
            <div className="relative w-32 h-32">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                <img
                  src={dataUser.displayImage || "/default-avatar.png"}
                  alt={dataUser.username || "Default Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="edit-avatar"
                className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs font-semibold py-1 px-2 rounded-full cursor-pointer shadow-lg"
              >
                Edit
              </label>
              <input
                type="file"
                id="edit-avatar"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="flex-grow">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Edit User
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-3">
                <label className="text-gray-700 font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col space-y-3">
                <label className="text-gray-700 font-medium">
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col space-y-3">
                <label className="text-gray-700 font-medium">Code Guru</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col space-y-3">
                <label className="text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mt-8 flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={handleButtonDelete}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettingPage;
