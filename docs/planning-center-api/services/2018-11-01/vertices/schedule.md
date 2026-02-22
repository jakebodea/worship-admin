# Schedule

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `schedule`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/schedule`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/schedules`
- Collection only: `no`
- Deprecated: `no`


## Description

An instance of a PlanPerson with included data for displaying in a user's schedule


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| accept | https://api.planningcenteronline.com/services/v2/people/{person_id}/schedules/{schedule_id}/accept | Accept a Schedule | - | no |
| decline | https://api.planningcenteronline.com/services/v2/people/{person_id}/schedules/{schedule_id}/decline | Decline a Schedule | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| can_accept_partial | boolean (e.g. True) | - | public |
| can_accept_partial_one_time | boolean (e.g. True) | - | public |
| can_rehearse | boolean (e.g. True) | - | public |
| dates | string (e.g. string) | - | public |
| decline_reason | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| organization_name | string (e.g. string) | - | public |
| organization_time_zone | string (e.g. string) | - | public |
| organization_twenty_four_hour_time | string (e.g. string) | - | public |
| person_name | string (e.g. string) | - | public |
| plan_visible | boolean (e.g. True) | True if the scheduled Plan is visible to the scheduled Person | public |
| plan_visible_to_me | boolean (e.g. True) | True if the scheduled Plan is visible to the current Person | public |
| position_display_times | string (e.g. string) | - | public |
| responds_to_name | string (e.g. string) | - | public |
| service_type_name | string (e.g. string) | - | public |
| short_dates | string (e.g. string) | - | public |
| sort_date | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| status | string (e.g. string) | - | public |
| team_name | string (e.g. string) | - | public |
| team_position_name | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| service_type | service_type | - |
| organization | organization | - |
| plan_person | plan_person | - |
| plan | plan | - |
| team | team | - |
| responds_to_person | responds_to_person | - |
| times | times | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plantime-schedule-declined_plan_times | declined_plan_times | - |
| plantime-schedule-plan_times | plan_times | - |
| person-schedule-respond_to | respond_to | - |
| team-schedule-team | team | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| schedule-person-schedules | schedules | - |
| schedule-plan-my_schedules | my_schedules | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | plan_times | include associated plan_times |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | plan_id | Query on a related plan |
