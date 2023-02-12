import { Box, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import Map, { 
    Marker,
    NavigationControl,
} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

const MapContainer = () => {
    const [viewport, setViewport] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 8,
    });

    const toast = useToast()

    const navigatorSuccess = (longitude: number, latitude: number) => 
    setViewport((viewPort) => ({
        ...viewPort,
        longitude,
        latitude,
    }))

    const navigatorError = (err: any) => {
        toast({
            title: `Access Denied`,
            description: `${err?.message}`,
            position: 'bottom-right',
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({
            coords: {longitude, latitude}
        }) => navigatorSuccess(longitude, latitude), navigatorError)
    }, [])

  return (
    <Box
        w={{base: '80vw', md: '70vw'}}
        h={{base: '100vh', md: '70vh'}}
    >
        <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            {...viewport}
            initialViewState={viewport}
            mapStyle={'mapbox://styles/mapbox/streets-v11'}
        >
            <Marker
                latitude={viewport.latitude}
                longitude={viewport.longitude}
                draggable
                onDragEnd={(e: any) =>
                    navigatorSuccess(e.lngLat.lng, e.lngLat.lat)
                }
            />
            <NavigationControl 
                position="top-right"
                showCompass={false}
                style={{
                    display: 'flex',
                }}
            />
        </Map>
    </Box>
  )
}

export {MapContainer}