# ListCategory

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `list_category`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/list_category`
- Resource path: `https://api.planningcenteronline.com/people/v2/list_categories`
- Collection only: `no`
- Deprecated: `no`


## Description

A List Category


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
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
| list-listcategory-lists | lists | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| listcategory-list-category | category | - |
| listcategory-organization-list_categories | list_categories | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | lists | include associated lists |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | organization_id | prefix with a hyphen (-organization_id) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | name | Query on a specific name |
|  | organization_id | Query on a specific organization_id |
|  | updated_at | Query on a specific updated_at |
