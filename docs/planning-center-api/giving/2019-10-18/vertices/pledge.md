# Pledge

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `pledge`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/pledge`
- Resource path: `https://api.planningcenteronline.com/giving/v2/people/{person_id}/pledges`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Pledge` made by a `Person` toward a particular `PledgeCampaign`.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| amount_cents | integer (e.g. 1) | The amount pledged | public |
| amount_currency | currency_abbreviation (e.g. USD) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| donated_total_cents | integer (e.g. 1) | The amount donated | public |
| id | primary_key (e.g. primary_key) | - | public |
| joint_giver_amount_cents | integer (e.g. 1) | The amount pledged by the joint giver, if in a joint giving unit | public |
| joint_giver_donated_total_cents | integer (e.g. 1) | The amount donated by the joint giver, if in a joint giving unit | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| pledge_campaign | pledge_campaign | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-pledge-joint_giver | joint_giver | - |
| pledgecampaign-pledge-pledge_campaign | pledge_campaign | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| pledge-person-pledges | pledges | - |
| pledge-pledgecampaign-pledges | pledges | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | joint_giver | include associated joint_giver |
|  | pledge_campaign | include associated pledge_campaign |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | updated_at | Query on a specific updated_at |
