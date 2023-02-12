import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useControl } from 'react-map-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { cities } from '../constant';

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
            return (
                // i.id.split('.').shift() === 'region' &&
                cities?.some( city => (
                    i.text?.toLowerCase() === city?.name?.toLowerCase() ||
                    i.text?.toLowerCase() === city?.country?.toLowerCase()
                ) )
            );
        });
    }
  });
  useControl(() => ctrl);
  ctrl.on('result', (e: any) => {
    const coords = e.result.geometry.coordinates;

    navigateTo( coords[0],  coords[1])
  });
  return null;
}

export {Geocoder}