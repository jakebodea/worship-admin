# OauthApplication

- App: `api`
- Version: `2025-09-30`
- Vertex ID: `oauth_application`
- Endpoint: `https://api.planningcenteronline.com/api/v2/documentation/2025-09-30/vertices/oauth_application`
- Resource path: `https://api.planningcenteronline.com/api/v2/oauth_applications`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| description | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| url | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| oauthapplicationmau-oauthapplication-mau | mau | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| oauthapplication-organization-oauth_applications | oauth_applications | - |
