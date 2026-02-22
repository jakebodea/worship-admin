# ScheduledPerson

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `scheduled_person`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/scheduled_person`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/available_signups/{available_signup_id}/signup_sheets/{signup_sheet_id}/scheduled_people`
- Collection only: `no`
- Deprecated: `no`


## Description

A person already scheduled to a SignupSheet


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| full_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| status | string (e.g. string) | - | public |
| thumbnail | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| signup_sheet | signup_sheet | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| scheduledperson-signupsheet-scheduled_people | scheduled_people | - |
