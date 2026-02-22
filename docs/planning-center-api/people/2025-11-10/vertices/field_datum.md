# FieldDatum

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `field_datum`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/field_datum`
- Resource path: `https://api.planningcenteronline.com/people/v2/field_data`
- Collection only: `no`
- Deprecated: `no`


## Description

A field datum is an individual piece of data for a custom field.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| file | string (e.g. string) | - | public |
| file_content_type | string (e.g. string) | - | public |
| file_name | string (e.g. string) | - | public |
| file_size | integer (e.g. 1) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| value | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| field_definition | field_definition | - |
| customizable | customizable | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fielddefinition-fielddatum-field_definition | field_definition | - |
| fieldoption-fielddatum-field_option | field_option | - |
| person-fielddatum-person | person | - |
| tab-fielddatum-tab | tab | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fielddatum-organization-field_data | field_data | - |
| fielddatum-person-field_data | field_data | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | field_definition | include associated field_definition |
|  | field_option | include associated field_option |
|  | tab | include associated tab |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | file | prefix with a hyphen (-file) to reverse the order |
|  | file_content_type | prefix with a hyphen (-file_content_type) to reverse the order |
|  | file_name | prefix with a hyphen (-file_name) to reverse the order |
|  | file_size | prefix with a hyphen (-file_size) to reverse the order |
|  | value | prefix with a hyphen (-value) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | field_definition_id | Query on a related field_definition |
|  | file | Query on a specific file |
|  | file_content_type | Query on a specific file_content_type |
|  | file_name | Query on a specific file_name |
|  | file_size | Query on a specific file_size |
|  | value | Query on a specific value |
