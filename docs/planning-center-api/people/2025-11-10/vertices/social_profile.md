# SocialProfile

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `social_profile`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/social_profile`
- Resource path: `https://api.planningcenteronline.com/people/v2/social_profiles`
- Collection only: `no`
- Deprecated: `no`


## Description

A social profile represents a members's Twitter, Facebook, or other social media account.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| site | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| url | string (e.g. string) | - | public |
| verified | boolean (e.g. True) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-socialprofile-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| socialprofile-organization-social_profiles | social_profiles | - |
| socialprofile-person-social_profiles | social_profiles | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | site | prefix with a hyphen (-site) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
|  | url | prefix with a hyphen (-url) to reverse the order |
|  | verified | prefix with a hyphen (-verified) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | site | Query on a specific site |
|  | updated_at | Query on a specific updated_at |
|  | url | Query on a specific url |
|  | verified | Query on a specific verified |
