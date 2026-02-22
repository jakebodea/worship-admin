# NamePrefix

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `name_prefix`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/name_prefix`
- Resource path: `https://api.planningcenteronline.com/people/v2/name_prefixes`
- Collection only: `no`
- Deprecated: `no`


## Description

A name prefix is one of Mr., Mrs., etc.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| value | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| nameprefix-organization-name_prefixes | name_prefixes | - |
| nameprefix-person-name_prefix | name_prefix | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | value | prefix with a hyphen (-value) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | value | Query on a specific value |
