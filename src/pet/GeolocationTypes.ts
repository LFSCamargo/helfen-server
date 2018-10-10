export interface GeoLocation {
    Response: Response;
}
interface Response {
    MetaInfo: MetaInfo;
    View: ViewItem[];
}
interface MetaInfo {
    Timestamp: string;
}
interface ViewItem {
    _type: string;
    ViewId: number;
    Result: ResultItem[];
}
interface ResultItem {
    Relevance: number;
    MatchLevel: string;
    MatchQuality: MatchQuality;
    MatchType: string;
    Location: Location;
}
interface MatchQuality {
    District: number;
    Street: number[];
    HouseNumber: number;
}
interface Location {
    LocationId: string;
    LocationType: string;
    DisplayPosition: DisplayPosition;
    NavigationPosition: NavigationPositionItem[];
    MapView: MapView;
    Address: Address;
}
interface DisplayPosition {
    Latitude: number;
    Longitude: number;
}
interface NavigationPositionItem {
    Latitude: number;
    Longitude: number;
}
interface MapView {
    TopLeft: TopLeft;
    BottomRight: BottomRight;
}
interface TopLeft {
    Latitude: number;
    Longitude: number;
}
interface BottomRight {
    Latitude: number;
    Longitude: number;
}
interface Address {
    Label: string;
    Country: string;
    State: string;
    City: string;
    District: string;
    Street: string;
    HouseNumber: string;
    PostalCode: string;
    AdditionalData: AdditionalDataItem[];
}
interface AdditionalDataItem {
    value: string;
    key: string;
}
