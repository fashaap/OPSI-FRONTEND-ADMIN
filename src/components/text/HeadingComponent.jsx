import PropTypes from "prop-types";

const HeadingComponent = (props) => {
  return <h1 className={`text-2xl font-${props.font}`}>{props.title}</h1>;
};

HeadingComponent.defaultProps = {
  title: "title",
  font: "bold",
};

HeadingComponent.propTypes = {
  title: PropTypes.string,
  font: PropTypes.string,
};

export default HeadingComponent;
