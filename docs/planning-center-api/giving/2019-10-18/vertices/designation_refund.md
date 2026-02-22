# DesignationRefund

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `designation_refund`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/designation_refund`
- Resource path: `https://api.planningcenteronline.com/giving/v2/donations/{donation_id}/refund/designation_refunds`
- Collection only: `no`
- Deprecated: `no`


## Description

A record that links a `Refund` with a `Designation`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| amount_cents | integer (e.g. 1) | The number of cents being refunded. | public |
| amount_currency | string (e.g. string) | The currency of `amount_cents`. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a designation refund. | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| designation | designation | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| designation-designationrefund-designation | designation | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| designationrefund-refund-designation_refunds | designation_refunds | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | designation | include associated designation |
