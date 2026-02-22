# Tag

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `tag`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/tag`
- Resource path: `https://api.planningcenteronline.com/services/v2/media/{media_id}/tags`
- Collection only: `no`
- Deprecated: `no`


## Description

A tag belonging to a tag group.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| tag_group | tag_group | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| tag-arrangement-tags | tags | - |
| tag-media-tags | tags | - |
| tag-person-tags | tags | - |
| tag-song-tags | tags | - |
| tag-taggroup-tags | tags | - |
| tag-teamposition-tags | tags | - |
