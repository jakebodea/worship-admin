# WorkflowStepAssigneeSummary

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `workflow_step_assignee_summary`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/workflow_step_assignee_summary`
- Resource path: `https://api.planningcenteronline.com/people/v2/workflows/{workflow_id}/steps/{step_id}/assignee_summaries`
- Collection only: `no`
- Deprecated: `no`


## Description

The ready and snoozed count for an assignee & step


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| ready_count | integer (e.g. 1) | - | public |
| snoozed_count | integer (e.g. 1) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| step | step | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-workflowstepassigneesummary-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowstepassigneesummary-workflowstep-assignee_summaries | assignee_summaries | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |
