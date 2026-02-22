# Note

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `note`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/note`
- Resource path: `https://api.planningcenteronline.com/people/v2/notes`
- Collection only: `no`
- Deprecated: `no`


## Description

A note is text with a category connected to a person’s profile.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| created_by_id | primary_key (e.g. primary_key) | - | public |
| display_date | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| note | string (e.g. string) | - | public |
| note_category_id | primary_key (e.g. primary_key) | - | public |
| organization_id | primary_key (e.g. primary_key) | - | public |
| person_id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| note_category | note_category | - |
| organization | organization | - |
| person | person | - |
| created_by | created_by | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| notecategory-note-category | category | - |
| person-note-created_by | created_by | - |
| person-note-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| note-organization-notes | notes | - |
| note-person-notes | notes | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | category | include associated category |
|  | created_by | include associated created_by |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | display_date | prefix with a hyphen (-display_date) to reverse the order |
|  | id | prefix with a hyphen (-id) to reverse the order |
|  | note | prefix with a hyphen (-note) to reverse the order |
|  | note_category_id | prefix with a hyphen (-note_category_id) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | note | Query on a specific note |
|  | note_category_id | Query on a specific note_category_id |
