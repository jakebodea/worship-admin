# Series

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `series`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/series`
- Resource path: `https://api.planningcenteronline.com/services/v2/series`
- Collection only: `no`
- Deprecated: `no`


## Description

A Series can be specified for each plan to tie plans with similar messages together, even across Service Types.

*Note*: A series is not created until artwork is added from the plan.  You can use `series_title` included in `Plan` attributes to get titles for series without artwork.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| artwork_content_type | string (e.g. string) | - | public |
| artwork_file_name | string (e.g. string) | - | public |
| artwork_file_size | integer (e.g. 1) | - | public |
| artwork_for_dashboard | string (e.g. string) | - | public |
| artwork_for_mobile | string (e.g. string) | - | public |
| artwork_for_plan | string (e.g. string) | - | public |
| artwork_original | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| has_artwork | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| title | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plan-series-plans | plans | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| series-organization-series | series | - |
| series-plan-series | series | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | title | Query on a specific title |
