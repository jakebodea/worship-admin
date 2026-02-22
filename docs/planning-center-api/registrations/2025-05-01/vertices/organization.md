# Organization

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/registrations/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

The root level `Organization` record which serves as a link to `Signup`s.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | Name of the Organization. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-organization-campuses | campuses | - |
| category-organization-categories | categories | - |
| signup-organization-signups | signups | - |
