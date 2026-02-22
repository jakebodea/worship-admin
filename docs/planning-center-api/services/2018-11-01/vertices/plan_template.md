# PlanTemplate

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `plan_template`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/plan_template`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plan_templates`
- Collection only: `no`
- Deprecated: `no`


## Description

A PlanTemplate Resource


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| item_reorder | https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plan_templates/{plan_template_id}/item_reorder | Reorder plan template items in one request. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| can_view_order | boolean (e.g. True) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| item_count | integer (e.g. 1) | - | public |
| multi_day | boolean (e.g. True) | - | public |
| name | string (e.g. string) | - | public |
| note_count | integer (e.g. 1) | - | public |
| prefers_order_view | boolean (e.g. True) | - | current_person |
| rehearsable | boolean (e.g. True) | - | public |
| team_count | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| service_type | service_type | - |
| created_by | created_by | - |
| updated_by | updated_by | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| item-plantemplate-items | items | - |
| plannote-plantemplate-notes | notes | - |
| planperson-plantemplate-team_members | team_members | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plantemplate-servicetype-plan_templates | plan_templates | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | item_count | prefix with a hyphen (-item_count) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | note_count | prefix with a hyphen (-note_count) to reverse the order |
|  | team_count | prefix with a hyphen (-team_count) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
