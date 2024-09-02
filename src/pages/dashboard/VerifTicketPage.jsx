import HeadingComponent from "../../components/text/HeadingComponent";
import Badge from "../../components/badge/Badge";
import { FaFilter } from "react-icons/fa";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
Swal;

const VerifTicketPage = () => {
  //BERIKAN FITUR JIKA GURU MENOLAK BERIKAN ALASAN YANG JELAS

  const handleButtonReject = async () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda menolak permintaan siswa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Saya Yakin!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Ditolak");
        Swal.fire({
          title: "Permintaan Ditolak",
          text: "Permintaan siswa telah ditolak.",
          icon: "success",
        });
      }
    });
  };
  const handleButtonAccept = async () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda mengizinkan permintaan siswa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Saya Yakin!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Diterima");
        Swal.fire({
          title: "Permintaan Diterima",
          text: "Permintaan siswa telah dizinkan.",
          icon: "success",
        });
      }
    });
  };

  const data = [
    {
      id: "B3oFcYdRqVql78IX2RGU",
      avatar:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      name: "Fasha azhi putra",
      kelas: "XI IPA 4",
      waliKelas: "Yayat Hidayat, S.Kom",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit.Tenetur accusamus vitae autem, vel eligendi ratione commodi maiores deleniti doloribus modi? Sunt omnis corrupti aut tempore commodi reprehenderit rem vero quam!",
      date: "2022-01-01",
      timer: "03:10:00",
      buktiKuat:
        "https://kledo.com/wp-content/uploads/2020/10/surat-resmi-dua-791x1024.jpg",
      jenis: "dispen",
      mapel: ["Biologi", "Bahasa Indonesia", "Matematika", "Kimia"],
    },
    {
      id: "ZvQ0oNbKkpKWJpziXwR9",
      avatar:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      name: "Kalvin darmawan",
      kelas: "XI IPA 2",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit.Tenetur accusamus vitae autem, vel eligendi ratione commodi maiores deleniti doloribus modi? Sunt omnis corrupti aut tempore commodi reprehenderit rem vero quam!",
      waliKelas: "Yayat Hidayat, S.Kom",
      date: "2022-01-01",
      timer: "03:10:00",
      buktiKuat:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      jenis: "dispen",
      mapel: ["Biologi", "Bahasa Indonesia", "Matematika", "Kimia"],
    },
    {
      id: "Z6XRzXS8jj8vQctRwiwT",
      avatar:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      name: "Fasha azhi putra",
      kelas: "XI IPA 4",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit.Tenetur accusamus vitae autem, vel eligendi ratione commodi maiores deleniti doloribus modi? Sunt omnis corrupti aut tempore commodi reprehenderit rem vero quam!",
      waliKelas: "Yayat Hidayat, S.Kom",
      date: "2022-01-01",
      timer: "03:10:00",
      buktiKuat:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      jenis: "dispen",
      mapel: ["Biologi", "Bahasa Indonesia", "Matematika", "Kimia"],
    },
    {
      id: "B3oFcYdRqVql78IX2RGU",
      avatar:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      name: "Fasha azhi putra",
      kelas: "XI IPA 4",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit.Tenetur accusamus vitae autem, vel eligendi ratione commodi maiores deleniti doloribus modi? Sunt omnis corrupti aut tempore commodi reprehenderit rem vero quam!",
      waliKelas: "Yayat Hidayat, S.Kom",
      date: "2022-01-01",
      timer: "03:10:00",
      buktiKuat:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      jenis: "izin",
      mapel: ["Biologi", "Bahasa Indonesia", "Matematika", "Kimia"],
    },
  ];

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState(data);

  const filters = ["dispen", "izin"];

  const handleFilterButtonClick = (selectedCategory) => {
    if (selectedFilters.includes(selectedCategory)) {
      const filters = selectedFilters.filter((el) => el !== selectedCategory);
      setSelectedFilters(filters);
    } else {
      setSelectedFilters([...selectedFilters, selectedCategory]);
    }
  };

  useEffect(() => {
    filterItems();
  }, [selectedFilters]);

  const filterItems = () => {
    if (selectedFilters.length > 0) {
      const tempItems = data.filter((item) =>
        selectedFilters.includes(item.jenis)
      );
      setFilteredItems(tempItems);
    } else {
      setFilteredItems(data);
    }
  };

  return (
    <>
      <HeadingComponent title="Verifikasi tiket" />
      <div className="flex flex-wrap flex-col lg:flex-row font-sans gap-5 mt-5">
        <div className="w-full">
          <div className="flex justify-between items-center gap-2 ">
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 h-full  bg-blue-200 rounded-md hover:bg-blue-300 "
              onClick={() =>
                document.getElementById("modal_filter").showModal()
              }
            >
              <FaFilter className="w-5 h-5 text-blue-700" />
              <span className="hidden lg:inline-block text-blue-700">
                Filter jenis izin
              </span>
            </button>
            <dialog id="modal_filter" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg ">Filter jenis izin</h3>
                {filters.map((category, idx) => (
                  <button
                    key={idx}
                    className={`btn m-2 rounded-md ${
                      selectedFilters.includes(category)
                        ? "bg-blue-500 text-white"
                        : "bg-blue-200 text-gray-700"
                    }`}
                    onClick={() => handleFilterButtonClick(category)}
                  >
                    {category === "dispen" ? "Dispen" : "Izin"}
                  </button>
                ))}
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Simpan</button>
                  </form>
                </div>
              </div>
            </dialog>

            <div className="flex justify-end">
              <form>
                <label className="input input-bordered flex items-center w-auto">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Cari nama siswa"
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
          </div>
        </div>

        <div className="w-full  h-auto rounded-md flex flex-wrap gap-3 items-stretch py-3 text-white lg:text-lg">
          <div className="flex flex-1 flex-col justify-center bg-green-500  px-3 py-2 rounded-md min-h-[4rem]">
            Total permintaan : {data.length}
          </div>
          <div className="flex flex-1 flex-col justify-center bg-blue-500  px-3 py-2 rounded-md min-h-[4rem]">
            Permintaan Dispen:{" "}
            {filteredItems.filter((item) => item.jenis === "dispen").length}
          </div>
          <div className="flex flex-1 flex-col justify-center bg-orange-500 px-3 py-2 rounded-md min-h-[4rem]">
            Permintaan Izin:{" "}
            {filteredItems.filter((item) => item.jenis === "izin").length}
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card bg-white shadow-xl text-primary-content"
              >
                <div className="p-5">
                  <div className="flex mb-3 justify-between items-center">
                    <Link to={`/profile/user/${item.nisn}`}>
                      <div className="flex gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <h1 className="font-semibold text-lg">{item.name}</h1>
                          <h2 className="text-sm font-semi">
                            {item.kelas} | {item.waliKelas}
                          </h2>
                        </div>
                      </div>
                    </Link>
                    <Badge data={item.jenis} />
                  </div>
                  <div className="mb-3">
                    <h1 className="font-semibold mb-2">Alasan :</h1>
                    <div className="card py-3 px-2 bg-gray-200 rounded-sm h-40 overflow-y-auto">
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h1 className="font-semibold mb-2">Tanggal:</h1>
                    <div className="card py-3 px-2 bg-gray-200 rounded-sm">
                      <p>{item.date}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h1 className="font-semibold mb-2">
                      Waktu Yang dibutuhkan :
                    </h1>
                    <div className="card py-3 px-2 bg-gray-200 rounded-sm">
                      <p>{item.timer}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="card">
                      <img
                        className="w-full h-60 lg:h-40 object-cover rounded-sm border-2 border-gray-200"
                        src={item.buktiKuat}
                        alt={item.name}
                      />
                      <div className="text-end">
                        <button
                          className="link text-end mt-2 text-blue-600 "
                          onClick={() =>
                            document
                              .getElementById(`my_modal_${item.id}`)
                              .showModal()
                          }
                        >
                          Open Modal
                        </button>
                      </div>
                      <div>
                        <dialog id={`my_modal_${item.id}`} className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg">
                              Bukti kuat {item.name}
                            </h3>
                            <img
                              className="py-4"
                              src={item.buktiKuat}
                              alt="bukti kuat"
                            />
                            <div className="modal-action justify-between">
                              <span>
                                <button
                                  className="btn bg-green-500 text-white p-2 rounded-lg w-full"
                                  onClick={() =>
                                    saveAs(
                                      item.buktiKuat,
                                      `Bukti kuat ${item.name}.jpg`
                                    )
                                  }
                                >
                                  Download
                                </button>
                              </span>
                              <form method="dialog">
                                <button className="btn bg-[#014B7C] text-white p-2 rounded-lg w-full">
                                  Kembali
                                </button>
                              </form>
                            </div>
                          </div>
                        </dialog>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="font-semibold mb-2">
                      Izinkan siswa untuk keluar
                    </h1>
                    <div className="card-actions">
                      <button
                        onClick={handleButtonAccept}
                        className="btn bg-green-500 hover:bg-green-600 text-white"
                      >
                        Izinkan
                      </button>
                      <button
                        onClick={handleButtonReject}
                        className="btn bg-red-500 hover:bg-red-600 text-white"
                      >
                        Tidak Izinkan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[70vh] w-full flex justify-center items-center">
            <h1 className="text-center ">Tidak ada siswa yang meminta izin</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default VerifTicketPage;
