# CheckInGroup

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `check_in_group`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/check_in_group`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/stations/{station_id}/check_in_groups`
- Collection only: `no`
- Deprecated: `no`


## Description

When one or more people check in, they're grouped in a `CheckInGroup`.
These check-ins all have the same "checked-in by" person.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| check_ins_count | integer (e.g. 1) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name_labels_count | integer (e.g. 1) | - | public |
| print_status | string (e.g. string) | Possible values:   - `ready`: This group isn't printed or canceled yet   - `printed`: This group was successfully printed at a station   - `canceled`: This group was canceled at a station   - `skipped`: This group had no labels to print, so it was never printed. | public |
| security_labels_count | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkin-checkingroup-check_ins | check_ins | - |
| eventperiod-checkingroup-event_period | event_period | - |
| station-checkingroup-print_station | print_station | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkingroup-checkin-check_in_group | check_in_group | - |
| checkingroup-station-check_in_groups | check_in_groups | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | check_ins | include associated check_ins |
|  | event_period | include associated event_period |
|  | print_station | include associated print_station |
