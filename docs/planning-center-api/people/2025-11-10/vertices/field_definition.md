# FieldDefinition

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `field_definition`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/field_definition`
- Resource path: `https://api.planningcenteronline.com/people/v2/field_definitions`
- Collection only: `no`
- Deprecated: `no`


## Description

A field definition represents a custom field -- its name, data type, etc.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| config | string (e.g. string) | - | public |
| data_type | string (e.g. string) | - | public |
| deleted_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| sequence | integer (e.g. 1) | - | public |
| slug | string (e.g. string) | - | public |
| tab_id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| tab | tab | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fieldoption-fielddefinition-field_options | field_options | - |
| tab-fielddefinition-tab | tab | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fielddefinition-fielddatum-field_definition | field_definition | - |
| fielddefinition-organization-field_definitions | field_definitions | - |
| fielddefinition-tab-field_definitions | field_definitions | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | field_options | include associated field_options |
|  | tab | include associated tab |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | config | prefix with a hyphen (-config) to reverse the order |
|  | data_type | prefix with a hyphen (-data_type) to reverse the order |
|  | deleted_at | prefix with a hyphen (-deleted_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |
|  | slug | prefix with a hyphen (-slug) to reverse the order |
|  | tab_id | prefix with a hyphen (-tab_id) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | config | Query on a specific config |
|  | data_type | Query on a specific data_type |
|  | deleted_at | Query on a specific deleted_at |
|  | name | Query on a specific name |
|  | sequence | Query on a specific sequence |
|  | slug | Query on a specific slug |
|  | tab_id | Query on a specific tab_id |
