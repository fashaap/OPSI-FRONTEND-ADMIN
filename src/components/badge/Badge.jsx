import PropTypes from "prop-types";

const Badge = (props) => {
  const { data } = props;

  const getBadgeType = () => {
    const badgeData = data;

    switch (badgeData) {
      case 7010:
        return (
          <div className={"badge bg-[#BEE0FF] rounded-xl h-7 w-20"}>
            <p className={"text-[#014B7C] font-bold"}>Dispen</p>
          </div>
        );
      case 7020:
        return (
          <div className={"badge bg-[#ffe7c4] rounded-xl h-7 w-20"}>
            <p className={"text-[#FFA700] font-bold"}>Izin</p>
          </div>
        );
      case 7030:
        return (
          <div className={"badge bg-[#9ec9a7] rounded-xl h-7 w-20 "}>
            <p className={"text-[#1c4d27] font-bold"}>Pulang</p>
          </div>
        );
      default:
        return null;
    }
  };

  return <>{getBadgeType()}</>;
};

Badge.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Badge;
