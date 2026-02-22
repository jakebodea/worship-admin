# PlanPerson

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `plan_person`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/plan_person`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/plan_people`
- Collection only: `no`
- Deprecated: `no`


## Description

A person scheduled within a specific plan.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| can_accept_partial | boolean (e.g. True) | If the person is scheduled to a split team where they could potentially accept 1 time and decline another. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| decline_reason | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| notes | string (e.g. string) | - | public |
| notification_changed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| notification_changed_by_name | string (e.g. string) | - | public |
| notification_prepared_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| notification_read_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| notification_sender_name | string (e.g. string) | - | public |
| notification_sent_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| photo_thumbnail | string (e.g. string) | - | public |
| prepare_notification | boolean (e.g. True) | - | public |
| scheduled_by_is_eligible_for_responds_to | boolean (e.g. True) | Only available when requested with the `?fields` param | public |
| scheduled_by_name | string (e.g. string) | Only available when requested with the `?fields` param | public |
| status | string (e.g. string) | Accepts one of 'C', 'U', 'D', or 'Confirmed', 'Unconfirmed', or 'Declined' | public |
| status_updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| team_position_name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| plan | plan | - |
| scheduled_by | scheduled_by | - |
| service_type | service_type | - |
| team | team | - |
| responds_to | responds_to | - |
| times | times | - |
| service_times | service_times | - |
| time_preference_options | time_preference_options | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plantime-planperson-declined_plan_times | declined_plan_times | - |
| person-planperson-person | person | - |
| plan-planperson-plan | plan | - |
| planpersontime-planperson-plan_person_times | plan_person_times | - |
| plantime-planperson-plan_times | plan_times | - |
| team-planperson-team | team | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| planperson-person-plan_people | plan_people | - |
| planperson-plan-team_members | team_members | - |
| planperson-plantemplate-team_members | team_members | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | declined_plan_times | include associated declined_plan_times |
|  | person | include associated person |
|  | plan | include associated plan |
|  | team | include associated team |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | team_id | Query on a related team |
