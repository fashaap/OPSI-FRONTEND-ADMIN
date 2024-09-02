import PropTypes from "prop-types";

const AvatarNavbar = (props) => {
  const roleTextComponent = () => {
    switch (props.role) {
      case 2344:
        return "Super Admin";
      case 1932:
        return "Admin";
      case 1232:
        return "Viewer";
      case 2321:
        return "User";
      default:
        return "Unknown Role";
    }
  };

  return (
    <div className="flex items-center gap-3 p-2">
      <div className="flex flex-col">
        <p className="text-md font-bold text-gray-800">{props.username}</p>
        <p className="text-sm text-gray-600 font-semibold text-end">
          {roleTextComponent()}
        </p>
      </div>
      <div className="avatar">
        <div className="w-12 h-12 rounded-full overflow-hidden ">
          <img
            src={props.avatar}
            alt={props.username}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

AvatarNavbar.defaultProps = {
  username: "Fasha Azhi Putra",
  avatar:
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg&ga=GA1.1.545745486.1710488592&semt=ais",
  role: 2344,
};

AvatarNavbar.propTypes = {
  username: PropTypes.string,
  role: PropTypes.number,
  avatar: PropTypes.string,
};

export default AvatarNavbar;
