# WorkflowCardNote

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `workflow_card_note`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/workflow_card_note`
- Resource path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/notes`
- Collection only: `no`
- Deprecated: `no`


## Description

Workflow Note is a note that has been made on a Workflow Card


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| note | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowcardnote-workflowcard-notes | notes | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
