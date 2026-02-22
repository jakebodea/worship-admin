# Report

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `report`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/report`
- Resource path: `https://api.planningcenteronline.com/people/v2/reports`
- Collection only: `no`
- Deprecated: `no`


## Description

A report is editable liquid syntax that provides a powerful tool for presenting your Lists however you want.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| body | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-report-created_by | created_by | - |
| person-report-updated_by | updated_by | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| report-organization-reports | reports | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_by | include associated created_by |
|  | updated_by | include associated updated_by |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | body | prefix with a hyphen (-body) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | body | Query on a specific body |
|  | created_at | Query on a specific created_at |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
