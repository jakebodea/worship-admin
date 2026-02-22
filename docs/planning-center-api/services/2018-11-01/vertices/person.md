# Person

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `person`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/person`
- Resource path: `https://api.planningcenteronline.com/services/v2/people`
- Collection only: `no`
- Deprecated: `no`


## Description

A person added to Planning Center Services.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| assign_tags | https://api.planningcenteronline.com/services/v2/people/{person_id}/assign_tags | Used to assign tags to a person. | - | no |
| collapse_service_types | https://api.planningcenteronline.com/services/v2/people/{person_id}/collapse_service_types | Used to set Service Types as collapsed for the Person | - | no |
| expand_service_types | https://api.planningcenteronline.com/services/v2/people/{person_id}/expand_service_types | Used to set Service Types as expanded for the Person | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| access_media_attachments | boolean (e.g. True) | - | scheduler_or_current |
| access_plan_attachments | boolean (e.g. True) | - | scheduler_or_current |
| access_song_attachments | boolean (e.g. True) | - | scheduler_or_current |
| anniversary | date_time (e.g. 2000-01-01T12:00:00Z) | - | viewable_by_me |
| archived | boolean (e.g. True) | - | scheduler |
| archived_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| assigned_to_rehearsal_team | boolean (e.g. True) | - | public |
| birthdate | date_time (e.g. 2000-01-01T12:00:00Z) | - | viewable_by_me |
| can_edit_all_people | boolean (e.g. True) | - | current |
| can_view_all_people | boolean (e.g. True) | - | current |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| facebook_id | primary_key (e.g. primary_key) | DEPRECATED: this attribute will be removed in the next release and will return the string "DEPRECATED" in this version | viewer_or_current |
| first_name | string (e.g. string) | - | public |
| full_name | string (e.g. string) | - | viewer_or_current |
| given_name | string (e.g. string) | - | viewer_or_current |
| ical_code | string (e.g. string) | - | scheduler_or_current |
| id | primary_key (e.g. primary_key) | - | public |
| last_name | string (e.g. string) | - | public |
| legacy_id | primary_key (e.g. primary_key) | If you've used Person.id from API v1 this attribute can be used to map from those old IDs to the new IDs used in API v2 | public |
| logged_in_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | scheduler |
| max_permissions | string (e.g. string) | - | viewer_or_current |
| max_plan_permissions | string (e.g. string) | - | viewer_or_current |
| me_tab | string (e.g. string) | - | current |
| media_permissions | string (e.g. string) | - | viewer_or_current |
| media_tab | string (e.g. string) | - | current |
| middle_name | string (e.g. string) | - | viewer_or_current |
| name_prefix | string (e.g. string) | - | public |
| name_suffix | string (e.g. string) | - | public |
| nickname | string (e.g. string) | - | viewer_or_current |
| notes | string (e.g. string) | - | scheduler |
| onboardings | array (e.g. []) | - | current |
| passed_background_check | boolean (e.g. True) | - | scheduler |
| people_tab | string (e.g. string) | - | current |
| permissions | string (e.g. string) | - | viewer_or_current |
| photo_thumbnail_url | string (e.g. string) | - | public |
| photo_url | string (e.g. string) | - | public |
| plans_tab | string (e.g. string) | - | current |
| praise_charts_enabled | boolean (e.g. True) | - | editor |
| preferred_app | string (e.g. string) | - | public |
| preferred_max_plans_per_day | integer (e.g. 1) | - | scheduler_or_current |
| preferred_max_plans_per_month | integer (e.g. 1) | - | scheduler_or_current |
| profile_name | string (e.g. string) | Only available when requested with the `?fields` param | viewer_or_current |
| signature | string (e.g. string) | Only available when requested with the `?fields` param | viewable_by_me |
| site_administrator | boolean (e.g. True) | - | scheduler |
| song_permissions | string (e.g. string) | - | viewer_or_current |
| songs_tab | string (e.g. string) | - | current |
| status | string (e.g. string) | - | viewer_or_current |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| created_by | created_by | - |
| updated_by | updated_by | - |
| current_folder | current_folder | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| availablesignup-person-available_signups | available_signups | - |
| blockout-person-blockouts | blockouts | - |
| email-person-emails | emails | - |
| personteampositionassignment-person-person_team_position_assignments | person_team_position_assignments | - |
| planperson-person-plan_people | plan_people | - |
| schedule-person-schedules | schedules | - |
| schedulingpreference-person-scheduling_preferences | scheduling_preferences | - |
| tag-person-tags | tags | - |
| teamleader-person-team_leaders | team_leaders | - |
| textsetting-person-text_settings | text_settings | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-live-controller | controller | - |
| person-organization-people | people | - |
| person-personteampositionassignment-person | person | - |
| person-planperson-person | person | - |
| person-schedule-respond_to | respond_to | - |
| person-teamleader-people | people | - |
| person-team-people | people | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | emails | include associated emails |
|  | tags | include associated tags |
|  | team_leaders | include associated team_leaders |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | assigned_to_rehearsal_team | Query on a specific assigned_to_rehearsal_team |
|  | legacy_id | Query on a specific legacy_id |
