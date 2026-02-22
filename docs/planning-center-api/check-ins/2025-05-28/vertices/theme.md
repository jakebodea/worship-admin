# Theme

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `theme`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/theme`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/themes`
- Collection only: `no`
- Deprecated: `no`


## Description

A custom style which may be applied to stations.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| background_color | string (e.g. string) | - | public |
| color | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| image | string (e.g. string) | - | public |
| image_thumbnail | string (e.g. string) | - | public |
| mode | string (e.g. string) | - | public |
| name | string (e.g. string) | - | public |
| text_color | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| theme-organization-themes | themes | - |
| theme-station-theme | theme | - |
