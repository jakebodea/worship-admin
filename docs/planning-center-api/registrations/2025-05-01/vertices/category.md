# Category

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `category`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/category`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/categories`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Category` is a label used to group together and find signups more easily.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | Name of the category. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| category-organization-categories | categories | - |
| category-signup-categories | categories | - |
