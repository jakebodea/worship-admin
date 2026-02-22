# PlanNoteCategory

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `plan_note_category`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/plan_note_category`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plan_note_categories`
- Collection only: `no`
- Deprecated: `no`


## Description

A category of plan notes for an entire Service Type.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| deleted_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| sequence | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| service_type | service_type | - |
| teams | teams | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plannotecategory-plannote-plan_note_category | plan_note_category | - |
| plannotecategory-servicetype-plan_note_categories | plan_note_categories | - |
