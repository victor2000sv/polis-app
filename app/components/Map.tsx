import { Cluster, Coordinate, Event } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleProp, Text, View, ViewStyle } from "react-native";
import MapView, { MapMarker, Marker, Region } from "react-native-maps";

export default function Map({
  events,
  initialRegion,
  onSelect,
  classList,
}: {
  events: Event[];
  initialRegion: Region;
  onSelect: (event: Event[]) => void;
  classList: StyleProp<ViewStyle>;
}) {
  const { width: deviceWidth, height: deviceHeight } = Dimensions.get("screen");

  const [markers, setMarkers] = useState<Cluster[]>([]);
  const [z, setZ] = useState(0);
  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);

  const mapRef = useRef<MapView | null>(null);

  function getDistance(from: Coordinate, to: Coordinate): number {
    const { latitude: lat1, longitude: lon1 } = from;
    const { latitude: lat2, longitude: lon2 } = to;

    const radLat1 = (Math.PI * lat1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;

    const theta = lon1 - lon2;
    const radTheta = (Math.PI * theta) / 180;

    let dist =
      Math.sin(radLat1) * Math.sin(radLat2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515; // Convert to miles
    dist = dist * 1.609344; // Convert to km

    return dist;
  }

  function getClusterCenter(markers: Event[]): Coordinate {
    const numMarkers = markers.length;
    const sumLat = markers.reduce(
      (sum, marker) => sum + parseFloat(marker.latitude),
      0
    );
    const sumLon = markers.reduce(
      (sum, marker) => sum + parseFloat(marker.longitude),
      0
    );

    return {
      latitude: sumLat / numMarkers,
      longitude: sumLon / numMarkers,
    };
  }

  function getZoomThreshold(zoom: number) {
    if (zoom < 0.65) return 10;
    else if (zoom < 0.74) return 50;
    else if (zoom < 0.76) return 150;
    else return 500;
  }

  function clusterMarkers(markers: Event[], zoom: number) {
    const clusteredMarkers: Cluster[] = [];

    const zoomThreshold = getZoomThreshold(zoom);

    const clusterRadius = zoom * zoomThreshold;

    markers.forEach((marker) => {
      let clusterFound = false;

      clusteredMarkers.forEach((cluster, i) => {
        const cord = {
          latitude: parseFloat(marker.latitude),
          longitude: parseFloat(marker.longitude),
        };
        if (getDistance(cluster.center, cord) < clusterRadius) {
          cluster.markers.push(marker);
          cluster.center = getClusterCenter(cluster.markers);
          clusterFound = true;
        }
      });

      if (!clusterFound) {
        clusteredMarkers.push({
          center: {
            latitude: parseFloat(marker.latitude),
            longitude: parseFloat(marker.longitude),
          },
          markers: [marker],
        });
      }
    });

    return clusteredMarkers;
  }

  async function onRegionChange(region: Region) {
    let zoom = Math.log2(360 / region.longitudeDelta);

    zoom > 20 ? (zoom = 20) : zoom;

    const revertedZoom = 1 - zoom / 20;

    setZ(revertedZoom);
    setCurrentRegion(region);

    const newClusters = clusterMarkers(events, revertedZoom);

    setMarkers(newClusters);
  }

  function selectMarker(events: Event[]) {
    if (
      events.filter(
        (event) =>
          event.latitude == events[0].latitude &&
          event.longitude == events[0].longitude
      ).length == events.length ||
      events.length == 1
    ) {
      zoomToCoordinates(
        parseFloat(events[0].latitude),
        parseFloat(events[0].longitude)
      );

      onSelect(events);
    } else {
      mapRef.current?.fitToCoordinates(
        events.map((event) => ({
          latitude: parseFloat(event.latitude),
          longitude: parseFloat(event.longitude),
        }))
      );
    }
  }

  function zoomToCoordinates(lat: number, lon: number) {
    const newRegion: Region = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapRef.current?.animateToRegion(newRegion);
    setCurrentRegion(newRegion);
  }

  useEffect(() => {
    onRegionChange(initialRegion);
    if (events.length == 1) {
      zoomToCoordinates(
        parseFloat(events[0].latitude),
        parseFloat(events[0].longitude)
      );
    }
  }, [events]);

  return (
    <MapView
      style={classList}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsPointsOfInterest={false}
      mapType="mutedStandard"
      onRegionChangeComplete={onRegionChange}
      ref={mapRef}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: marker.center.latitude,
            longitude: marker.center.longitude,
          }}
          onPress={() => {
            selectMarker(marker.markers);
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: 38,
              width: 30,
            }}
          >
            <View style={{ position: "absolute", bottom: 0 }}>
              <FontAwesome5 name="map-marker" size={38} color="#2c2c2c" />
              <View
                style={{
                  width: 22,
                  height: 22,
                  position: "absolute",
                  backgroundColor: "#fff",
                  borderRadius: 500,
                  top: 3,
                  left: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {marker.markers.length}
                </Text>
              </View>
            </View>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}
