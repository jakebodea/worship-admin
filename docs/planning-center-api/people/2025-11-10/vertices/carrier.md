# Carrier

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `carrier`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/carrier`
- Resource path: `https://api.planningcenteronline.com/people/v2/carriers`
- Collection only: `yes`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| international | boolean (e.g. True) | - | public |
| name | string (e.g. string) | - | public |
| value | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| carrier-organization-carriers | carriers | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | international | prefix with a hyphen (-international) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
