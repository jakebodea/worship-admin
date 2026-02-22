# FieldOption

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `field_option`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/field_option`
- Resource path: `https://api.planningcenteronline.com/people/v2/field_definitions/{field_definition_id}/field_options`
- Collection only: `no`
- Deprecated: `no`


## Description

A field option represents an individual option for a custom field of type "select" or "checkboxes".


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| sequence | integer (e.g. 1) | - | public |
| value | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| field_definition | field_definition | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fieldoption-fielddatum-field_option | field_option | - |
| fieldoption-fielddefinition-field_options | field_options | - |
| fieldoption-tab-field_options | field_options | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |
|  | value | prefix with a hyphen (-value) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | sequence | Query on a specific sequence |
|  | value | Query on a specific value |
