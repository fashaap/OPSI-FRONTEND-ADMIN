import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import Swal from "sweetalert2";

import { Kelas } from "../../../data/data";
import ExportToExcel from "../../../features/XLSX/ExportToExcel";
import HeadingComponent from "../../../components/text/HeadingComponent";
import AxiosInstance from "../../auth/AxiosInstance";
import Spinner from "../../../components/Spinner";
import { jwtDecode } from "jwt-decode";

const UsersPage = () => {
  const totalKelas = Kelas;
  const userToken = localStorage.getItem("userToken");
  const decode = jwtDecode(userToken);
  const totalAccount = totalKelas.reduce(
    (total, item) => total + item.total,
    0
  );

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [dataUser, setDataUser] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState(totalKelas);
  const [loading, setLoading] = useState(true); // Added loading state

  const filters = ["X", "XI", "XII"];

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await AxiosInstance.get(`/api/v1/auth/users`, {
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
      setLoading(false); // Set loading to false once fetching is done
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users once on component mount
  }, []); // Empty dependency array ensures this runs only on mount

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/users/kelas/${searchTerm}`);
  };

  const handleButtonDelete = async () => {
    Swal.fire({
      title: "Apa kamu yakin?",
      text: "Anda tidak akan dapat mengembalikan akun pelajar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("deleted");
        Swal.fire({
          title: "Dihapus!",
          text: "Seluruh akun pelajar telah dihapus",
          icon: "success",
        });
      }
    });
  };

  const handleButtonExport = () => {
    const tanggal = new Date().toLocaleDateString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const nameExcel = `akun user_${tanggal}`;
    ExportToExcel(dataUser, nameExcel);
  };

  const handleFilterButtonClick = (selectedCategory) => {
    setSelectedFilters((prev) =>
      prev.includes(selectedCategory)
        ? prev.filter((el) => el !== selectedCategory)
        : [...prev, selectedCategory]
    );
  };

  useEffect(() => {
    filterItems();
  }, [selectedFilters]);

  const filterItems = () => {
    if (selectedFilters.length > 0) {
      const tempItems = totalKelas.filter((item) =>
        selectedFilters.includes(item.kelas)
      );
      setFilteredItems(tempItems);
    } else {
      setFilteredItems(totalKelas);
    }
  };

  return (
    <>
      <HeadingComponent title="Akun Pengguna" />
      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="bg-white h-full w-auto lg:w-[75%] border rounded-xl px-4 py-3 mt-4 flex flex-col gap-5">
          <div className="flex justify-between">
            <button
              className="flex items-center gap-2 px-3 py-2 bg-blue-200 rounded-md hover:bg-blue-300"
              onClick={() =>
                document.getElementById("modal_filter").showModal()
              }
            >
              <FaFilter className="w-5 h-5 text-blue-700" />
              <span className="hidden lg:inline-block text-blue-700">
                Filter Kelas
              </span>
            </button>
            <dialog id="modal_filter" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Filter Kelas</h3>
                {filters.map((category, idx) => (
                  <button
                    key={idx}
                    className={`btn m-2 ${
                      selectedFilters.includes(category)
                        ? "bg-blue-500 text-white"
                        : "bg-blue-200 text-gray-700"
                    }`}
                    onClick={() => handleFilterButtonClick(category)}
                  >
                    {category}
                  </button>
                ))}
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Simpan</button>
                  </form>
                </div>
              </div>
            </dialog>
            <form onSubmit={handleSubmit}>
              <label className="input input-bordered flex items-center w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="grow"
                  placeholder="Cari kelas"
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
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-white shadow-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-700">
                      Wali Kelas: {item.waliKelas}
                    </p>
                    <p className="text-gray-700">Jumlah: {item.total}</p>
                  </div>
                  <Link
                    to={`/users/kelas/${item.name}`}
                    className="ml-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all duration-200"
                  >
                    Detail
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col w-auto lg:w-[25%]">
          <div className="bg-white h-auto w-full border rounded-xl px-4 py-5 mt-4 flex flex-col gap-5 shadow-lg">
            <div className="text-lg text-center font-semibold bg-gradient-to-r from-[#0095ff] to-[#227eff] text-white py-2 rounded-md shadow-md">
              Total akun pelajar : {totalAccount}
            </div>
            {decode.role === 2344 && (
              <>
                <button
                  onClick={handleButtonDelete}
                  className="text-lg font-semibold bg-gradient-to-r from-[#ff0000] to-[#ff4322] text-white py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-[#e64a19]"
                >
                  Delete seluruh akun pelajar
                </button>
              </>
            )}
            <button
              onClick={handleButtonExport}
              className="text-lg font-semibold bg-gradient-to-r from-[#00ff11] to-[#127003] text-white py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-[#19e63f]"
            >
              Export seluruh akun pelajar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
