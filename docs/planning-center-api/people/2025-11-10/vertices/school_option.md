# SchoolOption

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `school_option`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/school_option`
- Resource path: `https://api.planningcenteronline.com/people/v2/school_options`
- Collection only: `no`
- Deprecated: `no`


## Description

A school option represents a school name, school type, grades, etc. and can be selected for a person.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| beginning_grade | string (e.g. string) | - | public |
| ending_grade | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| school_types | array (e.g. []) | - | public |
| sequence | integer (e.g. 1) | - | public |
| value | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| schooloption-schooloption-promotes_to_school | promotes_to_school | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| schooloption-organization-school_options | school_options | - |
| schooloption-person-school | school | - |
| schooloption-schooloption-promotes_to_school | promotes_to_school | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | beginning_grade | prefix with a hyphen (-beginning_grade) to reverse the order |
|  | ending_grade | prefix with a hyphen (-ending_grade) to reverse the order |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |
|  | value | prefix with a hyphen (-value) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | beginning_grade | Query on a specific beginning_grade |
|  | ending_grade | Query on a specific ending_grade |
|  | school_types | Query on a specific school_types |
|  | sequence | Query on a specific sequence |
|  | value | Query on a specific value |
