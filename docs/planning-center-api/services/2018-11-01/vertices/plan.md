# Plan

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `plan`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/plan`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plans`
- Collection only: `no`
- Deprecated: `no`


## Description

A single plan within a Service Type.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| autoschedule | https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plans/{plan_id}/autoschedule | Auto-schedule for a team. Returns a collection of scheduled `PlanPersonAutoscheduleVertex` | - | no |
| import_template | https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plans/{plan_id}/import_template | Import template to plan | - | yes |
| item_reorder | https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plans/{plan_id}/item_reorder | Reorder plan items in one request. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| can_view_order | boolean (e.g. True) | - | current_person |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| dates | string (e.g. string) | The full date string representing all Service Time dates. | public |
| files_expire_at | date_time (e.g. 2000-01-01T12:00:00Z) | A date 15 days after the last service time. ___Returns in the time zone specified in your organization's localization settings___ | public |
| id | primary_key (e.g. primary_key) | - | public |
| items_count | integer (e.g. 1) | The total number of items, including regular items, songs, media, and headers, that the current user can see in the plan. | current_person |
| last_time_at | date_time (e.g. 2000-01-01T12:00:00Z) | ___Returns in the time zone specified in your organization's localization settings___ | public |
| multi_day | boolean (e.g. True) | - | public |
| needed_positions_count | integer (e.g. 1) | - | public |
| other_time_count | integer (e.g. 1) | - | public |
| permissions | string (e.g. string) | The current user's permissions for this plan's Service Type. | current_person |
| plan_notes_count | integer (e.g. 1) | - | public |
| plan_people_count | integer (e.g. 1) | - | public |
| planning_center_url | string (e.g. string) | - | public |
| prefers_order_view | boolean (e.g. True) | - | current_person |
| public | boolean (e.g. True) | True if Public Access has been enabled. | public |
| rehearsable | boolean (e.g. True) | - | current_person |
| rehearsal_time_count | integer (e.g. 1) | - | public |
| reminders_disabled | boolean (e.g. True) | - | service_type_scheduler |
| series_title | string (e.g. string) | - | public |
| service_time_count | integer (e.g. 1) | - | public |
| short_dates | string (e.g. string) | The shortened date string representing all Service Time dates. Months are abbreviated, and the year is omitted. | public |
| sort_date | date_time (e.g. 2000-01-01T12:00:00Z) | A time representing the chronological first Service Time, used to sort plan chronologically. If no Service Times exist, it uses Rehearsal Times, then Other Times, then NOW. ___Returns in the time zone specified in your organization's localization settings___ | public |
| title | string (e.g. string) | - | public |
| total_length | integer (e.g. 1) | The total of length of all items, excluding pre-service and post-service items. | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| service_type | service_type | - |
| previous_plan | previous_plan | - |
| next_plan | next_plan | - |
| series | series | - |
| created_by | created_by | - |
| updated_by | updated_by | - |
| linked_publishing_episode | linked_publishing_episode | - |
| attachment_types | attachment_types | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-plan-all_attachments | all_attachments | - |
| attachment-plan-attachments | attachments | - |
| attendance-plan-attendances | attendances | - |
| contributor-plan-contributors | contributors | - |
| item-plan-items | items | - |
| live-plan-live | live | - |
| schedule-plan-my_schedules | my_schedules | - |
| neededposition-plan-needed_positions | needed_positions | - |
| plan-plan-next_plan | next_plan | - |
| plannote-plan-notes | notes | - |
| plantime-plan-plan_times | plan_times | - |
| plan-plan-previous_plan | previous_plan | - |
| series-plan-series | series | - |
| team-plan-signup_teams | signup_teams | - |
| planperson-plan-team_members | team_members | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plan-live-watchable_plans | watchable_plans | - |
| plan-plan-next_plan | next_plan | - |
| plan-planperson-plan | plan | - |
| plan-plan-previous_plan | previous_plan | - |
| plan-series-plans | plans | - |
| plan-servicetype-plans | plans | - |
| plan-servicetype-unscoped_plans | unscoped_plans | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | contributors | include associated contributors |
|  | my_schedules | include associated my_schedules |
|  | plan_times | include associated plan_times |
|  | series | include associated series |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | sort_date | prefix with a hyphen (-sort_date) to reverse the order |
|  | title | prefix with a hyphen (-title) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | id | Query on a specific id |
|  | series_title | Query on a specific series_title |
|  | title | Query on a specific title |
|  | updated_at | Query on a specific updated_at |
