# ResourceSuggestion

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `resource_suggestion`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/resource_suggestion`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/room_setups/{room_setup_id}/resource_suggestions`
- Collection only: `no`
- Deprecated: `no`


## Description

A resource and quantity suggested by a room setup.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the suggestion was created | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the suggestion | public |
| quantity | integer (e.g. 1) | How many resources should be requested | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the suggestion was updated | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| resource | resource | - |
| room_setup | room_setup | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resource-resourcesuggestion-resource | resource | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resourcesuggestion-roomsetup-resource_suggestions | resource_suggestions | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | resource | include associated resource |
