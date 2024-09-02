import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../auth/AxiosInstance";
import Swal from "sweetalert2";
import Spinner from "../../../components/Spinner";


const AdminEditPage = () => {
  const userToken = localStorage.getItem("userToken");
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataUser, setDataUser] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    role: "",
    code: "",
  });
  const [loading, setLoading] = useState(true); // State to track loading

  const fetchUsers = async () => {
    try {
      const response = await AxiosInstance.get(`/api/v1/auth/admin/${id}`, {
        headers: { token: userToken },
      });

      if (response.status === 200) {
        const userData = response.data.data;
        setDataUser(userData);
        setFormData({
          username: userData.username || "",
          displayName: userData.displayName || "",
          email: userData.email || "",
          role: userData.role || "",
          code: userData.code || "",
        });
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  const handleButtonDelete = async () => {
    Swal.fire({
      title: "Apa kamu yakin?",
      text: "Anda tidak akan dapat mengembalikan akun admin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AxiosInstance.delete(`/api/v1/auth/admin/${id}`, {
            headers: { token: userToken },
          });
          navigate(`/admin`);
          Swal.fire({
            title: "Dihapus!",
            text: "Akun admin telah dihapus",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the user.",
            icon: "error",
          });
        }
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
        try {
          await AxiosInstance.put(`/api/v1/auth/admin/${id}`, formData, {
            headers: { token: userToken },
          });
          Swal.fire("Saved!", "Profil pengguna telah diperbarui", "success");
        } catch (error) {
          console.error("Error updating user:", error);
          Swal.fire(
            "Error!",
            "An error occurred while updating the user.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <div className="h-full bg-gray-50 p-8 border border-gray-200 rounded-lg mt-6 shadow-md">
        {loading ? (
          <div className="w-full h-screen flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center lg:w-1/4">
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                  <img
                    src={dataUser.displayImage}
                    alt={dataUser.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="edit-avatar"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs font-semibold py-1 px-2 rounded-full cursor-pointer shadow-lg"
                >
                  Edit
                </label>
                <input type="file" id="edit-avatar" className="hidden" />
              </div>
            </div>

            <div className="flex-grow">
              <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                Edit Pengguna
              </h1>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700 font-medium">Username</label>
                  <input
                    name="username"
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.username}
                    placeholder="Username"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700 font-medium">
                    Display Name
                  </label>
                  <input
                    name="displayName"
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.displayName}
                    placeholder="Display Name"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700 font-medium">Code Guru</label>
                  <input
                    name="code"
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.code}
                    placeholder="Code Guru"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700 font-medium">Role</label>
                  <input
                    name="role"
                    className="p-3 border border-gray-300 rounded-md shadow-sm bg-gray-200 cursor-not-allowed"
                    disabled
                    value={formData.role}
                    placeholder="Role"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700 font-medium">Email</label>
                  <input
                    name="email"
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.email}
                    placeholder="Email"
                  />
                </div>
                <div className="mt-8 flex justify-between space-x-4">
                  <button
                    type="button"
                    onClick={handleButtonDelete}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Hapus Akun
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminEditPage;
