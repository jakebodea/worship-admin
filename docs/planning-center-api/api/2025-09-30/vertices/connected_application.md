# ConnectedApplication

- App: `api`
- Version: `2025-09-30`
- Vertex ID: `connected_application`
- Endpoint: `https://api.planningcenteronline.com/api/v2/documentation/2025-09-30/vertices/connected_application`
- Resource path: `https://api.planningcenteronline.com/api/v2/connected_applications`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| description | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| url | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| connectedapplicationperson-connectedapplication-people | people | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| connectedapplication-organization-connected_applications | connected_applications | - |
