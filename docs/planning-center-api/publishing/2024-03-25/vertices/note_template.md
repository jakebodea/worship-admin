# NoteTemplate

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `note_template`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/note_template`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/episodes/{episode_id}/note_template`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| auto_create_free_form_notes | boolean (e.g. True) | - | public |
| enabled | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| published_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| template | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| notetemplate-episode-note_template | note_template | - |
