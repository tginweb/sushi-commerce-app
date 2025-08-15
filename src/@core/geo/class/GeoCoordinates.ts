import {TGeoCoords, TGeoCoordsArray, TGeoCoordsData, TGeoCoordsDir} from "@core/geo/types";
import {LatLng} from "react-native-maps/lib/sharedTypes";

export class GeoCoordinates {

    lat: number // широта 52.273566
    lon: number // долгота 104.311535
    constructor(
        data: TGeoCoordsData | GeoCoordinates,
        dir: TGeoCoordsDir = 'longlat'
    ) {

        let _data

        if (typeof data === 'string') {
            _data = data.trim().split(/[^\d\.]+/)
        } else {
            _data = data
        }

        if (Array.isArray(_data)) {
            if (dir === 'longlat') {
                this.lon = typeof _data[0] === 'string' ? parseFloat(_data[0]) : _data[0]
                this.lat = typeof _data[1] === 'string' ? parseFloat(_data[1]) : _data[1]
            } else {
                this.lat = typeof _data[0] === 'string' ? parseFloat(_data[0]) : _data[0]
                this.lon = typeof _data[1] === 'string' ? parseFloat(_data[1]) : _data[1]
            }
        } else if ('lat' in _data) {
            this.lat = _data.lat
            this.lon = _data.lon
        } else if ('LAT' in _data) {
            this.lat = _data.LAT
            this.lon = _data.LON
        } else {
            this.lat = 0
            this.lon = 0
        }
    }

    isValid(): boolean {
        return !!this.lat && !!this.lon
    }

    getGoogleData(): LatLng {
        return this.getPositionObject(true)
    }

    getPositionObject(fullName = false): any {
        return fullName ? {
            latitude: this.lat,
            longitude: this.lon,
        } : {
            lat: this.lat,
            lon: this.lon,
        }
    }

    getArray(dir: TGeoCoordsDir = 'longlat'): TGeoCoordsArray {
        return dir === 'longlat' ? [this.lon, this.lat] : [this.lat, this.lon]
    }

    getString(dir: TGeoCoordsDir = 'longlat'): TGeoCoordsData {
        return (dir === 'longlat' ? [this.lon, this.lat] : [this.lat, this.lon]).join(':')
    }

    static toObject(data: TGeoCoords): GeoCoordinates {
        if (data instanceof GeoCoordinates)
            return data
        return new GeoCoordinates(data)
    }
}
