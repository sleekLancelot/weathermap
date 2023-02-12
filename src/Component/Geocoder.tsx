import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from "mapbox-gl";

import { useControl } from 'react-map-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { cities } from '../constant';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_TOKEN: any = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

const Geocoder = ({navigateTo}: {
    navigateTo: Function
}) => {
  const ctrl = new MapBoxGeocoder({
    accessToken: MAPBOX_TOKEN,
    marker: false,
    collapsed: true,

    filter: (item) => {
        return item.context.some((i) => {
            // console.log(i, cities?.some( city => (
            //     i.text?.toLowerCase() === city?.name?.toLowerCase() ||
            //     i.text?.toLowerCase() === city?.country?.toLowerCase()
            // ) ))

            return (
                (i.id.split('.').shift() === 'region' ||
                i.id.split('.').shift() === 'country') &&
                cities?.some( city => (
                    i.text?.toLowerCase() === city?.name?.toLowerCase() ||
                    i.text?.toLowerCase() === city?.country?.toLowerCase()
                ) )
            );
        });
    }
  });
  useControl(() => ctrl, {position: 'top-left'});
  ctrl.on('result', (e: any) => {
    const coords = e.result.geometry.coordinates;

    navigateTo( coords[0],  coords[1])
  });
  return null;
}

export {Geocoder}