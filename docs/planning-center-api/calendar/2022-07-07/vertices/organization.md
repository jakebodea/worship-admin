# Organization

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/calendar/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

An administrative structure, usually representing a single church.
Contains date/time formatting and time zone preferences.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| calendar_starts_on | string (e.g. string) | The day of the week the calendar starts on | public |
| date_format | string (e.g. string) | Possible values: - `%d/%m/%Y`: indicates date/month/year formatting - `%m/%d/%Y`: indicates month/date/year formatting | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the organization | public |
| name | string (e.g. string) | The name of the organization | public |
| onboarding | boolean (e.g. True) | Only available when requested with the `?fields` param | public |
| time_zone | string (e.g. string) | The time zone of the organization | public |
| twenty_four_hour_time | boolean (e.g. True) | - `true` indicates hours for times will use a 24-hour clock - `false` indicates hours for times will use a 12-hour clock | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-organization-attachments | attachments | - |
| conflict-organization-conflicts | conflicts | - |
| eventinstance-organization-event_instances | event_instances | - |
| eventresourcerequest-organization-event_resource_requests | event_resource_requests | - |
| event-organization-events | events | - |
| feed-organization-feeds | feeds | - |
| jobstatus-organization-job_statuses | job_statuses | - |
| person-organization-people | people | - |
| reporttemplate-organization-report_templates | report_templates | - |
| resourceapprovalgroup-organization-resource_approval_groups | resource_approval_groups | - |
| resourcebooking-organization-resource_bookings | resource_bookings | - |
| resourcefolder-organization-resource_folders | resource_folders | - |
| resourcequestion-organization-resource_questions | resource_questions | - |
| resource-organization-resources | resources | - |
| roomsetup-organization-room_setups | room_setups | - |
| taggroup-organization-tag_groups | tag_groups | - |
| tag-organization-tags | tags | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| organization-person-organization | organization | - |
