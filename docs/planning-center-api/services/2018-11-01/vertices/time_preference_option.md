# TimePreferenceOption

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `time_preference_option`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/time_preference_option`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/time_preference_options`
- Collection only: `no`
- Deprecated: `no`


## Description

A Service Time a person prefers to be scheduled to.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| day_of_week | integer (e.g. 1) | - | public |
| description | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| minute_of_day | integer (e.g. 1) | 0 for 12:00 am, 1 for 12:01 am, 100 for 1:00 am, through 2359 for 11:59pm | public |
| sort_index | string (e.g. string) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| time_type | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| timepreferenceoption-servicetype-time_preference_options | time_preference_options | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | day_of_week | prefix with a hyphen (-day_of_week) to reverse the order |
|  | hour_of_day | prefix with a hyphen (-hour_of_day) to reverse the order |
