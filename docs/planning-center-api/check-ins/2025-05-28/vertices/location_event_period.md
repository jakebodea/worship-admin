# LocationEventPeriod

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `location_event_period`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/location_event_period`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/check_ins/{check_in_id}/event_period/{event_period_id}/location_event_periods`
- Collection only: `no`
- Deprecated: `no`


## Description

Counts check-ins for a location during a certain event period.


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
| checkin-locationeventperiod-check_ins | check_ins | - |
| eventperiod-locationeventperiod-event_period | event_period | - |
| location-locationeventperiod-location | location | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| locationeventperiod-eventperiod-location_event_periods | location_event_periods | - |
| locationeventperiod-location-location_event_periods | location_event_periods | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event_period | include associated event_period |
|  | location | include associated location |
