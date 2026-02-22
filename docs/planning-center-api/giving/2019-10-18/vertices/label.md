# Label

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `label`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/label`
- Resource path: `https://api.planningcenteronline.com/giving/v2/labels`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Label` is a way for Admins to manage and categorize `Donation`s.

Multiple `Label`s can be added for each `Donation`, and these will only be displayed in the Giving admin interface, so donors never see them.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | The unique identifier for a label. | public |
| slug | string (e.g. string) | The label text itself. Made up solely of lowercase letters, numbers, and dashes. When creating or updating a label, the string you provide will be formatted automatically. For example: `My awesome label!` will be saved as `my-awesome-label` | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| label-donation-labels | labels | - |
| label-organization-labels | labels | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | slug | Query on a specific slug |
