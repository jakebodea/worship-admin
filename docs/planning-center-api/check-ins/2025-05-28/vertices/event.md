# Event

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `event`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/event`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/events`
- Collection only: `no`
- Deprecated: `no`


## Description

A recurring event which people may attend.

Each recurrence is an _event period_ (which often corresponds to a week).

Event periods have _event times_ where people may actually check in.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| app_source | string (e.g. string) | Only available when requested with the `?fields` param | public |
| archived_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| enable_services_integration | boolean (e.g. True) | - | public |
| frequency | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| integration_key | string (e.g. string) | - | public |
| location_times_enabled | boolean (e.g. True) | - | public |
| name | string (e.g. string) | - | public |
| pre_select_enabled | boolean (e.g. True) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| campuses | campuses | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attendancetype-event-attendance_types | attendance_types | - |
| checkin-event-check_ins | check_ins | - |
| eventtime-event-current_event_times | current_event_times | - |
| eventlabel-event-event_labels | event_labels | - |
| eventperiod-event-event_periods | event_periods | - |
| integrationlink-event-integration_links | integration_links | - |
| location-event-locations | locations | - |
| personevent-event-person_events | person_events | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-attendancetype-event | event | - |
| event-checkin-event | event | - |
| event-eventlabel-event | event | - |
| event-eventperiod-event | event | - |
| event-eventtime-event | event | - |
| event-location-event | event | - |
| event-organization-events | events | - |
| event-personevent-event | event | - |
| event-station-event | event | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | attendance_types | include associated attendance_types |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
