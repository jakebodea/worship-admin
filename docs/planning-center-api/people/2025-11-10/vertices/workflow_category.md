# WorkflowCategory

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `workflow_category`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/workflow_category`
- Resource path: `https://api.planningcenteronline.com/people/v2/workflows/{workflow_id}/category`
- Collection only: `no`
- Deprecated: `no`


## Description

A Workflow Category


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowcategory-workflow-category | category | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
