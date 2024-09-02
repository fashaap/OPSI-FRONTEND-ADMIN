import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import iconPerson from "../../assets/icon/markerIcon.svg";
import { Link } from "react-router-dom";
import convertToDMS from "../../features/tracking/convertToDMS";
import { CgCopy } from "react-icons/cg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import AxiosInstance from "../../pages/auth/AxiosInstance";

import {
  FaClock,
  FaGlobeAmericas,
  FaGoogle,
  FaMapMarkerAlt,
  FaMapSigns,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";
import { IoIosSpeedometer } from "react-icons/io";

const MapComponent = ({ prms, idUser, lat, lng }) => {
  const [locationData, setLocationData] = useState([]);

  // Dummy history data
  // const dummyHistoryData = [
  //   {
  //     latitude: -6.9818007,
  //     longitude: 107.8290173,
  //     accuracy: 10,
  //     speed: 4,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  //   }, // 1 hari lalu
  //   {
  //     latitude: -6.9819,
  //     longitude: 107.8288,
  //     accuracy: 12,
  //     speed: 5,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
  //   }, // 23 jam lalu
  //   {
  //     latitude: -6.982,
  //     longitude: 107.8285,
  //     accuracy: 15,
  //     speed: 6,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  //   }, // 22 jam lalu
  //   {
  //     latitude: -6.9822,
  //     longitude: 107.8283,
  //     accuracy: 14,
  //     speed: 7,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
  //   }, // 21 jam lalu
  //   {
  //     latitude: -6.9824,
  //     longitude: 107.8281,
  //     accuracy: 18,
  //     speed: 6,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  //   }, // 20 jam lalu
  //   {
  //     latitude: -6.9826,
  //     longitude: 107.8279,
  //     accuracy: 20,
  //     speed: 5,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString(),
  //   }, // 19 jam lalu
  //   {
  //     latitude: -6.9828,
  //     longitude: 107.8277,
  //     accuracy: 22,
  //     speed: 4,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  //   }, // 18 jam lalu
  //   {
  //     latitude: -6.9829,
  //     longitude: 107.8275,
  //     accuracy: 24,
  //     speed: 5,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString(),
  //   }, // 17 jam lalu
  //   {
  //     latitude: -6.9831,
  //     longitude: 107.8273,
  //     accuracy: 26,
  //     speed: 6,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
  //   }, // 16 jam lalu
  //   {
  //     latitude: -6.9833,
  //     longitude: 107.8271,
  //     accuracy: 28,
  //     speed: 7,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
  //   }, // 15 jam lalu
  //   {
  //     latitude: -6.9835,
  //     longitude: 107.8269,
  //     accuracy: 30,
  //     speed: 8,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  //   }, // 14 jam lalu
  //   {
  //     latitude: -6.9837,
  //     longitude: 107.8267,
  //     accuracy: 32,
  //     speed: 9,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(),
  //   }, // 13 jam lalu
  //   {
  //     latitude: -6.9839,
  //     longitude: 107.8265,
  //     accuracy: 34,
  //     speed: 8,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  //   }, // 12 jam lalu
  //   {
  //     latitude: -6.9841,
  //     longitude: 107.8263,
  //     accuracy: 36,
  //     speed: 7,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
  //   }, // 11 jam lalu
  //   {
  //     latitude: -6.9843,
  //     longitude: 107.8261,
  //     accuracy: 38,
  //     speed: 6,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  //   }, // 10 jam lalu
  //   {
  //     latitude: -6.9845,
  //     longitude: 107.8259,
  //     accuracy: 40,
  //     speed: 5,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
  //   }, // 9 jam lalu
  //   {
  //     latitude: -6.9847,
  //     longitude: 107.8257,
  //     accuracy: 42,
  //     speed: 4,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  //   }, // 8 jam lalu
  //   {
  //     latitude: -6.9849,
  //     longitude: 107.8255,
  //     accuracy: 44,
  //     speed: 3,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  //   }, // 7 jam lalu
  //   {
  //     latitude: -6.9851,
  //     longitude: 107.8253,
  //     accuracy: 46,
  //     speed: 3,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  //   }, // 6 jam lalu
  //   {
  //     latitude: -6.9853,
  //     longitude: 107.8251,
  //     accuracy: 48,
  //     speed: 3,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  //   }, // 5 jam lalu
  //   {
  //     latitude: -6.9855,
  //     longitude: 107.8249,
  //     accuracy: 50,
  //     speed: 3,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  //   }, // 4 jam lalu
  //   {
  //     latitude: -6.9857,
  //     longitude: 107.8247,
  //     accuracy: 52,
  //     speed: 3,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  //   }, // 3 jam lalu
  //   {
  //     latitude: -6.9859,
  //     longitude: 107.8245,
  //     accuracy: 54,
  //     speed: 4,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  //   }, // 2 jam lalu
  //   {
  //     latitude: -6.9861,
  //     longitude: 107.8243,
  //     accuracy: 56,
  //     speed: 5,
  //     timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  //   }, // 1 jam lalu
  // ];

  const [historyData, setHistoryData] = useState([]);

  const fetchLocationHistory = async () => {
    const response = await AxiosInstance.get(
      `/api/v1/location-history?idUser=${idUser}`
    );

    // console.log(response.data.data);
    setHistoryData(response.data.data);
  };

  useEffect(() => {
    fetchLocationHistory();
  }, [idUser]);

  const fetchLocation = async () => {
    try {
      const url = prms ? `/api/v1/location/${idUser}` : `/api/v1/location`;
      const response = await AxiosInstance.get(url);
      if (response.status === 200) {
        const structure = idUser
          ? [response.data.data]
          : Object.values(response.data.data);
        setLocationData(structure);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [idUser, prms]);

  const markerIcon = new L.icon({
    iconUrl: iconPerson,
    iconSize: [32, 45],
    iconAnchor: [16, 45],
    popupAnchor: [0, -45],
  });

  const circleCenter = {
    lat: -6.9818007,
    lng: 107.8290173,
  };

  const circleRadius = 300; // Radius in meters

  const FitBounds = ({ locations }) => {
    const map = useMap();
    useEffect(() => {
      if (locations.length > 0) {
        const bounds = L.latLngBounds(
          locations.map((loc) => [loc.latitude, loc.longitude])
        );
        map.fitBounds(bounds);
      }
    }, [locations, map]);

    return null;
  };

  return (
    <>
      <MapContainer
        center={{ lat: lat || -6.979513, lng: lng || 107.8299131 }}
        zoom={10}
        scrollWheelZoom={true}
        className="h-[500px] rounded-lg shadow-lg"
      >
        <TileLayer
          attribution="© Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <FitBounds locations={locationData} />
        <Circle
          center={circleCenter}
          radius={circleRadius}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
        />

        {locationData.map((loc, index) => (
          <Marker
            icon={markerIcon}
            key={index}
            position={{ lat: loc.latitude, lng: loc.longitude }}
          >
            <Popup className="w-auto p-4 rounded-lg shadow-md bg-white">
              <div className="flex flex-col items-center text-center font-poppins">
                <div className="mb-4">
                  <div className="bg-neutral-800 text-neutral-content rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                    <img
                      src={loc.image}
                      className="rounded-full object-cover w-full h-full"
                      alt={loc.username}
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-semibold m-0 text-gray-900">
                    {loc.username}
                  </h1>
                  <h2 className="text-md font-semibold m-0 text-gray-700">
                    {loc.classGrade}
                  </h2>
                </div>
                <div className="text-md mt-4 text-gray-800">
                  <div className="flex flex-col gap-5">
                    {[
                      {
                        field: "idUser",
                        label: "User ID",
                        icon: <FaUser className="text-blue-500" />,
                      },
                      {
                        field: "idTicket",
                        label: "Ticket ID",
                        icon: <FaTicketAlt className="text-green-500" />,
                      },
                    ].map(({ field, label, icon }) => (
                      <div key={field} className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          {icon}
                          <h1 className="font-semibold text-md text-gray-800">
                            {label}: {loc[field]}
                          </h1>
                        </div>
                        <CopyToClipboard text={loc[field]}>
                          <button
                            onClick={() =>
                              toast.success(
                                `${label} ${loc[field]} telah disalin ke clipboard`,
                                {
                                  description: `${label} ${loc[field]} dengan nama pengguna ${loc.username} telah disalin`,
                                  position: "top-center",
                                }
                              )
                            }
                            className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none transition-colors"
                          >
                            <CgCopy className="text-gray-600" />
                          </button>
                        </CopyToClipboard>
                      </div>
                    ))}
                  </div>


                  <div className="text-center mt-5">
                    <h1 className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="font-semibold">Location:</span>{" "}
                      {convertToDMS(loc.latitude, loc.longitude)}
                    </h1>
                    <h1 className="flex items-center gap-2 mt-2">
                      <FaGlobeAmericas className="text-green-500" />
                      <span className="font-semibold">Latitude:</span>{" "}
                      {loc.latitude}
                    </h1>
                    <h1 className="flex items-center gap-2 mt-2">
                      <FaMapSigns className="text-blue-500" />
                      <span className="font-semibold">Longitude:</span>{" "}
                      {loc.longitude}
                    </h1>
                    <h1 className="flex items-center gap-2 mt-2">
                      <IoIosSpeedometer className="text-yellow-500" />
                      <span className="font-semibold">Speed:</span> {loc.speed}{" "}
                      km/h
                    </h1>
                    <h1 className="flex items-center gap-2 mt-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="font-semibold">Accuracy:</span>{" "}
                      {loc.accuracy} meters
                    </h1>
                    <h1 className="flex items-center gap-2 mt-2">
                      <FaClock className="text-gray-500" />
                      <span className="font-semibold">Timestamp:</span>{" "}
                      {new Date(loc.timestamp).toLocaleString()}
                    </h1>
                  </div>
                </div>
                {!prms && (
                  <div className="mt-5">
                    <Link
                      className="btn bg-[#014B7C] btn-sm hover:bg-[#013a65] transition-colors"
                      to={`/monitoring/user/ticket/${loc.idTicket}/${loc.idUser}`}
                    >
                      <span className="text-white">Lihat Detail</span>
                    </Link>
                  </div>
                )}
              </div>
              <span className="flex items-center justify-center mt-5">
                <a
                  className="flex items-center gap-2 px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors shadow-sm"
                  href={`https://www.google.com/maps/place/${convertToDMS(
                    loc.latitude,
                    loc.longitude
                  )}/@${loc.latitude},${loc.longitude},70m/data=!3m2!1e3!4b1`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGoogle className="text-lg text-gray-600" />
                  <h1 className="text-gray-800">Lihat lokasi di Google Maps</h1>
                </a>
              </span>
            </Popup>
          </Marker>
        ))}

        {/* Render history polyline */}
        <Polyline
          positions={historyData.map((loc) => [loc.latitude, loc.longitude])}
          color="red"
          weight={4}
          opacity={0.5}
        />
      </MapContainer>
      <Toaster closeButton richColors />
    </>
  );
};

export default MapComponent;
