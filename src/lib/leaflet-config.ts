import L from "leaflet";

export const initializeLeafletIcons = () => {
  // Only run on client side
  if (typeof window === "undefined") return;

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "/pin.svg",
    iconRetinaUrl: "/pin.svg",
    shadowUrl: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
