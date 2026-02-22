# EpisodeResource

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `episode_resource`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/episode_resource`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/episodes/{episode_id}/episode_resources`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| featured | boolean (e.g. True) | - | public |
| icon | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. string) | Possible values: `giving_fund`, `people_form`, `generic_url`, `services_public_page` | public |
| position | integer (e.g. 1) | - | public |
| title | string (e.g. string) | - | public |
| type | string (e.g. string) | - | public |
| url | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| episoderesource-episode-episode_resources | episode_resources | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | position | prefix with a hyphen (-position) to reverse the order |
