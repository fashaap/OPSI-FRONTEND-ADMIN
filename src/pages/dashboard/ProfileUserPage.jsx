import CountUp from "react-countup";
import { useParams } from "react-router-dom";

const ProfileUserPage = () => {
  let { id } = useParams();

  const user = {
    nama: "User Name",
    id: "1122334455",
    nisn: "1122334455",
    kelas: "1122334455",
    waliKelas: "1122334455",
    email: "1122334455",
    noHp: "1122334455",
    noOrangTua: "1122334455",
  };

  return (
    <div className="w-full min-h-screen bg-white p-5 border rounded-md">
      <div className="flex flex-col lg:flex-row gap-10">

        <div className="flex flex-col items-center">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-32">
              <span className="text-3xl">D</span>
            </div>
          </div>
        </div>


        <div className="flex-grow">
          <h1 className="text-3xl font-bold mb-4">User Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-md">
              <h2 className="font-semibold">Nama</h2>
              <p>{user.nama}</p>
            </div>
            <div className="p-3 border rounded-md">
              <h2 className="font-semibold">Id</h2>
              <p>{user.id}</p>
            </div>
            <div className="p-3 border rounded-md">
              <h2 className="font-semibold">Kelas</h2>
              <p>{user.kelas}</p>
            </div>
            <div className="p-3 border rounded-md">
              <h2 className="font-semibold">WaliKelas</h2>
              <p>{user.waliKelas}</p>
            </div>
            <div className="p-3 border rounded-md">
              <h2 className="font-semibold">No Hp</h2>
              <p>{user.noHp}</p>
            </div>
            <div className="p-3 border rounded-md">
              <h2 className="font-semibold">No Orang Tua</h2>
              <p>{user.noOrangTua}</p>
            </div>
          </div>
        </div>
      </div>


      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-4">Statistics</h2>
        <div className="w-full h-screen mt-5 ">
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 text-white font-semibold">
            <div className="text-2xl w-full h-auto rounded-md bg-[#014b7c] py-5 px-4 ">
              <h1 className="text-2xl">Dispen</h1>
              <p className="text-2xl">
                <CountUp end={10} duration={5} />
              </p>
            </div>
            <div className="text-2xl w-full h-auto rounded-md bg-[#ffc107] py-5 px-4">
              {" "}
              <h1 className="text-2xl">Izin</h1>
              <p className="text-2xl">
                <CountUp end={10} duration={5} />
              </p>
            </div>
            <div className="text-2xl w-full h-auto rounded-md bg-[#16a34a] py-5 px-4">
              {" "}
              <h1 className="text-2xl">Pulang</h1>
              <p className="text-2xl">
                <CountUp end={10} duration={5} />
              </p>
            </div>
            <div className="text-2xl w-full h-auto rounded-md bg-[#dc2626] py-5 px-4 col-span-3 xl:col-span-1">
              {" "}
              <h1 className="text-2xl">Tidak Pulang</h1>
              <p className="text-2xl">
                <CountUp end={10} duration={5} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUserPage;
