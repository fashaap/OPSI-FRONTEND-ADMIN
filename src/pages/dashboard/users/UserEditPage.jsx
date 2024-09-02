import { useEffect, useState } from "react";
import AxiosInstance from "../../auth/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../../components/Spinner";

const UserEditPage = () => {
  const userToken = localStorage.getItem("userToken");
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataUser, setDataUser] = useState({});
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    nisn: "",
    role: "",
    classGrade: "",
    code: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`/api/v1/auth/users?nisn=${id}`);
      if (response.status === 200 && response.data.data.length > 0) {
        const user = response.data.data[0];
        setDataUser(user);
        setFormData({
          displayName: user.displayName || "",
          username: user.username || "",
          nisn: user.nisn || "",
          role: user.role || "",
          classGrade: user.classGrade || "",
          code: user.code || "",
          email: user.email || "",
        });
      } else {
        console.error(
          "User not found or unexpected response status:",
          response.status
        );
        setDataUser({});
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setDataUser({});
    } finally {
      setLoading(false);
    }
  };

  // Delete user account
  const handleButtonDelete = async () => {
    Swal.fire({
      title: "Apa kamu yakin?",
      text: "Anda tidak akan dapat mengembalikan akun pelajar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AxiosInstance.delete(`/api/v1/auth/users/${dataUser.id}`, {
            headers: { token: userToken },
          });
          navigate(`/users`);
          Swal.fire(
            "Dihapus!",
            "Seluruh akun pelajar telah dihapus",
            "success"
          );
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the user.",
            "error"
          );
        }
      }
    });
  };

  useEffect(() => {
    fetchUser();
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
    try {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await AxiosInstance.put(
              `/api/v1/auth/users/${dataUser.id}`,
              formData,
              {
                headers: { token: userToken },
              }
            );
            window.location.reload();
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
    } catch (error) {
      console.error("Error handling request:", error);
      Swal.fire(
        "Error!",
        "An error occurred while processing your request.",
        "error"
      );
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="h-full bg-gray-100 p-8 border border-gray-300 rounded-lg mt-6 shadow-md">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col items-center lg:w-1/4">
              <div className="relative w-32 h-32">
                <img
                  src={dataUser.displayImage}
                  alt={dataUser.username}
                  className="w-full h-full rounded-full object-cover border-2 border-gray-300 shadow-sm"
                />
                <label
                  htmlFor="edit-avatar"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded-full cursor-pointer shadow-lg"
                >
                  Edit
                </label>
                <input type="file" id="edit-avatar" className="hidden" />
              </div>
            </div>

            <div className="flex-grow">
              <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                Edit Profil
              </h1>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700">Name</label>
                  <input
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700">Username</label>
                  <input
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700">NISN</label>
                  <input
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleInputChange}
                    placeholder="Enter NISN"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700">Role</label>
                  <input
                    className="p-3 border border-gray-300 rounded-md shadow-sm bg-gray-200 cursor-not-allowed"
                    name="role"
                    value={formData.role}
                    disabled
                    placeholder="Role"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700">Kelas</label>
                  <input
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="classGrade"
                    value={formData.classGrade}
                    onChange={handleInputChange}
                    placeholder="Enter class grade"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700">Code Wali Kelas</label>
                  <input
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter code"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700">Email</label>
                  <input
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                </div>
                <div className="mt-8 flex justify-between space-x-4">
                  <button
                    type="button"
                    onClick={handleButtonDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Hapus Akun
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserEditPage;
