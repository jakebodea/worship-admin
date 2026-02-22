# Campus

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `campus`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/campus`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/campuses`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Campus` is a location belonging to an Organization.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | Name of the campus. | public |
| street | string (e.g. string) | Street address of the campus. | public |
| city | string (e.g. string) | City where the campus is located. | public |
| state | string (e.g. string) | State or province where the campus is located. | public |
| zip | string (e.g. string) | Zip code of the campus. | public |
| country | string (e.g. string) | Country where the campus is located. | public |
| full_formatted_address | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-organization-campuses | campuses | - |
| campus-signup-campuses | campuses | - |
