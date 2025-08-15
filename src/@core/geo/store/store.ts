import {makeObservable} from "mobx"
import {TOptional} from "@core/main/types"
import {TGeoCoords} from "@core/geo/types"
import {services} from "~services";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates"
import * as Location from "expo-location"
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {Task, task} from "@core/main/lib/decorator/task";
import {GeoObject} from "~gql/api";
import {LocationAccuracy} from "expo-location";
import sleep from "@core/main/util/base/sleep";

export class GeoStore extends CommonStore {
    constructor() {
        super()
        makeObservable(this)
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
    }

    @task
    locationByCoords = (async (coords: TGeoCoords) => {

        const _coords = new GeoCoordinates(coords)
        try {
            const {data} = await services.graphql.query({
                query: require('../gql/query/geocoder_locations_by_coords').default,
                fetchPolicy: 'no-cache',
                variables: {
                    lat: _coords.lat,
                    lon: _coords.lon,
                }
            })
            if (data.res)
                return data.res[0]
        } catch (e) {
            console.log(e)
        }
        return null
    }) as Task<[TGeoCoords], GeoObject | null>

    @task
    getLocationCoords = (async () => {

        await sleep(200)

        let {status} = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            this.stores().debug.warn('Geo location coordinates rejected')
            return
        }

        let location = await Location.getCurrentPositionAsync({
            accuracy: LocationAccuracy.BestForNavigation
        });

        this.stores().debug.info('Geo location coordinates resolved', {location})

        if (location) {
            return new GeoCoordinates({
                lat: location.coords.latitude,
                lon: location.coords.longitude
            })
        }
    }) as Task<[], Promise<TOptional<GeoCoordinates>> | null>

}


export default GeoStore
