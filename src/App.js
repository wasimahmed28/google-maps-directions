import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  img,
  Input,
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
import { useRef, useState } from 'react'
const center = { lat: 48.8584, lng: 2.2945 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
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
      position='relative'
      flexDirection='column'
      alignItems='center'
      backgroundColor='#F4F8FA'
      h='100vh'
      w='100%'
    >
      <Box
        position='relative'
        top='0'
        left='0'
        width='100%'
        height='100px'
        backgroundColor='white'
       >
       <img src="/gl.png" alt="Logo" style={{ position:'relative', left:80, top:15, }}  />
        </Box> 
      
        <Box
        position='relative'
        top='10'
        left='800'
        width='100%'
        height='100px'
        color='#1B31A8'
        fontWeight='00'
        fontSize='20px'
       
       >
    Let's calculate <span style={{fontWeight:700}}>distance</span> from Google maps
        </Box> 
     <Box
  position="fixed"
  bottom={200}
  right={250}
  height="100%"
  width="fit-content"
  display="flex"
  justifyContent="flex-end"
  alignItems="flex-end"
>

  {/* Google Map Box */}
  <div style={{ boxShadow: '0 0 10px 10px rgba(0, 0, 0, 0.2)' }}>
  <GoogleMap
    center={center}
    zoom={15}
    mapContainerStyle={{ width: '560px', height: '511px' }}
    options={{
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    }}
    onLoad={map => setMap(map)}
  >
    <Marker position={center} />
    {directionsResponse && (
      <DirectionsRenderer directions={directionsResponse} />
    )}
  </GoogleMap>
</div>

</Box>

<Box
 position="fixed"
 top={200}
 left={250}
  p={4}
  borderRadius='lg'
  m={4}
  bgColor='transparent'
  
  minW='fit-content'
  zIndex='1'
>
  <Box mb={4}>
    <p> Origin</p>
    <Autocomplete>
      <Input type='text' placeholder='' ref={originRef} background='white'/>
    </Autocomplete>
  </Box>
  
  <Box mb={4}>
  <p> Destination</p>
    <Autocomplete>
      <Input type='text' placeholder='' ref={destiantionRef} background='white' />
    </Autocomplete>
  </Box>
  <ButtonGroup mb={4}>
    
    <IconButton
      aria-label='center back'
      icon={<FaTimes />}
      onClick={clearRoute}
    />
     <IconButton
    aria-label='center back'
    icon={<FaLocationArrow />}
    isRound
    onClick={() => {
      map.panTo(center);
      map.setZoom(15);
    }}
  />
  </ButtonGroup>
  <Box mb={8} background='white' paddingInline="30px">
  <Text fontSize='20px' fontWeight="500" >Distance:  <span style={{color
  :"0079FF", fontSize:"30px", margin: "40px", fontWeight:"700" }}>{distance}</span></Text>
</Box>
<Box mb={4} background='white'>
  <Text fontSize='16px'>Duration: {duration}</Text>
</Box>
<Box  position="fixed">
{distance && duration && (
        <div>
          The distance between <span style={{fontWeight:700}}>{originRef.current.value}</span> and <br/> <span style={{fontWeight:700}}>{destiantionRef.current.value}</span> via the selected route is <span style={{fontWeight:700}}>{distance}</span>.
        </div>
      )}
      </Box>
</Box>

<Button backgroundColor='#1B31A8' color='white' borderRadius='55px' fontSize="18px" padding="35px" type='submit' position="fixed" top={300} left={700} onClick={calculateRoute} _hover={{ backgroundColor: '#8AB4F8' }}>
  Calculate
</Button>

    </Flex>
  )
}

export default App
