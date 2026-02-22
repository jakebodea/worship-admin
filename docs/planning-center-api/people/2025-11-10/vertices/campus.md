# Campus

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `campus`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/campus`
- Resource path: `https://api.planningcenteronline.com/people/v2/campuses`
- Collection only: `no`
- Deprecated: `no`


## Description

A Campus is a location belonging to an Organization


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| avatar_url | string (e.g. string) | - | public |
| church_center_enabled | boolean (e.g. True) | - | public |
| city | string (e.g. string) | - | public |
| contact_email_address | string (e.g. string) | - | public |
| country | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| date_format | integer (e.g. 1) | - | public |
| description | string (e.g. string) | - | public |
| geolocation_set_manually | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| latitude | float (e.g. 1.42) | - | public |
| longitude | float (e.g. 1.42) | - | public |
| name | string (e.g. string) | - | public |
| phone_number | string (e.g. string) | - | public |
| state | string (e.g. string) | - | public |
| street | string (e.g. string) | - | public |
| time_zone | string (e.g. string) | - | public |
| time_zone_raw | string (e.g. string) | Only available when requested with the `?fields` param | public |
| twenty_four_hour_time | boolean (e.g. True) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| website | string (e.g. string) | - | public |
| zip | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| organization | organization | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| list-campus-lists | lists | - |
| servicetime-campus-service_times | service_times | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-form-campus | campus | - |
| campus-list-campus | campus | - |
| campus-organization-campuses | campuses | - |
| campus-person-primary_campus | primary_campus | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | lists | include associated lists |
|  | service_times | include associated service_times |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | id | Query on a specific id |
|  | updated_at | Query on a specific updated_at |
