# GroupType

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `group_type`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/group_type`
- Resource path: `https://api.planningcenteronline.com/groups/v2/group_types`
- Collection only: `no`
- Deprecated: `no`


## Description

A group type is a category of groups.
For example, a church might have group types for "Small Groups" and "Classes".


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| church_center_map_visible | boolean (e.g. True) | `true` if the map view is visible on the public groups list page. Otherwise `false`. | public |
| church_center_visible | boolean (e.g. True) | `true` if the group type contains any published groups. Otherwise `false`. | public |
| color | string (e.g. string) | Hex color value. Color themes are a visual tool for administrators on the admin side of Groups. Ex: "#4fd2e3" | public |
| default_group_settings | string (e.g. string) | A JSON object of default settings for groups of this type. | public |
| description | string (e.g. string) | A description of the group type | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | The name of the group type | public |
| position | integer (e.g. 1) | The position of the group type in relation to other group types. | public |
| public_church_center_web_url | string (e.g. string) | The public URL for the group on Church Center. | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-grouptype-events | events | events of groups with this group type |
| group-grouptype-groups | groups | groups belonging to this group type |
| resource-grouptype-resources | resources | file or link resources shared with all groups in this group type |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| grouptype-group-group_type | group_type | group type of this group |
| grouptype-organization-group_types | group_types | group types for this organization |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | position | prefix with a hyphen (-position) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | Query on a specific id |
