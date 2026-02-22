# MessageGroup

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `message_group`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/message_group`
- Resource path: `https://api.planningcenteronline.com/people/v2/message_groups`
- Collection only: `no`
- Deprecated: `no`


## Description

A message group represents one or more emails or text messages sent from one of the Planning Center apps. The message group indicates the from person, app, etc.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| contains_user_generated_content | boolean (e.g. True) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| from_address | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| message_count | integer (e.g. 1) | - | public |
| message_type | string (e.g. string) | - | public |
| reply_to_address | string (e.g. string) | - | public |
| reply_to_name | string (e.g. string) | - | public |
| subject | string (e.g. string) | - | public |
| system_message | boolean (e.g. True) | - | public |
| transactional_message | boolean (e.g. True) | - | public |
| uuid | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| app-messagegroup-app | app | - |
| person-messagegroup-from | from | - |
| message-messagegroup-messages | messages | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| messagegroup-message-message_group | message_group | - |
| messagegroup-organization-message_groups | message_groups | - |
| messagegroup-person-message_groups | message_groups | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | app | include associated app |
|  | from | include associated from |
|  | messages | include associated messages |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | contains_user_generated_content | prefix with a hyphen (-contains_user_generated_content) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | from_address | prefix with a hyphen (-from_address) to reverse the order |
|  | message_count | prefix with a hyphen (-message_count) to reverse the order |
|  | message_type | prefix with a hyphen (-message_type) to reverse the order |
|  | reply_to_address | prefix with a hyphen (-reply_to_address) to reverse the order |
|  | reply_to_name | prefix with a hyphen (-reply_to_name) to reverse the order |
|  | subject | prefix with a hyphen (-subject) to reverse the order |
|  | system_message | prefix with a hyphen (-system_message) to reverse the order |
|  | transactional_message | prefix with a hyphen (-transactional_message) to reverse the order |
|  | uuid | prefix with a hyphen (-uuid) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | contains_user_generated_content | Query on a specific contains_user_generated_content |
|  | created_at | Query on a specific created_at |
|  | from_address | Query on a specific from_address |
|  | message_count | Query on a specific message_count |
|  | message_type | Query on a specific message_type |
|  | reply_to_address | Query on a specific reply_to_address |
|  | reply_to_name | Query on a specific reply_to_name |
|  | subject | Query on a specific subject |
|  | system_message | Query on a specific system_message |
|  | transactional_message | Query on a specific transactional_message |
|  | uuid | Query on a specific uuid |
