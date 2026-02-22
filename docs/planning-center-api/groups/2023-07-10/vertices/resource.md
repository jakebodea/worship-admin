# Resource

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `resource`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/resource`
- Resource path: `https://api.planningcenteronline.com/groups/v2/group_types/{group_type_id}/resources`
- Collection only: `no`
- Deprecated: `no`


## Description

A file or link resource that can be shared with a group.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| description | string (e.g. string) | The description of the resource written by the person who created it. | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_updated | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time the resource was last updated. | public |
| name | string (e.g. string) | The name/title of the resource. | public |
| type | string (e.g. string) | Either `FileResource` or `LinkResource` | public |
| visibility | string (e.g. value) | Possible values: `leaders` or `members` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| created_by | created_by | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resource-resource-download | download | link to download this file resource |
| resource-resource-visit | visit | link to visit this link resource |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resource-group-resources | resources | file and link resources shared with this group |
| resource-grouptype-resources | resources | file or link resources shared with all groups in this group type |
| resource-resource-download | download | link to download this file resource |
| resource-resource-visit | visit | link to visit this link resource |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | last_updated | prefix with a hyphen (-last_updated) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
