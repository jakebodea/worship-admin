# ArrangementSections

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `arrangement_sections`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/arrangement_sections`
- Resource path: `https://api.planningcenteronline.com/services/v2/songs/{song_id}/arrangements/{arrangement_id}/sections`
- Collection only: `no`
- Deprecated: `no`


## Description

Sections of an Arrangement, derived from its chord chart


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| sections | array (e.g. []) | Given an arrangement with the folowing `chord_chart`:  ``` VERSE 1 D          Bm       G          D Be thou my vision O Lord of my heart A             Bm         G              A naught be all else to me save that Thou art ```  The value will be:  ```json [   {     "label": "Verse",     "lyrics": "Be thou my vision O Lord of my heart naught be all else to me save that Thou art",     "breaks_at": null   } ] ``` | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| arrangementsections-arrangement-sections | sections | - |
