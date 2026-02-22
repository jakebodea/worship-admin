# ReportTemplate

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `report_template`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/report_template`
- Resource path: `https://api.planningcenteronline.com/services/v2/report_templates`
- Collection only: `no`
- Deprecated: `no`


## Description

A template for generating reports


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| body | string (e.g. string) | - | public |
| default | boolean (e.g. True) | A template provided by Planning Center | public |
| id | primary_key (e.g. primary_key) | - | public |
| title | string (e.g. string) | - | public |
| type | string (e.g. string) | Possible values: `ReportMatrix`, `ReportPeople`, `ReportPlan` | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| reporttemplate-organization-report_templates | report_templates | - |
