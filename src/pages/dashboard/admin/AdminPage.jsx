import HeadingComponent from "../../../components/text/HeadingComponent";
import ExportToExcel from "../../../features/XLSX/ExportToExcel";
// import { accountPelajar } from "../../../data/data";

import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import AxiosInstance from "../../auth/AxiosInstance";
import { useEffect, useState } from "react";
Swal;

import * as XLSX from "xlsx";
import Spinner from "../../../components/Spinner";
import { jwtDecode } from "jwt-decode";

const AdminPage = () => {
  const [dataUser, setDataUser] = useState([]);
  const [dataUserDisplay, setDataUserDisplay] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const userToken = localStorage.getItem("userToken");
  const decode = jwtDecode(userToken);

  const fetchUsersDisplay = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`/api/v1/auth/admin`, {
        headers: { token: userToken },
      });

      if (response.status === 200) {
        setDataUserDisplay(response.data.data);
      } else {
        console.error("Unexpected response status:", response.status);
        setDataUserDisplay([]);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setDataUserDisplay([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`/api/v1/auth/admin?role=1932`, {
        headers: { token: userToken },
      });

      if (response.status === 200) {
        setDataUser(response.data.data);
      } else {
        console.error("Unexpected response status:", response.status);
        setDataUser([]);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setDataUser([]);
    } finally {
      setLoading(false);
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
      confirmButtonText: "Ya, Hapus ini!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const user of dataUser) {
            await AxiosInstance.delete(`/api/v1/auth/admin/${user.id}`, {
              headers: { token: userToken },
            });
          }
          await fetchUsers(); // Refresh the user list
          Swal.fire({
            title: "Dihapus!",
            text: "Seluruh akun admin telah dihapus",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting users:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the accounts.",
            "error"
          );
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

    const nameExcel = `akun admin_${tanggal}`;
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

        if (!jsonData || jsonData.length === 0) {
          throw new Error("The selected file contains no data.");
        }

        const formattedData = jsonData
          .map((row) => {
            const userData = {
              username: row.username || "",
              password: row.password || "admin",
              displayName: row.displayName || "",
              role: row.role || 1932,
              email: row.email,
              code: row.code || "YYT",
            };

            if (
              !userData.username ||
              !userData.displayName ||
              !userData.email ||
              !userData.password ||
              !userData.role ||
              !userData.code
            ) {
              return null;
            }

            return userData;
          })
          .filter((data) => data !== null);

        if (formattedData.length === 0) {
          throw new Error("The formatted data is empty after processing.");
        }

        for (const userData of formattedData) {
          try {
            const response = await AxiosInstance.post(
              "/api/v1/auth/admin/signup",
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
              break;
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

        Swal.fire(
          "Success!",
          "All users have been successfully imported!",
          "success"
        );
        fetchUsersDisplay(); // Refresh user list
      } catch (error) {
        console.error("Error reading file:", error);
        Swal.fire(
          "Error!",
          "An error occurred while reading the file.",
          "error"
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    fetchUsers();
    fetchUsersDisplay();
  }, []);

  const handleButtonAddAccount = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get("username"),
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      code: formData.get("code"),
      password: formData.get("password"),
      role: 1932,
    };

    try {
      const response = await AxiosInstance.post(
        "/api/v1/auth/admin/signup",
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
        fetchUsersDisplay(); // Refresh user list
        handleCloseModal();
      } else {
        Swal.fire("Error!", "Failed to add the account.", "error");
      }
    } catch (error) {
      console.error("Error adding account:", error);
      Swal.fire(
        "Error!",
        "An error occurred while adding the account.",
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
                Username
              </label>
              <input
                type="text"
                name="username"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10 p-3"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Code Guru
              </label>
              <input
                type="text"
                name="code"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10"
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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <HeadingComponent title="Akun Admin" />
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="bg-white h-screen w-auto lg:w-[75%] border rounded-xl px-4 py-3 mt-4 flex flex-col gap-5">
              <div className="flex justify-end">
                <form>
                  <label className="input input-bordered flex items-center w-auto">
                    <input
                      type="text"
                      className="grow"
                      placeholder="Cari akun admin"
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
              <div className="overflow-x-auto rounded-lg border h-screen  bg-white">
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
                        Username
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                        Role
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                        Profil
                      </th>
                      {decode.role === 2344 && (
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                          Edit
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {dataUserDisplay.map((item, idx) => {
                      return (
                        <tr key={idx} className="hover:bg-gray-50 border-b">
                          <td className="px-5 py-2 text-md">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span className="text-xs">UI</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-2 ">{item.id}</td>
                          <td className="px-5 py-2 ">{item.username}</td>
                          <td className="px-5 py-2 ">{item.displayName}</td>
                          <td className="px-5 py-2 ">{item.code}</td>
                          <td className="px-5 py-2 ">{getRoleText(item.role)}</td>
                          <td className="px-5 py-2 ">
                            <Link
                              to={`/profile/admin/${item.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Detail
                            </Link>
                          </td>
                          {decode.role === 2344 && (
                            <td className="px-5 py-2 ">
                              <Link
                                to={`/profile/admin/edit/${item.id}`}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                Edit
                              </Link>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col w-auto lg:w-[25%]">
              <div className="bg-white h-auto w-full border rounded-xl shadow-lg px-4 py-3 mt-4 flex flex-col gap-4 ">
                <div className="text-lg text-center font-semibold bg-gradient-to-r from-[#0095ff] to-[#227eff] text-white py-2 rounded-md shadow-md">
                  Total akun : {dataUser.length}
                </div>
                {decode.role === 2344 && (
                  <>
                    <button
                      onClick={handleButtonDelete}
                      className="text-lg font-semibold bg-gradient-to-r from-[#ff0000] to-[#ff4322] text-white py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-[#e64a19]"
                    >
                      Delete seluruh akun
                    </button>
                    <label
                      htmlFor="import-file"
                      className="text-lg font-semibold bg-gradient-to-r from-[#003cff] to-[#3122ff] text-white py-2 rounded-md shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-[#1961e6] text-center"
                    >
                      Import seluruh akun
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
                      Export seluruh akun
                    </button>
                    <button
                      onClick={handleButtonAddAccount}
                      className="text-lg font-semibold bg-gradient-to-r from-[#8000ff] to-[#430086] text-white py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-[#7c19e6]"
                    >
                      Buat akun
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          {showModal && addAccountComponent()}
        </>
      )}
    </>
  );
};

export default AdminPage;
