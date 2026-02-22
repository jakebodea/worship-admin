# LocationEventTime

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `location_event_time`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/location_event_time`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/event_times/{event_time_id}/location_event_times`
- Collection only: `no`
- Deprecated: `no`


## Description

Counts check-ins for a location for a given event time.
This is useful for checking occupancy.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| guest_count | integer (e.g. 1) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| regular_count | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| volunteer_count | integer (e.g. 1) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkin-locationeventtime-check_ins | check_ins | - |
| eventtime-locationeventtime-event_time | event_time | - |
| location-locationeventtime-location | location | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| locationeventtime-eventtime-location_event_times | location_event_times | - |
| locationeventtime-location-location_event_times | location_event_times | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event_time | include associated event_time |
|  | location | include associated location |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | updated_at | Query on a specific updated_at |
