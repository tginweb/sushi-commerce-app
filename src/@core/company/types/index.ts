import {TGeoMarker} from "@core/geo/types";
import {CompanyOfficeModel} from "@core/company/model/CompanyOffice";
import {UiListItemProps} from "~ui/list-item";
import {ImageSourcePropType} from "react-native";

export type TOfficeView = TGeoMarker<CompanyOfficeModel> & {
    type: 'office'
}

export type TOfficeDetailView = TOfficeView & {
    fields: UiListItemProps[]
    gallery: ImageSourcePropType[]
}
