import PropTypes from "prop-types";

const BiodataComponent = (props) => {
  return (
    <span className="flex flex-col">
      <h1 className="font-bold">{props.name}</h1>
      <h1>
        {props.className} | {props.nisn}
      </h1>
    </span>
  );
};

BiodataComponent.defaultProps = {
  name: "nama kamu disini",
  className: "kelas kamu disini",
  nisn: 0,
};

BiodataComponent.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  nisn: PropTypes.number,
};

export default BiodataComponent;
