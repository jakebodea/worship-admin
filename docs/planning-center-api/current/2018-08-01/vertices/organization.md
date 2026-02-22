# Organization

- App: `current`
- Version: `2018-08-01`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/current/v2/documentation/2018-08-01/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/current/v2`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| subdomain | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-organization-people | people | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| organization-person-organization | organization | - |
