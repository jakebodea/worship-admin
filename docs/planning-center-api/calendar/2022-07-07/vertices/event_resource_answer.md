# EventResourceAnswer

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `event_resource_answer`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/event_resource_answer`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/event_resource_requests/{event_resource_request_id}/answers`
- Collection only: `no`
- Deprecated: `no`


## Description

An answer to a question in a room or resource request.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| answer | json (e.g. {}) | The answer formatted for display | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| db_answer | string (e.g. string) | Only available when requested with the `?fields` param | public |
| id | primary_key (e.g. primary_key) | - | public |
| question | json (e.g. {}) | Question details as of when it was answered | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| created_by | created_by | - |
| updated_by | updated_by | - |
| resource_question | resource_question | - |
| event_resource_request | event_resource_request | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventresourceanswer-eventresourcerequest-answers | answers | - |
