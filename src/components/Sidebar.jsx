import { useState } from "react";
import { Link } from "react-router-dom";
import { sidebar } from "../features/sidebar";
import { iconStyle } from "../data/data";

const Sidebar = () => {
  const [clickedIndex, setClickedIndex] = useState(null);

  const defaultColor = iconStyle.color;
  const clickedColor = "#011b2d";

  const sidebarData = sidebar;

  const handleButtonClick = (index) => {
    setClickedIndex(index);
    setTimeout(() => {
      setClickedIndex(null);
    }, 500);
  };

  const handleLogout = async () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  return (
    <div className="fixed h-screen overflow-y-auto top-0 left-0 w-80 bg-white border-r-2 z-0 px-10 pb-5">
      <div className="h-full flex flex-col justify-between">
        <div className="mt-[100px]">
          {sidebarData.map((item, index) => {
            return (
              <Link
                to={item.link}
                key={index}
                className="flex items-center gap-8 mb-8"
                onClick={() => handleButtonClick(index)}
              >
                <span
                  className="w-6"
                  style={{
                    color: clickedIndex === index ? clickedColor : defaultColor,
                  }}
                >
                  {item.icon}
                </span>
                <h1
                  className="text-xl font-semibold"
                  style={{
                    color: clickedIndex === index ? clickedColor : defaultColor,
                  }}
                >
                  {item.title}
                </h1>
              </Link>
            );
          })}
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="btn bg-[#014B7C] btn-primary text-white p-2 rounded-lg w-full"
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
