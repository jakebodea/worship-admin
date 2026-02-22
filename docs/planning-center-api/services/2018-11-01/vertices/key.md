# Key

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `key`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/key`
- Resource path: `https://api.planningcenteronline.com/services/v2/songs/{song_id}/arrangements/{arrangement_id}/keys`
- Collection only: `no`
- Deprecated: `no`


## Description

Each song arrangement can have multiple keys. A key is the pitch center of the song.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| alternate_keys | string (e.g. string) | An array of objects.  ` {   "name": "My Alternate Key",   "key": "B" } ` | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| ending_key | string (e.g. string) | Possible Values:  `Ab`, `A`, `A#`, `Bb`, `B`, `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Abm`, `Am`, `A#m`, `Bbm`, `Bm`, `Cm`, `C#m`, `Dbm`, `Dm`, `D#m`, `Ebm`, `Em`, `Fm`, `F#m`, `Gbm`, `Gm`, `G#m`  To set the key to minor append `m` to the key. e.g. `Cm` | public |
| ending_minor | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| starting_key | string (e.g. string) | Possible Values:  `Ab`, `A`, `A#`, `Bb`, `B`, `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Abm`, `Am`, `A#m`, `Bbm`, `Bm`, `Cm`, `C#m`, `Dbm`, `Dm`, `D#m`, `Ebm`, `Em`, `Fm`, `F#m`, `Gbm`, `Gm`, `G#m`  To set the key to minor append `m` to the key. e.g. `Cm` | public |
| starting_minor | boolean (e.g. True) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| arrangement | arrangement | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-key-attachments | attachments | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| key-arrangement-keys | keys | - |
| key-item-key | key | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
