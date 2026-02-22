# EventTime

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `event_time`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/event_time`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/event_times`
- Collection only: `no`
- Deprecated: `no`


## Description

A time that someone may check in. Times are copied from session to session.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| day_of_week | integer (e.g. 1) | - | public |
| guest_count | integer (e.g. 1) | - | public |
| hides_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| hour | integer (e.g. 1) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| minute | integer (e.g. 1) | - | public |
| name | string (e.g. string) | - | public |
| regular_count | integer (e.g. 1) | - | public |
| shows_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| total_count | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| volunteer_count | integer (e.g. 1) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |
| event_period | event_period | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| location-eventtime-available_locations | available_locations | - |
| checkin-eventtime-check_ins | check_ins | - |
| event-eventtime-event | event | - |
| eventperiod-eventtime-event_period | event_period | - |
| headcount-eventtime-headcounts | headcounts | - |
| locationeventtime-eventtime-location_event_times | location_event_times | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventtime-checkin-event_times | event_times | - |
| eventtime-event-current_event_times | current_event_times | - |
| eventtime-eventperiod-event_times | event_times | - |
| eventtime-headcount-event_time | event_time | - |
| eventtime-locationeventtime-event_time | event_time | - |
| eventtime-organization-event_times | event_times | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |
|  | event_period | include associated event_period |
|  | headcounts | include associated headcounts |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | shows_at | prefix with a hyphen (-shows_at) to reverse the order |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | updated_at | Query on a specific updated_at |
