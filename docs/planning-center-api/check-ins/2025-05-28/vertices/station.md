# Station

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `station`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/station`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/stations`
- Collection only: `no`
- Deprecated: `no`


## Description

A device where people can be checked in.
A device may also be connected to a printer
and print labels for itself or other stations.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| check_in_count | integer (e.g. 1) | Only available when requested with the `?fields` param | public |
| closes_at | date_time (e.g. 2000-01-01T12:00:00Z) | Only available when requested with the `?fields` param | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| input_type | string (e.g. value) | Possible values: `scanner` or `keypad` | public |
| input_type_options | string (e.g. value) | Possible values: `all_input_types`, `only_keypad`, or `only_scanner` | public |
| mode | integer (e.g. 1) | - | public |
| name | string (e.g. string) | - | public |
| next_shows_at | date_time (e.g. 2000-01-01T12:00:00Z) | Only available when requested with the `?fields` param | public |
| online | boolean (e.g. True) | Only available when requested with the `?fields` param | public |
| open_for_check_in | boolean (e.g. True) | Only available when requested with the `?fields` param | public |
| timeout_seconds | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkingroup-station-check_in_groups | check_in_groups | - |
| checkin-station-checked_in_at_check_ins | checked_in_at_check_ins | - |
| event-station-event | event | - |
| location-station-location | location | - |
| station-station-print_station | print_station | - |
| theme-station-theme | theme | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| station-checkin-checked_in_at | checked_in_at | - |
| station-checkingroup-print_station | print_station | - |
| station-organization-stations | stations | - |
| station-station-print_station | print_station | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |
|  | location | include associated location |
|  | print_station | include associated print_station |
|  | theme | include associated theme |
