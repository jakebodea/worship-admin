# Series

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `series`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/series`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/series`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| art | hash (e.g. {}) | - | public |
| church_center_url | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| description | string (e.g. string) | - | public |
| ended_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| episodes_count | integer (e.g. 1) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| published | boolean (e.g. True) | - | public |
| started_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| title | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| channel-series-channel | channel | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| series-channel-series | series | - |
| series-episode-series | series | - |
| series-organization-series | series | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | channel | include associated channel |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ended_at | prefix with a hyphen (-ended_at) to reverse the order |
|  | episodes_count | prefix with a hyphen (-episodes_count) to reverse the order |
|  | started_at | prefix with a hyphen (-started_at) to reverse the order |
|  | title | prefix with a hyphen (-title) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | Query on a specific id |
