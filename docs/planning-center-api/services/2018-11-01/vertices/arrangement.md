# Arrangement

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `arrangement`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/arrangement`
- Resource path: `https://api.planningcenteronline.com/services/v2/songs/{song_id}/arrangements`
- Collection only: `no`
- Deprecated: `no`


## Description

Each arrangement belongs to a song and is a different version of that song.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| assign_tags | https://api.planningcenteronline.com/services/v2/songs/{song_id}/arrangements/{arrangement_id}/assign_tags | Used to assign tags to an arrangement. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| archived_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| bpm | float (e.g. 1.42) | - | public |
| chord_chart | string (e.g. string) | A string of lyrics and chords. Supports standard and ChordPro formats. | public |
| chord_chart_chord_color | integer (e.g. 1) | - | public |
| chord_chart_columns | integer (e.g. 1) | - | public |
| chord_chart_font | string (e.g. string) | - | public |
| chord_chart_font_size | integer (e.g. 1) | Possible Values:  `10`, `11`, `12`, `13`, `14`, `15`, `16`, `18`, `20`, `22`, `24`, `26`, `28`, `32`, `36`, `42`, `48` | public |
| chord_chart_key | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| has_chord_chart | boolean (e.g. True) | - | public |
| has_chords | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| length | integer (e.g. 1) | - | public |
| lyrics | string (e.g. string) | - | public |
| lyrics_enabled | boolean (e.g. True) | - | public |
| meter | string (e.g. string) | Possible Values:  - `2/2`  - `2/4`  - `3/2`  - `3/4`  - `4/2`  - `4/4`  - `5/4`  - `6/4`  - `3/8`  - `6/8`  - `7/4`  - `7/8`  - `9/8`  - `12/4`  - `12/8` | public |
| name | string (e.g. string) | - | public |
| notes | string (e.g. string) | - | public |
| number_chart_enabled | boolean (e.g. True) | - | public |
| numeral_chart_enabled | boolean (e.g. True) | - | public |
| print_margin | string (e.g. string) | Possible Values:  - `0.0in`  - `0.25in`  - `0.5in`  - `0.75in`  - `1.0in` | public |
| print_orientation | string (e.g. string) | Possible Values:  - `Portrait`  - `Landscape` | public |
| print_page_size | string (e.g. string) | Possible Values:  - `Widescreen (16x9)`  - `Fullscreen (4x3)`  - `A4`  - `Letter`  - `Legal`  - `11x17` | public |
| sequence | array (e.g. []) | An array of strings containing a label and a number describing the section:  ['Verse 1', 'Chorus 1', 'Verse 2'] | public |
| sequence_full | array (e.g. []) | - | public |
| sequence_short | array (e.g. []) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| updated_by | updated_by | - |
| created_by | created_by | - |
| song | song | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-arrangement-attachments | attachments | - |
| key-arrangement-keys | keys | - |
| arrangementsections-arrangement-sections | sections | - |
| tag-arrangement-tags | tags | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| arrangement-item-arrangement | arrangement | - |
| arrangement-song-arrangements | arrangements | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | keys | include associated keys |
|  | sections | include associated sections |
