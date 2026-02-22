# Message

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `message`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/message`
- Resource path: `https://api.planningcenteronline.com/people/v2/messages`
- Collection only: `no`
- Deprecated: `no`


## Description

A message is an individual email or sms text sent to a member. Every message has a parent message group.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| app_name | string (e.g. string) | - | public |
| bounced_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| delivery_status | string (e.g. string) | - | public |
| file | string (e.g. string) | - | private |
| from_address | string (e.g. string) | - | public |
| from_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. value) | Possible values: `email`, `sms`, or `church_center_message` | public |
| message_type | string (e.g. string) | - | public |
| read_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| reject_reason | string (e.g. string) | - | public |
| rejection_notification_sent_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| sent_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| subject | string (e.g. string) | - | public |
| to_addresses | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| from | from | - |
| to | to | - |
| message_group | message_group | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| messagegroup-message-message_group | message_group | - |
| person-message-to | to | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| message-messagegroup-messages | messages | - |
| message-organization-messages | messages | - |
| message-person-messages | messages | The Person's received messages. Can also receive a filter to return `sent` or `unread` e.g. `?filter=sent` |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | message_group | include associated message_group |
|  | to | include associated to |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | app_name | prefix with a hyphen (-app_name) to reverse the order |
|  | bounced_at | prefix with a hyphen (-bounced_at) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | delivery_status | prefix with a hyphen (-delivery_status) to reverse the order |
|  | file | prefix with a hyphen (-file) to reverse the order |
|  | from_address | prefix with a hyphen (-from_address) to reverse the order |
|  | from_name | prefix with a hyphen (-from_name) to reverse the order |
|  | kind | prefix with a hyphen (-kind) to reverse the order |
|  | reject_reason | prefix with a hyphen (-reject_reason) to reverse the order |
|  | rejection_notification_sent_at | prefix with a hyphen (-rejection_notification_sent_at) to reverse the order |
|  | sent_at | prefix with a hyphen (-sent_at) to reverse the order |
|  | subject | prefix with a hyphen (-subject) to reverse the order |
|  | to_addresses | prefix with a hyphen (-to_addresses) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | app_name | Query on a specific app_name |
|  | bounced_at | Query on a specific bounced_at |
|  | created_at | Query on a specific created_at |
|  | delivery_status | Query on a specific delivery_status |
|  | file | Query on a specific file |
|  | from_address | Query on a specific from_address |
|  | kind | Query on a specific kind  Possible values: `email`, `sms`, or `church_center_message` |
|  | reject_reason | Query on a specific reject_reason |
|  | rejection_notification_sent_at | Query on a specific rejection_notification_sent_at |
|  | sent_at | Query on a specific sent_at |
|  | subject | Query on a specific subject |
|  | to_addresses | Query on a specific to_addresses |
