# PlanPersonTime

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `plan_person_time`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/plan_person_time`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/plan_people/{plan_person_id}/plan_person_times`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| status | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| plan_time | plan_time | - |
| plan | plan | - |
| plan_person | plan_person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| planpersontime-planperson-plan_person_times | plan_person_times | - |
