import React, { useState } from 'react'
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api'

const MapWithDirections = () => {
  const [directions, setDirections] = useState(null)

  const waypoints = [
    { location: 'Hoiana, Viet Nam' },
    { location: 'Hoi An, Viet Nam' },
    { location: 'Da Nang, VietNam' },
  ]

  const origin = waypoints.shift().location
  const destination = waypoints.pop().location

  const directionsOptions = {
    origin: origin,
    destination: destination,
    waypoints: waypoints,
    travelMode: 'DRIVING',
  }

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response)
      } else {
        console.error('Directions request failed:', response)
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        zoom={7}
        center={{ lat: 41.85, lng: -87.65 }}
      >
        <DirectionsService
          options={directionsOptions}
          callback={directionsCallback}
        />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  )
}

export default MapWithDirections
