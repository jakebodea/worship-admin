# Workflow

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `workflow`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/workflow`
- Resource path: `https://api.planningcenteronline.com/people/v2/workflows`
- Collection only: `no`
- Deprecated: `no`


## Description

A Workflow


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| archived_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| campus_id | primary_key (e.g. primary_key) | - | public |
| completed_card_count | integer (e.g. 1) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| deleted_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| my_due_soon_card_count | integer (e.g. 1) | Only available when requested with the `?fields` param | public |
| my_overdue_card_count | integer (e.g. 1) | Only available when requested with the `?fields` param | public |
| my_ready_card_count | integer (e.g. 1) | - | public |
| name | string (e.g. string) | - | public |
| recently_viewed | boolean (e.g. True) | - | public |
| total_cards_count | integer (e.g. 1) | - | public |
| total_overdue_card_count | integer (e.g. 1) | - | public |
| total_ready_and_snoozed_card_count | integer (e.g. 1) | - | public |
| total_ready_card_count | integer (e.g. 1) | - | public |
| total_steps_count | integer (e.g. 1) | - | public |
| total_unassigned_card_count | integer (e.g. 1) | - | public |
| total_unassigned_steps_count | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| workflow_category_id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| workflow_category | workflow_category | - |
| campus | campus | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflowcard-workflow-cards | cards | - |
| workflowcategory-workflow-category | category | - |
| person-workflow-shared_people | shared_people | - |
| workflowshare-workflow-shares | shares | - |
| workflowstep-workflow-steps | steps | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| workflow-organization-workflows | workflows | - |
| workflow-workflowcard-workflow | workflow | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | category | include associated category |
|  | shares | include associated shares |
|  | steps | include associated steps |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | archived_at | prefix with a hyphen (-archived_at) to reverse the order |
|  | campus_id | prefix with a hyphen (-campus_id) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | deleted_at | prefix with a hyphen (-deleted_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
|  | workflow_category_id | prefix with a hyphen (-workflow_category_id) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | archived_at | Query on a specific archived_at |
|  | campus_id | Query on a specific campus_id |
|  | created_at | Query on a specific created_at |
|  | deleted_at | Query on a specific deleted_at |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
|  | workflow_category_id | Query on a specific workflow_category_id |
