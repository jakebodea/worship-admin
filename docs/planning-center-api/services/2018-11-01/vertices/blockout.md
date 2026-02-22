# Blockout

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `blockout`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/blockout`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/blockouts`
- Collection only: `no`
- Deprecated: `no`


## Description

An object representing a blockout date, and an optional recurrence pattern


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| description | string (e.g. string) | - | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| group_identifier | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| organization_name | string (e.g. string) | - | public |
| reason | string (e.g. string) | - | public |
| repeat_frequency | string (e.g. string) | Possible values:  - no_repeat  - every_1  - every_2  - every_3  - every_4  - every_5  - every_6  - every_7  - every_8 | public |
| repeat_interval | string (e.g. string) | Possible values:  - exact_day_of_month  - week_of_month_1  - week_of_month_2  - week_of_month_3  - week_of_month_4  - week_of_month_last | public |
| repeat_period | string (e.g. string) | Possible values:  - daily  - weekly  - monthly  - yearly | public |
| repeat_until | date (e.g. 2000-01-01) | - | public |
| settings | string (e.g. string) | - | public |
| share | boolean (e.g. True) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| time_zone | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| organization | organization | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| blockoutdate-blockout-blockout_dates | blockout_dates | - |
| blockoutexception-blockout-blockout_exceptions | blockout_exceptions | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| blockout-person-blockouts | blockouts | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | group_identifier | Query on a specific group_identifier |
