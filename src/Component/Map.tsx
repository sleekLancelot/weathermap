import { Box, useToast } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { 
    Marker,
    NavigationControl,
} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { cities } from '../constant';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

const MapContainer = () => {
    const [viewport, setViewport] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 8,
    });

    const toast = useToast()

    const navigatorSuccess = (longitude: number, latitude: number) => {
        setViewport((viewPort) => ({
            ...viewPort,
            longitude,
            latitude,
        }))

        return mapRef.current.flyTo({
            center: [longitude, latitude],
        })
    }

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

    // useEffect(() => {
    //     navigator.geolocation.getCurrentPosition(({
    //         coords: {longitude, latitude}
    //     }) => navigatorSuccess(longitude, latitude), navigatorError)
    // }, [])

    const mapRef = useRef<any>();

    const onMapLoad = useCallback(() => {
        navigator.geolocation.getCurrentPosition(({
            coords: {longitude, latitude}
        }) => navigatorSuccess(longitude, latitude), navigatorError)
        // mapRef.current.on('move', () => {
            
        // });
    }, []);

    const markers = useMemo(() => cities.map((city,index) => (
        <Marker key={index}
            longitude={city.longitude}
            latitude={city.latitude}>
        </Marker>)
    ), [cities]);

  return (
    <Box
        w={{base: '80vw', md: '70vw'}}
        h={{base: '100vh', md: '70vh'}}
    >
        <Map
            ref={mapRef}
            onLoad={onMapLoad}
            mapboxAccessToken={MAPBOX_TOKEN}
            {...viewport}
            initialViewState={viewport}
            mapStyle={'mapbox://styles/mapbox/streets-v11'}
            onDrag={(newViewport: any) =>{
                setViewport( prev => ({
                    ...prev,
                    ...newViewport?.viewState
                }))
            }}
        >
            {/* <Marker
                latitude={viewport.latitude}
                longitude={viewport.longitude}
                draggable
                onDragEnd={(e: any) =>
                    navigatorSuccess(e.lngLat.lng, e.lngLat.lat)
                }
                // onDrag={(newViewport: any) =>{
                //     setViewport( prev => ({
                //         ...prev,
                //         ...newViewport?.viewState
                //     }))
                // }}
            /> */}
            {markers}
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