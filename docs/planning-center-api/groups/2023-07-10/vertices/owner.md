# Owner

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `owner`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/owner`
- Resource path: `https://api.planningcenteronline.com/groups/v2/events/{event_id}/notes/{note_id}/owner`
- Collection only: `no`
- Deprecated: `no`


## Description

The owner/creator of an event note.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| avatar_url | string (e.g. string) | The URL of the person's avatar. | public |
| first_name | string (e.g. string) | The person's first name. | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_name | string (e.g. string) | The person's last name. | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| owner-eventnote-owner | owner | person who created the note |
