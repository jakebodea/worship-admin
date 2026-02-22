# TagGroup

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `tag_group`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/tag_group`
- Resource path: `https://api.planningcenteronline.com/services/v2/tag_groups`
- Collection only: `no`
- Deprecated: `no`


## Description

A tag group contains tags


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| allow_multiple_selections | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| required | boolean (e.g. True) | - | public |
| service_type_folder_name | string (e.g. string) | - | public |
| tags_for | string (e.g. string) | Scopes a tag group to `person`, `song`, `arrangement`, `media` | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| folder-taggroup-folder | folder | - |
| tag-taggroup-tags | tags | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| taggroup-organization-tag_groups | tag_groups | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | folder | include associated folder |
|  | tags | include associated tags |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | Query on a specific name |
|  | tags_for | Query on a specific tags_for |
