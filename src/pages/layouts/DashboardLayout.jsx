import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log(width);

  return width >= 1000 ? (
    <div className="relative font-sans">
      <Navbar />
      <Sidebar />
      <div className="ml-80 mt-20 p-5 bg-[#F7F8FA]">
        <div className="w-full h-auto">{children}</div>
      </div>
    </div>
  ) : (
    <div>
      Versi ini dari halaman web kami dirancang untuk tampil dengan baik pada
      layar yang lebih besar.
    </div>
  );
};

export default DashboardLayout;
