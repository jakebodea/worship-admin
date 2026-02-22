# NoteCategoryShare

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `note_category_share`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/note_category_share`
- Resource path: `https://api.planningcenteronline.com/people/v2/note_categories/{note_category_id}/shares`
- Collection only: `no`
- Deprecated: `no`


## Description

A note category share defines who can view notes in a category.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| group | string (e.g. value) | Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` | public |
| id | primary_key (e.g. primary_key) | - | public |
| permission | string (e.g. value) | Possible values: `view`, `view_create`, or `manage` | public |
| person_id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| note_category | note_category | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-notecategoryshare-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| notecategoryshare-notecategory-shares | shares | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | permission | Query on a specific permission  Possible values: `view`, `view_create`, or `manage` |
