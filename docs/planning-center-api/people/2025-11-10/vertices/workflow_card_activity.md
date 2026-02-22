# WorkflowCardActivity

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `workflow_card_activity`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/workflow_card_activity`
- Resource path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/activities`
- Collection only: `no`
- Deprecated: `no`


## Description

Workflow Card Activity is a record of an action performed on a card


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| automation_url | string (e.g. string) | - | public |
| comment | string (e.g. string) | - | public |
| content | string (e.g. string) | - | public |
| content_is_html | boolean (e.g. True) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| form_submission_url | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| person_avatar_url | string (e.g. string) | - | public |
| person_name | string (e.g. string) | - | public |
| reassigned_to_avatar_url | string (e.g. string) | - | public |
| reassigned_to_name | string (e.g. string) | - | public |
| subject | string (e.g. string) | - | public |
| type | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| workflow_card | workflow_card | - |
| workflow_step | workflow_step | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowcardactivity-workflowcard-activities | activities | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | prefix with a hyphen (-id) to reverse the order |
