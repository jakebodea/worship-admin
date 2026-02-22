# Location

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `location`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/location`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/check_ins/{check_in_id}/locations`
- Collection only: `no`
- Deprecated: `no`


## Description

A place where people may check in to for a given event.
Some locations have `kind="Folder"`, which means that people
can't check-in here, but this location contains other locations.
You can get its contents from the `locations` attribute.
You can get a location's parent folder from the `parent` attribute.
(If it's not in a folder, `parent` will be empty.)


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| age_max_in_months | integer (e.g. 1) | - | public |
| age_min_in_months | integer (e.g. 1) | - | public |
| age_on | date (e.g. 2000-01-01) | - | public |
| age_range_by | string (e.g. string) | - | public |
| attendees_per_volunteer | integer (e.g. 1) | - | public |
| child_or_adult | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| effective_date | date (e.g. 2000-01-01) | - | public |
| gender | string (e.g. string) | - | public |
| grade_max | integer (e.g. 1) | - | public |
| grade_min | integer (e.g. 1) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. string) | - | public |
| max_occupancy | integer (e.g. 1) | - | public |
| milestone | string (e.g. string) | - | public |
| min_volunteers | integer (e.g. 1) | - | public |
| name | string (e.g. string) | - | public |
| opened | boolean (e.g. True) | - | public |
| position | integer (e.g. 1) | - | public |
| questions | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| parent | parent | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkin-location-check_ins | check_ins | - |
| event-location-event | event | - |
| integrationlink-location-integration_links | integration_links | - |
| locationeventperiod-location-location_event_periods | location_event_periods | - |
| locationeventtime-location-location_event_times | location_event_times | - |
| locationlabel-location-location_labels | location_labels | - |
| location-location-locations | locations | - |
| option-location-options | options | - |
| location-location-parent | parent | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| location-checkin-locations | locations | - |
| location-event-locations | locations | - |
| location-eventtime-available_locations | available_locations | - |
| location-locationeventperiod-location | location | - |
| location-locationeventtime-location | location | - |
| location-locationlabel-location | location | - |
| location-location-locations | locations | - |
| location-location-parent | parent | - |
| location-station-location | location | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |
|  | locations | include associated locations |
|  | options | include associated options |
|  | parent | include associated parent |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | kind | prefix with a hyphen (-kind) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | position | prefix with a hyphen (-position) to reverse the order |
