# WorkflowStep

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `workflow_step`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/workflow_step`
- Resource path: `https://api.planningcenteronline.com/people/v2/workflows/{workflow_id}/steps`
- Collection only: `no`
- Deprecated: `no`


## Description

A Step


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| auto_snooze_days | integer (e.g. 1) | - | public |
| auto_snooze_interval | string (e.g. value) | Valid values are `day`, `week`, or `month`  Possible values: `day`, `week`, or `month` | public |
| auto_snooze_value | integer (e.g. 1) | Must be a positive number | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| default_assignee_id | primary_key (e.g. primary_key) | - | public |
| description | string (e.g. string) | - | public |
| expected_response_time_in_days | integer (e.g. 1) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| my_ready_card_count | integer (e.g. 1) | - | public |
| name | string (e.g. string) | - | public |
| sequence | integer (e.g. 1) | - | public |
| total_ready_card_count | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| default_assignee | default_assignee | - |
| workflow | workflow | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowstepassigneesummary-workflowstep-assignee_summaries | assignee_summaries | - |
| person-workflowstep-default_assignee | default_assignee | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowstep-workflowcard-current_step | current_step | - |
| workflowstep-workflow-steps | steps | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | default_assignee | include associated default_assignee |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
