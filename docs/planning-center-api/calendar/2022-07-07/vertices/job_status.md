# JobStatus

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `job_status`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/job_status`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/job_statuses`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| errors | json (e.g. {}) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| message | string (e.g. string) | - | public |
| retries | integer (e.g. 1) | - | public |
| started_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| status | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| jobstatus-organization-job_statuses | job_statuses | - |
