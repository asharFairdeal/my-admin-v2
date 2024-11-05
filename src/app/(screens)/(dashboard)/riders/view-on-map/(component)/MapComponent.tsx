"use client";
import L from "leaflet";
import { useEffect, useRef } from "react";

const RiderOnMapComponent = ({ data, selectedRider }: any) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const customIcon = L.icon({
    iconUrl: "/location-pin.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const selectedIcon = L.icon({
    iconUrl: "/selected-location-pin.png", // Ensure you have this icon for selected riders
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const initializeMap = () => {
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([28.4865, 77.0869], 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMapRef.current);
    }
  };

  const updateMapMarkers = () => {
    if (!leafletMapRef.current) return; // Ensure the map is initialized

    // Remove existing markers
    markersRef.current.forEach(marker => leafletMapRef.current!.removeLayer(marker));
    markersRef.current = [];

    let selectedMarker: L.Marker | null = null; // To hold the selected marker

    data.forEach((rider : any) => {
      if (rider.latestLocation?.coordinates) {
        const [lng, lat] = rider.latestLocation.coordinates;

        const isSelected = selectedRider?._id === rider._id; // Check if this rider is selected
        const marker = L.marker([lat, lng], { icon: isSelected ? selectedIcon : customIcon })
          .addTo(leafletMapRef.current!)
          .bindPopup(`<b>${rider.name}</b><br>Contact: ${rider.contact}`); // Display rider name and contact

        markersRef.current.push(marker);

        // If the rider is selected, center the map on their location and save the marker
        if (isSelected) {
          leafletMapRef.current!.setView([lat, lng], 15); // Center on selected rider
          selectedMarker = marker; // Store the selected marker
        }
      }
    });

    // Open popup for the selected rider marker if it exists
    // if (selectedMarker) {
    //   selectedMarker.openPopup();
    // }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeMap();
      updateMapMarkers();
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [data, selectedRider]); // Update when data or selectedRider changes

  return <div ref={mapRef} className="h-full w-full" />;
};

export default RiderOnMapComponent;
