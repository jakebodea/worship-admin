# Person

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `person`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/person`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/people`
- Collection only: `no`
- Deprecated: `no`


## Description

An attendee, volunteer or administrator.

_Usually_, a person who checked in will be present as a `Person`. In some cases, they may not be present:
- The person was manually deleted from the admin interface
- The check-in was created as a "Visitor - Label Only" (which doesn't create a corresponding person record)


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| addresses | array (e.g. []) | - | public |
| avatar_url | string (e.g. string) | - | public |
| birthdate | date (e.g. 2000-01-01) | - | public |
| check_in_count | integer (e.g. 1) | - | public |
| child | boolean (e.g. True) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| demographic_avatar_url | string (e.g. string) | - | public |
| email_addresses | array (e.g. []) | - | public |
| first_name | string (e.g. string) | - | public |
| gender | string (e.g. string) | - | public |
| grade | integer (e.g. 1) | - | public |
| headcounter | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| ignore_filters | boolean (e.g. True) | - | public |
| last_checked_in_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| last_name | string (e.g. string) | - | public |
| medical_notes | string (e.g. string) | - | public |
| middle_name | string (e.g. string) | - | public |
| name | string (e.g. string) | - | public |
| name_prefix | string (e.g. string) | - | public |
| name_suffix | string (e.g. string) | - | public |
| passed_background_check | boolean (e.g. True) | - | public |
| permission | string (e.g. string) | - | public |
| phone_numbers | array (e.g. []) | - | public |
| top_permission | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkin-person-check_ins | check_ins | - |
| organization-person-organization | organization | - |
| pass-person-passes | passes | - |
| personevent-person-person_events | person_events | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-checkin-checked_in_by | checked_in_by | - |
| person-checkin-checked_out_by | checked_out_by | - |
| person-checkin-person | person | - |
| person-organization-people | people | - |
| person-pass-person | person | - |
| person-personevent-person | person | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | organization | include associated organization |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | check_in_count | prefix with a hyphen (-check_in_count) to reverse the order |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | last_checked_in_at | prefix with a hyphen (-last_checked_in_at) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | headcounter | Query on a specific headcounter |
|  | ignore_filters | Query on a specific ignore_filters |
|  | permission | Query on a specific permission |
|  | search_name | Search by person name (first, last, combination) |
