# MailchimpSyncStatus

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `mailchimp_sync_status`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/mailchimp_sync_status`
- Resource path: `https://api.planningcenteronline.com/people/v2/lists/{list_id}/mailchimp_sync_status`
- Collection only: `no`
- Deprecated: `no`


## Description

The status of syncing a List with Mailchimp.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| completed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| error | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| progress | integer (e.g. 1) | - | public |
| segment_id | integer (e.g. 1) | - | public |
| status | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| mailchimpsyncstatus-list-mailchimp_sync_status | mailchimp_sync_status | - |
