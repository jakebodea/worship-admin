# Note

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `note`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/note`
- Resource path: `https://api.planningcenteronline.com/giving/v2/donations/{donation_id}/note`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Note` is a way for Giving Admins and Bookkeepers to communicate internally about a donation.
Notes are only visible in the Giving admin interface, not shown to donors. Each `Donation` can only
have a single note associated with it.

To record notes from donors, consider using the [Memo Line feature](https://pcogiving.zendesk.com/hc/en-us/articles/44484564313883-Manage-your-online-donation-form) instead.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| body | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| note-donation-note | note | - |
