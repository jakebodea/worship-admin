# Campus

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `campus`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/campus`
- Resource path: `https://api.planningcenteronline.com/giving/v2/campuses`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Campus` that has been added to your `Organization`.

`Campus`es can be especially useful in filtering `Donation`s across the various locations of your `Organization`.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| address | object (e.g. {}) | The address for a campus. Campus descriptions can be set via Accounts or the People API. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a campus. | public |
| name | string (e.g. string) | The name for a campus. Campus names can be set via Accounts or the People API. | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| donation-campus-donations | donations | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-donation-campus | campus | - |
| campus-inkinddonation-campus | campus | - |
| campus-organization-campuses | campuses | - |
| campus-person-primary_campus | primary_campus | - |
