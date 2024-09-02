import { jwtDecode } from "jwt-decode";
// import { accountAdmin } from "../data/data";
import AxiosInstance from "../pages/auth/AxiosInstance";
import AvatarNavbar from "./avatar/AvatarNavbar";
import { useEffect, useState } from "react";

const Navbar = () => {
  // const accountData = accountAdmin;
  const getUserToken = localStorage.getItem("userToken");
  const token = jwtDecode(getUserToken);
  const [accountAdmin, setAccountAdmin] = useState([]);

  // console.log(token);

  const fetchUser = async () => {
    const response = await AxiosInstance.get(
      `/api/v1/auth/admin/${token._id}`,
      {
        headers: { token: getUserToken },
      }
    );

    if (response.status === 200) {
      // console.log(response);
      setAccountAdmin(response.data.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen bg-white border-b-2 z-10 h-20 px-10 py-2">
      <div className="flex items-center justify-between">
        <span className="text-[#014B7C]">
          <h1 className="text-2xl font-bold">SI MIKA</h1>
          <p className="text-md font-semibold">
            Sistem Informasi Manajemen Izin Keluar Siswa
          </p>
        </span>

        <AvatarNavbar
          username={accountAdmin.displayName}
          role={accountAdmin.role}
        />
      </div>
    </div>
  );
};

export default Navbar;
