# Tag

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `tag`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/tag`
- Resource path: `https://api.planningcenteronline.com/groups/v2/groups/{group_id}/tags`
- Collection only: `no`
- Deprecated: `no`


## Description

Tags are used to filter groups.
They can be organized into tag_groups.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | The name of the tag | public |
| position | integer (e.g. 1) | The position of the tag in relation to other tags | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| tag_group | tag_group | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| group-tag-groups | groups | groups which have applied this tag |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| tag-group-tags | tags | tags assigned to this group |
| tag-taggroup-tags | tags | tags belonging to this tag group |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | position | prefix with a hyphen (-position) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
