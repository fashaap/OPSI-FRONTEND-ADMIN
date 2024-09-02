import { HiTicket } from "react-icons/hi2";
import { RiAdminFill, RiUserStarFill } from "react-icons/ri";
import { FaPersonCircleCheck, FaPersonCirclePlus } from "react-icons/fa6";
import { HiHome } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { MdMonitor } from "react-icons/md";
import { iconStyle } from "../data/data";

export const sidebar = [
  {
    title: "Beranda",
    icon: <HiHome size="33  " />,
    link: "/",
  },
  {
    title: "Pengguna",
    icon: <RiUserStarFill size={iconStyle.size} />,
    link: "/users",
  },
  {
    title: "Admin",
    icon: <RiAdminFill size={iconStyle.size} />,
    link: "/admin",
  },
  {
    title: "Membuat Tiket",
    icon: <FaPersonCirclePlus size={iconStyle.size} />,
    link: "/create-tickets",
  },
  {
    title: "Verifikasi Tiket",
    icon: <FaPersonCircleCheck size={iconStyle.size} />,
    link: "/verification-ticket",
  },
  {
    title: "Tiket",
    icon: <HiTicket size={iconStyle.size} />,
    link: "/tickets",
  },
  {
    title: "Pemantauan",
    icon: <MdMonitor size={iconStyle.size} />,
    link: "/monitoring",
  },
  {
    title: "Pengaturan",
    icon: <IoMdSettings size={iconStyle.size} />,
    link: "/settings",
  },
];
