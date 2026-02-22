# ConnectedApplicationPerson

- App: `api`
- Version: `2025-09-30`
- Vertex ID: `connected_application_person`
- Endpoint: `https://api.planningcenteronline.com/api/v2/documentation/2025-09-30/vertices/connected_application_person`
- Resource path: `https://api.planningcenteronline.com/api/v2/connected_applications/{connected_application_id}/people`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| avatar_url | string (e.g. string) | - | public |
| connected_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| first_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_name | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| connectedapplicationperson-connectedapplication-people | people | - |
