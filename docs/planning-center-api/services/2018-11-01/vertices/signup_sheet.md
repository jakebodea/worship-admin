# SignupSheet

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `signup_sheet`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/signup_sheet`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/available_signups/{available_signup_id}/signup_sheets`
- Collection only: `no`
- Deprecated: `no`


## Description

Available positions to sign up for


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| accept | https://api.planningcenteronline.com/services/v2/people/{person_id}/available_signups/{available_signup_id}/signup_sheets/{signup_sheet_id}/accept | Accept a signup sheet | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| display_times | string (e.g. string) | - | public |
| group_key | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| position_name | string (e.g. string) | - | public |
| sort_date | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| sort_index | integer (e.g. 1) | - | public |
| team_name | string (e.g. string) | - | public |
| title | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| plan | plan | - |
| team_position | team_position | - |
| team | team | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| scheduledperson-signupsheet-scheduled_people | scheduled_people | - |
| signupsheetmetadata-signupsheet-signup_sheet_metadata | signup_sheet_metadata | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| signupsheet-availablesignup-signup_sheets | signup_sheets | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | scheduled_people | include associated scheduled_people |
|  | signup_sheet_metadata | include associated signup_sheet_metadata |
