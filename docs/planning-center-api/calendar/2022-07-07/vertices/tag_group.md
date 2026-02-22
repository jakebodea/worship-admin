# TagGroup

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `tag_group`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/tag_group`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/tag_groups`
- Collection only: `no`
- Deprecated: `no`


## Description

A grouping of tags for organizational purposes.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the tag group was created | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the tag group | public |
| name | string (e.g. string) | The name of the tag group | public |
| required | boolean (e.g. True) | - `true` indicates tag from this tag group must be applied when creating an event | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the tag group was updated | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-taggroup-events | events | - |
| tag-taggroup-tags | tags | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| taggroup-organization-tag_groups | tag_groups | - |
| taggroup-tag-tag_group | tag_group | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | events | include associated events |
|  | tags | include associated tags |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
