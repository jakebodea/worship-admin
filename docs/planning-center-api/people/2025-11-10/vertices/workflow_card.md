# WorkflowCard

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `workflow_card`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/workflow_card`
- Resource path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards`
- Collection only: `no`
- Deprecated: `no`


## Description

A Card


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| go_back | https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/go_back | Move a Workflow Card back to the previous step. | - | no |
| promote | https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/promote | Move a Workflow Card to the next step. | - | no |
| remove | https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/remove | Removes a card | - | no |
| restore | https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/restore | Restore a card | - | no |
| send_email | https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/send_email | Sends an email to the subject of the card | - | no |
| skip_step | https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/skip_step | Move a Workflow Card to the next step without completing the current step. | - | no |
| snooze | https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/snooze | Snoozes a card for a specific duration | - | no |
| unsnooze | https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/unsnooze | Unsnoozes a card | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| calculated_due_at_in_days_ago | integer (e.g. 1) | - | public |
| completed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| flagged_for_notification_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| moved_to_step_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| overdue | boolean (e.g. True) | - | public |
| removed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| snooze_until | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| stage | string (e.g. string) | - | public |
| sticky_assignment | boolean (e.g. True) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| assignee | assignee | - |
| person | person | - |
| workflow | workflow | - |
| current_step | current_step | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowcardactivity-workflowcard-activities | activities | - |
| person-workflowcard-assignee | assignee | - |
| workflowstep-workflowcard-current_step | current_step | - |
| workflowcardnote-workflowcard-notes | notes | - |
| person-workflowcard-person | person | - |
| workflow-workflowcard-workflow | workflow | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowcard-person-workflow_cards | workflow_cards | - |
| workflowcard-workflow-cards | cards | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | assignee | include associated assignee |
|  | current_step | include associated current_step |
|  | person | include associated person |
|  | workflow | include associated workflow |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | completed_at | prefix with a hyphen (-completed_at) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | flagged_for_notification_at | prefix with a hyphen (-flagged_for_notification_at) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
|  | moved_to_step_at | prefix with a hyphen (-moved_to_step_at) to reverse the order |
|  | removed_at | prefix with a hyphen (-removed_at) to reverse the order |
|  | stage | prefix with a hyphen (-stage) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | assignee_id | Query on a related assignee |
|  | overdue | Query on a specific overdue |
|  | stage | Query on a specific stage |


## Examples

### Example 1: send_email
- Path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/send_email`
```json
{
  "data": {
    "attributes": {
      "note": "It was great to meet you this past Sunday! Hope to see you again.",
      "subject": "Thanks for visiting this past Sunday!"
    }
  }
}
```

### Example 2: snooze
- Path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/workflow_cards/{workflow_card_id}/snooze`
```json
{
  "data": {
    "attributes": {
      "duration": 15
    }
  }
}
```
