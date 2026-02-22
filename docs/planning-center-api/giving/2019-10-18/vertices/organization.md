# Organization

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/giving/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

The root level `Organization` record which serves as a link to `Donation`s, `People`, `Fund`s, etc.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | The unique identifier for an organization. | public |
| name | string (e.g. string) | The name for an organization. | public |
| text2give_enabled | boolean (e.g. True) | `true` if this organization is accepting Text2Give donations, `false` otherwise. | public |
| time_zone | string (e.g. string) | The time zone for an organization. | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| batchgroup-organization-batch_groups | batch_groups | - |
| batch-organization-batches | batches | - |
| campus-organization-campuses | campuses | - |
| donation-organization-donations | donations | - |
| fund-organization-funds | funds | - |
| inkinddonation-organization-in_kind_donations | in_kind_donations | - |
| label-organization-labels | labels | - |
| paymentsource-organization-payment_sources | payment_sources | - |
| person-organization-people | people | - |
| recurringdonation-organization-recurring_donations | recurring_donations | - |
