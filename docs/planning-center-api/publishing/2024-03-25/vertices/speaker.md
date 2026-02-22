# Speaker

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `speaker`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/speaker`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/speakers`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| avatar_url | string (e.g. string) | - | public |
| episodes_count | integer (e.g. 1) | - | public |
| first_name | string (e.g. string) | - | public |
| formatted_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_name | string (e.g. string) | - | public |
| name_prefix | string (e.g. string) | - | public |
| name_suffix | string (e.g. string) | - | public |
| speaker_type | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| speaker-organization-speakers | speakers | - |
| speaker-speakership-speaker | speaker | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
