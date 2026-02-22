# Person

- App: `current`
- Version: `2018-08-01`
- Vertex ID: `person`
- Endpoint: `https://api.planningcenteronline.com/current/v2/documentation/2018-08-01/vertices/person`
- Resource path: `https://api.planningcenteronline.com/current/v2/people`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| email | string (e.g. string) | - | public |
| first_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_name | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| organization-person-organization | organization | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-organization-people | people | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | organization | include associated organization |
