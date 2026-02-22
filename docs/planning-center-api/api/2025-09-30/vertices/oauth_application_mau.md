# OauthApplicationMau

- App: `api`
- Version: `2025-09-30`
- Vertex ID: `oauth_application_mau`
- Endpoint: `https://api.planningcenteronline.com/api/v2/documentation/2025-09-30/vertices/oauth_application_mau`
- Resource path: `https://api.planningcenteronline.com/api/v2/oauth_applications/{oauth_application_id}/mau`
- Collection only: `no`
- Deprecated: `no`


## Description

Monthly Active Users for an Oauth Application.

A "Monthly Active User" is any person who has been issued an Oauth token during that month.

Historical data will be kept for 24 months.

_Note:_ There is no historical data before mid-February 2019.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| count | integer (e.g. 1) | The total number of unique active users for the application. | public |
| id | primary_key (e.g. primary_key) | - | public |
| month | integer (e.g. 1) | The month the stat was recorded for. | public |
| year | integer (e.g. 1) | The year the stat was recorded for. | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| oauth_application | oauth_application | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| oauthapplicationmau-oauthapplication-mau | mau | - |
