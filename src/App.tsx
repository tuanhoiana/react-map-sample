import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useEffect, useRef, useState } from 'react'
import { getHistory, getRealtime } from './services/api'

const center = { lat: 16.05435, lng: 108.20848 } // Get lat and lang from realtime API

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCrXHAD0DsyKqm-5uP7_Hi4t9yWMhyqe2g', // Config to env
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ null)
  
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()
  const [histories, setHistories] = useState([])
  const [realtime, setRealtime] = useState([])

  // Call api history
  useEffect(() => {
    const fetchHistories = async () => {
      const data = await getHistory()
      console.log('log2', data.result.routes[0])
      setHistories(data)
    }

    fetchHistories()
  }, [])

  // Call api realtime 
  useEffect(() => { // TODO: try catch error
    const fetchRealtime = async () => {
      console.log('realtime')
      const data = await getRealtime()
      console.log("logggg2", data)
      setRealtime(data)
    }

    fetchRealtime()
  }, [])

  if (!isLoaded) {
    return <SkeletonText />
  }

  // Prepare bus stops - Fake datas
  const busStops = [
    {
      location:
        'Bệnh Viện Phụ Sản - Nhi Đà Nẵng, Đường Lê Văn Hiến, Khuê Mỹ, Ngũ Hành Sơn, Da Nang, Vietnam',
    },
    {
      location:
        'Trường Đại học Kiến trúc Đà Nẵng, Núi Thành, Hòa Cường, Hòa Cường Nam, Hải Châu District, Da Nang, Vietnam',
    },
    {
      location:
        'Bệnh Viện Quân Y C17, Nguyễn Hữu Thọ, Hòa Thuận Tây, Hải Châu District, Da Nang, Vietnam',
    },
  ]

  // Calculate route
  const handleCalculateAndDisplayRoute = async () => {
    if (originRef.current === null || destiantionRef.current === null) {
      return
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value, // Start point
      waypoints: busStops,
      destination: destiantionRef.current.value, // End point
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    console.log('myResult', results)
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration?.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={20}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
           )} 
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="1"
      >
        <Select placeholder="Choose route" mb={15}>
          <option value="hoianaToDaNang">Hoiana - Da Nang</option>
          <option value="hoianaToTamKy">Hoiana - Tam Ky</option>
          <option value="hoianaToHoiAn">Hoiana - Hoi An</option>
        </Select>
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Origin - Realtime"
                ref={originRef}
              />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination - Bus stop"
                ref={destiantionRef}
              />
              {/* <Select placeholder="Distination - Bus stop">
                {busStops.map((busStop, index) => (
                <option key={index} value={busStop.location}>
                    {busStop.location}
                  </option>
                ))} */}
              {/* </Select> */}
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button
              colorScheme="blue"
              type="submit"
              onClick={handleCalculateAndDisplayRoute}
            >
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(20)
            }}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
