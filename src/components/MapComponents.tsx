import React, { useState } from 'react'
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api'

const containerStyle = {
  width: '800px',
  height: '600px',
}

const center = {
  lat: 15.83226,
  lng: 108.40632,
}

const MapComponent = () => {
  const [response, setResponse] = useState(null)

  return (
    <LoadScript
      // googleMapsApiKey="AIzaSyAgfBxBAvW9QUFfrUbqu-f3HTuRYG0j3wE" // Config to env
      googleMapsApiKey=""
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={20}>
        <DirectionsService
          options={{
            destination: 'Hoiana Resolf & Golf, VietNam',
            origin: 'Quang Nam, VietNam',
            travelMode: 'DRIVING',
          }}
          // callback={directionsCallback}
        />
        {response !== null && (
          <DirectionsRenderer
            options={{
              directions: response,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  )
}

export default MapComponent
