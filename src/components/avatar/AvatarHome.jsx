import PropTypes from "prop-types";

const AvatarHome = (props) => {
  return (
    <img
      className="bg-neutral text-neutral-content rounded-full sm:w-7 sm:h-7 w-10 xl:w-10 xl:h-10"
      src={props.url}
      alt={props.alt}
    />
  );
};

AvatarHome.defaultProps = {
  url: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg&ga=GA1.1.545745486.1710488592&semt=ais",
  alt: "avatar-default",
};

AvatarHome.propTypes = {
  url: PropTypes.string,
  alt: PropTypes.string,
};

export default AvatarHome;
