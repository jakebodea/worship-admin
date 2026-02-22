# Speakership

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `speakership`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/speakership`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/episodes/{episode_id}/speakerships`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| speaker | speaker | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| speaker-speakership-speaker | speaker | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| speakership-episode-speakerships | speakerships | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | speaker | include associated speaker |
