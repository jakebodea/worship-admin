# SchedulingPreference

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `scheduling_preference`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/scheduling_preference`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/scheduling_preferences`
- Collection only: `no`
- Deprecated: `no`


## Description

Household member scheduling preference


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| preference | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| household_member | household_member | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| schedulingpreference-person-scheduling_preferences | scheduling_preferences | - |
