# EventNote

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `event_note`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/event_note`
- Resource path: `https://api.planningcenteronline.com/groups/v2/events/{event_id}/notes`
- Collection only: `no`
- Deprecated: `no`


## Description

Notes that group leaders can write for an event, generally related to attendance.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| body | string (e.g. string) | The body text of the note. | public |
| id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| annotatable | annotatable | - |
| owner | owner | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| owner-eventnote-owner | owner | person who created the note |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventnote-event-notes | notes | notes added to the event |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | owner | include associated owner |
