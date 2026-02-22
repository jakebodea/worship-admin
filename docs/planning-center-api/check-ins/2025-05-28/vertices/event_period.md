# EventPeriod

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `event_period`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/event_period`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/check_ins/{check_in_id}/event_period`
- Collection only: `no`
- Deprecated: `no`


## Description

A recurrence of an event, sometimes called a "session".
For weekly events, an event period is a week. For daily events, an event period is a day.
An event period has event times, which is what people select
when they actually check in. When new sessions are created, times
are copied from one session to the next.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| guest_count | integer (e.g. 1) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| note | string (e.g. string) | - | public |
| regular_count | integer (e.g. 1) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| volunteer_count | integer (e.g. 1) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkin-eventperiod-check_ins | check_ins | - |
| event-eventperiod-event | event | - |
| eventtime-eventperiod-event_times | event_times | - |
| locationeventperiod-eventperiod-location_event_periods | location_event_periods | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventperiod-checkin-event_period | event_period | - |
| eventperiod-checkingroup-event_period | event_period | - |
| eventperiod-event-event_periods | event_periods | - |
| eventperiod-eventtime-event_period | event_period | - |
| eventperiod-locationeventperiod-event_period | event_period | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |
|  | event_times | include associated event_times |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ends_at | Query on a specific ends_at |
|  | starts_at | Query on a specific starts_at |
