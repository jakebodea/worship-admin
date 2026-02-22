# PlanNote

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `plan_note`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/plan_note`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plan_templates/{plan_template_id}/notes`
- Collection only: `no`
- Deprecated: `no`


## Description

A specific plan note within a single plan.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| category_name | string (e.g. string) | - | public |
| content | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| created_by | created_by | - |
| plan_note_category | plan_note_category | - |
| teams | teams | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plannotecategory-plannote-plan_note_category | plan_note_category | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plannote-plan-notes | notes | - |
| plannote-plantemplate-notes | notes | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | plan_note_category | include associated plan_note_category |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | updated_at | Query on a specific updated_at |
