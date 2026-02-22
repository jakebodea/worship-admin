# Chat

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `chat`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/chat`
- Resource path: `https://api.planningcenteronline.com/services/v2/chats`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| group_identifiers | array (e.g. []) | Only available when requested with the `?fields` param | public |
| id | primary_key (e.g. primary_key) | - | public |
| my_teams | array (e.g. []) | Only available when requested with the `?fields` param | public |
| payload | string (e.g. string) | Only available when requested with the `?fields` param | public |
| people | array (e.g. []) | Only available when requested with the `?fields` param | public |
| plans | array (e.g. []) | Only available when requested with the `?fields` param | public |
| teams | array (e.g. []) | Only available when requested with the `?fields` param | public |
| teams_i_lead | array (e.g. []) | Only available when requested with the `?fields` param | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| chat-organization-chat | chat | - |
