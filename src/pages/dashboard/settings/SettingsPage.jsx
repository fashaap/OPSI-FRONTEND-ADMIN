import HeadingComponent from "../../../components/text/HeadingComponent";
import { FaCircleUser } from "react-icons/fa6";
import { BsShieldLockFill } from "react-icons/bs";
// import { MdWorkHistory } from "react-icons/md";
import { TbAlertHexagonFilled } from "react-icons/tb";
import { AiFillNotification } from "react-icons/ai";
import { Link } from "react-router-dom";
const SettingsPage = () => {
  const data = [
    {
      id: 1,
      name: "Lihat Profil",
      icon: <FaCircleUser size={30} />,
      path: `/settings/profile`,
    },
    {
      id: 2,
      name: "Ubah Kata Sandi",
      icon: <BsShieldLockFill size={30} />,
      path: `/settings/password`,
    },
    {
      id: 4,
      name: "Pengaduan",
      icon: <AiFillNotification size={30} />,
      path: "/settings/complaint",
    },
    {
      id: 5,
      name: "Informasi Update",
      icon: <TbAlertHexagonFilled size={30} />,
      path: "/settings/update",
    },
  ];

  return (
    <>
      <HeadingComponent title="Pengaturan" />
      <section className="h-full flex flex-col justify-between">
        <ul className="flex flex-col gap-3 w-full mt-5 font-bold">
          {data.map((item, idx) => {
            return (
              <Link
                key={idx}
                to={item.path}
                className="card bg-white rounded-md p-4 border-2 border-gray-200 flex flex-row gap-3 hover:shadow-lg"
              >
                {item.icon}
                <h1 className="text-2xl">{item.name}</h1>
              </Link>
            );
          })}
        </ul>
        <div className="text-center font-semibold mt-10 mb-10">
          Copyright &copy; 2024 · ICT Center SMA PGRI Cicalengka · Versi 1.0.0
        </div>
      </section>
    </>
  );
};

export default SettingsPage;
