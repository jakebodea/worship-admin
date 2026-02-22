# NoteCategory

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `note_category`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/note_category`
- Resource path: `https://api.planningcenteronline.com/people/v2/note_categories`
- Collection only: `no`
- Deprecated: `no`


## Description

A Note Category


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| locked | boolean (e.g. True) | - | public |
| name | string (e.g. string) | - | public |
| organization_id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| organization | organization | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| notecategoryshare-notecategory-shares | shares | - |
| person-notecategory-subscribers | subscribers | - |
| notecategorysubscription-notecategory-subscriptions | subscriptions | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| notecategory-note-category | category | - |
| notecategory-organization-note_categories | note_categories | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | shares | include associated shares |
|  | subscribers | include associated subscribers |
|  | subscriptions | include associated subscriptions |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | locked | prefix with a hyphen (-locked) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | organization_id | prefix with a hyphen (-organization_id) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | locked | Query on a specific locked |
|  | name | Query on a specific name |
|  | organization_id | Query on a specific organization_id |
|  | updated_at | Query on a specific updated_at |
