import {useState} from "react"
import ReactMapGL, { Marker } from 'react-map-gl';

export default function MyMap() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 23.7338028,
    longitude: 90.3814551,
    zoom: 12
  });
    const [markerCoord, setMarkerCoord] = useState([90.3814551, 23.7338028])

    function handleCoordinates(e) {
        console.log(e.lngLat)
        setMarkerCoord(e.lngLat)
    }

    const marker = (
        <Marker 
            latitude={markerCoord[1]} 
            longitude={markerCoord[0]}
        >
            marker
        </Marker>
    )
    
    return (
        <div>
            <ReactMapGL
          {...viewport}
          mapboxApiAccessToken="access token"
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapStyle="mapbox://styles/mostafij163/cksalt6m652ig17qpge35l96v"
                onClick={handleCoordinates}
            >
                {
                    marker
                }
        </ReactMapGL>
        </div>
  );
}