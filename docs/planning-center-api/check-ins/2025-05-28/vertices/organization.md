# Organization

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

An organization which has people and events.
This contains its date format & time zone preferences.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| avatar_url | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| daily_check_ins | integer (e.g. 1) | - | public |
| date_format_pattern | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| time_zone | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkin-organization-check_ins | check_ins | - |
| eventtime-organization-event_times | event_times | - |
| event-organization-events | events | - |
| headcount-organization-headcounts | headcounts | - |
| integrationlink-organization-integration_links | integration_links | - |
| label-organization-labels | labels | - |
| option-organization-options | options | - |
| pass-organization-passes | passes | - |
| person-organization-people | people | - |
| station-organization-stations | stations | - |
| theme-organization-themes | themes | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| organization-person-organization | organization | - |
