# TagGroup

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `tag_group`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/tag_group`
- Resource path: `https://api.planningcenteronline.com/groups/v2/tag_groups`
- Collection only: `no`
- Deprecated: `no`


## Description

A way to group related tags.
For example you could have a "Life Stage" tag group
with tags like "Child", "Teen", "Adult", etc.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| display_publicly | boolean (e.g. True) | Whether or not this tag group is visible to the public on Church Center | public |
| id | primary_key (e.g. primary_key) | - | public |
| multiple_options_enabled | boolean (e.g. True) | Whether or not a group can belong to many tags within this tag group | public |
| name | string (e.g. string) | The name of the tag group | public |
| position | integer (e.g. 1) | The position of the tag group in relation to other tag groups | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| tag-taggroup-tags | tags | tags belonging to this tag group |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| taggroup-organization-tag_groups | tag_groups | tag groups in this organization |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | position | prefix with a hyphen (-position) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | Query on a specific name |
