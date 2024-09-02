import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "./AxiosInstance";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await AxiosInstance.post("/api/v1/auth/admin/signin", {
        email,
        password,
      });
      if (response.data) {
        setIsLoading(false);

        // Store user information and token in localStorage
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        localStorage.setItem("userToken", response.data.token.refreshToken);

        navigate("/"); 
      } else {
        console.error(
          "login error",
          response.data ? response.data.error : "empty response"
        );
      }
    } catch (error) {
      console.error("login error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (values) => {
    setIsLoading(true);
    await login(values.email, values.password);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleLoginSubmit,
    validationSchema: yup.object().shape({
      email: yup.string().required("Email is required").email(),
      password: yup.string().required("Password is required"),
    }),
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  return (
    <div className="bg-pattern min-h-screen flex justify-center items-center">
      <div className="container mx-auto px-4 h-full flex justify-center items-center">
        <div className="max-w-md w-full bg-[#F7F8FA] rounded-lg shadow-lg p-6">
          <div className="text-[#014B7C]">
            <h1 className="text-3xl font-bold">SI MIKA</h1>
            <p className="text-lg font-medium">
              Sistem Informasi Manajemen Izin Keluar Siswa
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block font-medium text-[#014B7C]"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Type here"
                className="input input-bordered w-full rounded-xl"
                onChange={handleForm}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block font-medium text-[#014B7C]"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Type here"
                className="input input-bordered w-full rounded-xl"
                onChange={handleForm}
              />
            </div>
            <button
              type="submit"
              className="btn bg-[#014B7C] w-full text-white rounded-xl lg:text-lg"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
