import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeadingComponent from "../../../components/text/HeadingComponent";
import ExportToExcel from "../../../features/XLSX/ExportToExcel";
import Swal from "sweetalert2";
import AxiosInstance from "../../auth/AxiosInstance";
import * as XLSX from "xlsx";

const UsersDetail = () => {
  const userToken = localStorage.getItem("userToken");
  let { kelasId } = useParams();
  const [dataUser, setDataUser] = useState([]);
  const [showModal, setShowModal] = useState(false); // Mo
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: "",
    nisn: 0,
    classGrade: kelasId,
    email: "",
    code: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/auth/users?classGrade=${kelasId}`
      );

      if (response.status === 200) {
        setDataUser(response.data.data);
      } else {
        console.error("Unexpected response status:", response.status);
        setDataUser([]);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setDataUser([]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 1000);

    return () => clearInterval(interval);
  }, [kelasId]);

  // console.log(dataUser);

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
          for (const user of dataUser) {
            await AxiosInstance.delete(`/api/v1/auth/users/${user.id}`, {
              headers: { token: userToken },
            });
          }

          window.location.reload();
          Swal.fire({
            title: "Dihapus!",
            text: "Seluruh akun pelajar telah dihapus",
            icon: "success",
          });
          await fetchUsers(); // Refresh the user list after deletion
          window.location.reload();
        } catch (error) {
          console.error("Error deleting users:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting users.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleButtonExport = () => {
    const tanggal = new Date().toLocaleDateString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const nameExcel = `akun_user_kelas_${kelasId}_${tanggal}`;
    ExportToExcel(dataUser, nameExcel);
  };

  const handleButtonImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process and filter data
        const formattedData = jsonData
          .map((row) => {
            const userData = {
              username: row.username || "",
              password: row.password || "admin",
              displayName: row.displayName || "",
              displayImage:
                row.displayImage ||
                "https://fastly.picsum.photos/id/12/2500/1667.jpg",
              nisn: row.nisn || 0,
              classGrade: row.classGrade || kelasId, // Ensure kelasId is properly defined
              email: row.email || "",
              code: row.code || "YYT",
            };

            if (
              !userData.username ||
              !userData.displayName ||
              !userData.nisn ||
              !userData.classGrade ||
              !userData.email ||
              !userData.password ||
              !userData.code
            ) {
              return null;
            }

            return userData;
          })
          .filter((data) => data !== null);

        // Send data one by one
        for (const userData of formattedData) {
          try {
            const response = await AxiosInstance.post(
              "/api/v1/auth/users/signup",
              userData,
              {
                headers: { token: userToken },
              }
            );

            if (response.status !== 200) {
              Swal.fire(
                "Error!",
                `Failed to import user ${userData.username}: ${response.data.error}`,
                "error"
              );

              break; // Stop processing if an error occurs
            }
          } catch (error) {
            console.error("Error importing user:", error);

            Swal.fire(
              "Error!",
              `An error occurred during the import process for user ${
                userData.username
              }: ${error.response?.data?.error || error.message}`,
              "error"
            );
            break;
          }
        }

        // If all requests were successful
        Swal.fire(
          "Success!",
          "All users have been successfully imported!",
          "success"
        );
        await fetchUsers(); // Refresh user list
        window.location.reload();
      } catch (error) {
        console.error("Error reading file:", error);
        Swal.fire(
          "Error!",
          "An error occurred while reading the file.",
          "error"
        );
      }
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
      Swal.fire("Error!", "An error occurred while reading the file.", "error");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleButtonAddAccount = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure 'nisn' is converted to a number
    const updatedValue = name === "nisn" ? Number(value) : value;

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // Check for empty fields and ensure 'nisn' is a valid number
    if (
      !formData.username ||
      !formData.displayName ||
      !formData.nisn ||
      isNaN(formData.nisn) ||
      !formData.classGrade ||
      !formData.email ||
      !formData.password ||
      !formData.code
    ) {
      Swal.fire("Error!", "Please fill all the fields.", "error");
      return;
    }

    const userData = {
      username: formData.username,
      password: formData.password,
      displayName: formData.displayName,
      nisn: formData.nisn, // Should be a number
      classGrade: formData.classGrade,
      email: formData.email,
      code: formData.code,
    };

    console.log("Payload:", userData);

    try {
      const response = await AxiosInstance.post(
        "/api/v1/auth/users/signup",
        userData,
        {
          headers: { token: userToken },
        }
      );

      if (response.status === 200) {
        Swal.fire(
          "Success!",
          "Account has been successfully added!",
          "success"
        );
        handleCloseModal();
      } else {
        Swal.fire("Error!", "Failed to add the account.", "error");
      }
    } catch (error) {
      console.error(
        "Error adding account:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error!",
        "An error occurred while adding the account: " +
          (error.response?.data.message || error.message),
        "error"
      );
    }
  };

  const addAccountComponent = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            Add New Account
          </h2>
          <form onSubmit={handleSubmitForm}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                NISN
              </label>
              <input
                type="number"
                name="nisn"
                placeholder="Enter NISN"
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10 p-3"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10 p-3"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10 p-3"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10 p-3"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10 p-3"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10 p-3"
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="bg-gray-600 text-white py-2 px-4 rounded-md shadow-md transition-colors duration-300 hover:bg-gray-700"
                onClick={handleCloseModal}
                aria-label="Cancel action"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#8000ff] to-[#430086] hover:from-[#6a00e1] hover:to-[#370064] text-white py-2 px-4 rounded-md shadow-md transition-all duration-300"
              >
                Add Account
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <HeadingComponent title={`Kelas ${kelasId}`} />
      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="bg-white h-screen w-auto lg:w-[75%] border rounded-xl px-4 py-3 mt-4 flex flex-col gap-5">
          <div className="flex justify-end">
            <form>
              <label className="input input-bordered flex items-center w-auto">
                <input
                  type="text"
                  className="grow"
                  placeholder="Cari akun siswa"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </form>
          </div>
          <div className="overflow-x-auto rounded-lg border h-screen bg-white">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-[#014B7C] text-white text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                    Id
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                    Nisn
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                    Display Name
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                    Profil
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataUser.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 border-b">
                    <td className="px-5 py-2 text-md">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <span className="text-xs">UI</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2 ">{item.id}</td>
                    <td className="px-5 py-2 ">{item.nisn}</td>
                    <td className="px-5 py-2 ">{item.displayName}</td>
                    <td className="px-5 py-2 ">{item.username}</td>
                    <td className="px-5 py-2 ">
                      <Link
                        to={`/profile/user/${item.nisn}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Detail
                      </Link>
                    </td>
                    <td className="px-5 py-2 ">
                      <Link
                        to={`/profile/user/edit/${item.nisn}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col w-auto lg:w-[25%]">
          <div className="bg-white h-auto w-full border rounded-xl shadow-lg px-4 py-3 mt-4 flex flex-col gap-4 ">
            <div className="text-lg text-center font-semibold bg-gradient-to-r from-[#0095ff] to-[#227eff] text-white py-2 rounded-md shadow-md">
              Total akun : {dataUser.length}
            </div>
            <button
              onClick={handleButtonDelete}
              className="text-lg font-semibold bg-gradient-to-r from-[#ff0000] to-[#ff4322] text-white py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-[#e64a19]"
            >
              Delete
            </button>
            <label
              htmlFor="import-file"
              className="text-lg font-semibold bg-gradient-to-r from-[#003cff] to-[#3122ff] text-white py-2 rounded-md shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-[#1961e6] text-center"
            >
              Import
              <input
                type="file"
                id="import-file"
                accept=".xlsx, .xls"
                onChange={handleButtonImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleButtonExport}
              className="text-lg font-semibold bg-gradient-to-r from-[#00ff11] to-[#127003] text-white py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-[#19e63f]"
            >
              Export
            </button>
            <button
              onClick={handleButtonAddAccount}
              className="text-lg font-semibold bg-gradient-to-r from-[#8000ff] to-[#430086] text-white py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-[#7c19e6]"
            >
              Buat akun
            </button>
          </div>
        </div>
      </div>
      {showModal && addAccountComponent()}
    </>
  );
};

export default UsersDetail;
