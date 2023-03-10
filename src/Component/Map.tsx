import { Box, Divider, Tag, Text, useToast, VStack, chakra, HStack } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { 
    Marker,
    NavigationControl,
    Popup,
} from 'react-map-gl'
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { cities } from '../constant';
import { Geocoder } from './Geocoder';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

interface CityProp {
    name: string,
    code: string,
    latitude: number,
    longitude: number,
}

const MapContainer = ({selectedCity}: {
    selectedCity: CityProp
}) => {
    const [viewport, setViewport] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 8,
    });
    const [popupInfo, setPopupInfo] = useState<CityProp | any>({});
    const [weatherDetails, setWeatherDetails] = useState(null);
    const [apiResponse, setApiResponse] = useState({
        status: false,
        message: '',
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

    useEffect(() => {
        if ('latitude' in selectedCity && 'longitude' in selectedCity) {
            navigatorSuccess(selectedCity?.longitude, selectedCity?.latitude)            
        }
    }, [selectedCity])

    const mapRef = useRef<any>();

    const onMapLoad = useCallback(() => {
        navigator.geolocation.getCurrentPosition(({
            coords: {longitude, latitude}
        }) => navigatorSuccess(longitude, latitude), navigatorError)
        
        mapRef.current.on('zoomend', (event: any) => {
            setViewport((prevViewport) => ({
              ...prevViewport,
              zoom: event.target.getZoom(),
            }));
        });
    }, []);

    const markers = useMemo(() => cities.map((city,index) => (
        <Marker
            key={index}
            longitude={city.longitude}
            latitude={city.latitude}
            onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo(() => city);
            }}
        >
        </Marker>)
    ), [cities]);

  return (
    <Box
        mt={10}
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
            {markers}
            <NavigationControl 
                position="top-right"
                showCompass={false}
                style={{
                    display: 'flex',
                }}
            />
            <Geocoder navigateTo={navigatorSuccess} />
            {
                popupInfo?.latitude !== undefined &&
                popupInfo?.longitude !== undefined &&
                <Popup
                    anchor="top"
                    longitude={Number(popupInfo?.longitude)}
                    latitude={Number(popupInfo?.latitude)}
                    onClose={() => setPopupInfo(() => {})}
                >
                    <Box
                        w={220}
                        h={200}
                        borderRadius={30}
                    >
                        <VStack spacing={4}>
                            <chakra.h2
                                width={'100%'}
                                color={'#000'}
                                display={'flex'}
                                justifyContent={'left'}
                                fontSize={22}
                                px={4}
                                pb={2}
                                borderBottom={'1px solid black'}
                            >{popupInfo?.name}</chakra.h2>
                            <HStack spacing={4}>
                                <Text
                                    color={'teal'}
                                >lat: {popupInfo?.latitude}</Text>
                                <Divider color={'black'} fontSize={14} orientation='vertical' />
                                <Text
                                    color={'teal'}
                                >long: {popupInfo?.longitude}</Text>
                            </HStack>
                        </VStack>
                    </Box>
                </Popup>
            }
        </Map>
    </Box>
  )
}

export {MapContainer}