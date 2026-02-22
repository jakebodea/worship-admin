# Tab

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `tab`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/tab`
- Resource path: `https://api.planningcenteronline.com/people/v2/tabs`
- Collection only: `no`
- Deprecated: `no`


## Description

A tab is a custom tab and groups like field definitions.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| sequence | integer (e.g. 1) | - | public |
| slug | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fielddefinition-tab-field_definitions | field_definitions | - |
| fieldoption-tab-field_options | field_options | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| tab-fielddatum-tab | tab | - |
| tab-fielddefinition-tab | tab | - |
| tab-organization-tabs | tabs | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | field_definitions | include associated field_definitions |
|  | field_options | include associated field_options |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |
|  | slug | prefix with a hyphen (-slug) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | Query on a specific name |
|  | sequence | Query on a specific sequence |
|  | slug | Query on a specific slug |
