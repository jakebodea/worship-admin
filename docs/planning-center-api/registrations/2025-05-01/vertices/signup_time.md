# SignupTime

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `signup_time`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/signup_time`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/signups/{signup_id}/next_signup_time`
- Collection only: `no`
- Deprecated: `no`


## Description

`Signup_time`s are associated with a signup, which can have multiple signup times.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | Start date and time of signup time. | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | End date and time of signup time. | public |
| all_day | boolean (e.g. True) | Whether or not the signup time is all day. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| signuptime-signup-next_signup_time | next_signup_time | - |
| signuptime-signup-signup_times | signup_times | - |
