# SongbookStatus

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `songbook_status`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/songbook_status`
- Resource path: `https://api.planningcenteronline.com/services/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

Used to get the status of an in progress songbook action. When FINISHED, will contain the url of the songbook.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| status | string (e.g. string) | - | public |
| status_code | string (e.g. string) | - | public |
| status_token | string (e.g. string) | - | public |
| url | string (e.g. string) | - | public |
