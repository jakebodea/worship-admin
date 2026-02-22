# WorkflowShare

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `workflow_share`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/workflow_share`
- Resource path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_shares`
- Collection only: `no`
- Deprecated: `no`


## Description

A workflow share defines who can access a workflow.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| group | string (e.g. value) | Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` | public |
| id | primary_key (e.g. primary_key) | - | public |
| permission | string (e.g. value) | Possible values: `view`, `manage_cards`, or `manage` | public |
| person_id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| workflow | workflow | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-workflowshare-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowshare-person-workflow_shares | workflow_shares | - |
| workflowshare-workflow-shares | shares | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | permission | Query on a specific permission  Possible values: `view`, `manage_cards`, or `manage` |
