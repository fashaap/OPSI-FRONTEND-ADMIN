import HeadingComponent from "../../../components/text/HeadingComponent";

const PasswordSettingPage = () => {
  return (
    <>
    <HeadingComponent title={"Ubah Kata Sandi"}/>
      <div className="h-full bg-white p-7 border rounded-md mt-5">
        <div className="w-auto ">
          <div className="flex flex-col lg:flex-row">
            <form className="mb-4 lg:mb-0 flex-1">
              <div className="mb-4">
                <label
                  htmlFor="beforePassword"
                  className="block text-xl font-medium text-gray-700 mb-1"
                >
                  Kata Sandi Lama
                </label>
                <input
                  type="password"
                  placeholder="Masukan Kata Sandi Sebelumnya"
                  className="input input-bordered input-secondary border-[#014B7C] w-full"
                  name="beforePassword"
                  id="beforePassword"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="afterPassword"
                  className="block text-xl font-medium text-gray-700 mb-1"
                >
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  placeholder="Masukan Kata Sandi Baru"
                  className="input input-bordered input-secondary border-[#014B7C] w-full"
                  name="afterPassword"
                  id="afterPassword"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="verifPassword"
                  className="block text-xl font-medium text-gray-700 mb-1"
                >
                  Ulang Kata Sandi Baru
                </label>
                <input
                  type="password"
                  placeholder="Masukan Ulang Kata Sandi Baru"
                  className="input input-bordered input-secondary border-[#014B7C] w-full"
                  name="verifPassword"
                  id="verifPassword"
                />
              </div>
              <button className="btn bg-blue-500 text-white btn-primary w-full lg:w-auto">
                Simpan
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordSettingPage;
