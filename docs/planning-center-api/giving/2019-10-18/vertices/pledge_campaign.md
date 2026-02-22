# PledgeCampaign

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `pledge_campaign`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/pledge_campaign`
- Resource path: `https://api.planningcenteronline.com/giving/v2/people/{person_id}/pledges/{pledge_id}/pledge_campaign`
- Collection only: `no`
- Deprecated: `no`


## Description

A `PledgeCampaign` is a way to request and track long-terms commitments to a particular goal or project.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| description | string (e.g. string) | - | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| goal_cents | integer (e.g. 1) | Optional. During the donation period of this campaign, the running total of donations will be tracked against this number | public |
| goal_currency | currency_abbreviation (e.g. USD) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| received_total_from_pledges_cents | integer (e.g. 1) | - | public |
| received_total_outside_of_pledges_cents | integer (e.g. 1) | - | public |
| show_goal_in_church_center | boolean (e.g. True) | In addition to seeing their personal pledge progress within their donor profile, this option allows donors to see the the collective progress towards the campaign’s overall goal (if set). | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| fund | fund | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fund-pledgecampaign-fund | fund | - |
| pledge-pledgecampaign-pledges | pledges | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| pledgecampaign-pledge-pledge_campaign | pledge_campaign | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | fund | include associated fund |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ends_at | prefix with a hyphen (-ends_at) to reverse the order |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ends_at | Query on a specific ends_at |
|  | fund_id | Query on a related fund |
|  | starts_at | Query on a specific starts_at |
