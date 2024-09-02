const convertToDMS = (lat, lng) => {
  const toDMS = (coord) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
    return `${degrees}°${minutes}'${seconds}"`;
  };

  const latitude = toDMS(lat);
  const latitudeCardinal = lat >= 0 ? "N" : "S";

  const longitude = toDMS(lng);
  const longitudeCardinal = lng >= 0 ? "E" : "W";

  return `${latitude}${latitudeCardinal} ${longitude}${longitudeCardinal}`;
};

export default convertToDMS;
