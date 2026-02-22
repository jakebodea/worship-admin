# EmailTemplate

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `email_template`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/email_template`
- Resource path: `https://api.planningcenteronline.com/services/v2/email_templates`
- Collection only: `no`
- Deprecated: `no`


## Description

A EmailTemplate Resource


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| render | https://api.planningcenteronline.com/services/v2/email_templates/{email_template_id}/render | Render an email template and fill in the persons details | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| html_body | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. string) | - | public |
| subject | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| template_owner | template_owner | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| emailtemplate-organization-email_templates | email_templates | - |
