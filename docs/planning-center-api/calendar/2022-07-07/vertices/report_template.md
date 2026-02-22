# ReportTemplate

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `report_template`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/report_template`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/report_templates`
- Collection only: `no`
- Deprecated: `no`


## Description

A template for generating a report.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| body | string (e.g. string) | The contents of the report template | public |
| created_at | string (e.g. string) | UTC time at which the report was created | public |
| description | string (e.g. string) | A summarization of the report | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the report | public |
| title | string (e.g. string) | The title of the report | public |
| updated_at | string (e.g. string) | UTC time at which the report was updated | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| reporttemplate-organization-report_templates | report_templates | - |
