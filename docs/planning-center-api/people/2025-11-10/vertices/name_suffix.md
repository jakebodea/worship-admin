# NameSuffix

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `name_suffix`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/name_suffix`
- Resource path: `https://api.planningcenteronline.com/people/v2/name_suffixes`
- Collection only: `no`
- Deprecated: `no`


## Description

A name suffix is one of Sr., Jr., etc.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| value | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| namesuffix-organization-name_suffixes | name_suffixes | - |
| namesuffix-person-name_suffix | name_suffix | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | value | prefix with a hyphen (-value) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | value | Query on a specific value |
