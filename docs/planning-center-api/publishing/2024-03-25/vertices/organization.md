# Organization

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/publishing/v2`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| downloads_used | integer (e.g. 1) | Only available when requested with the `?fields` param | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| subdomain | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| channel-organization-channels | channels | - |
| episode-organization-episodes | episodes | - |
| series-organization-series | series | - |
| speaker-organization-speakers | speakers | - |
