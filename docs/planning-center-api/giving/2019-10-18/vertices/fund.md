# Fund

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `fund`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/fund`
- Resource path: `https://api.planningcenteronline.com/giving/v2/funds`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Fund` is a way of tracking the intent of `Donation`.

All `Organization`s have a default `Fund` (usually named "General"), and creating additional `Fund`s allows donors to allocate their gift to a particular cause/effort.

You can query for the default `Fund` using the `default` param:
```
GET https://api.planningcenteronline.com/giving/v2/funds?where[default]=true
```


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| color | string (e.g. string) | The hex color code that is used to help differentiate the fund from others in Giving, as determined by `color_identifier`. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a fund was created. Example: `2000-01-01T12:00:00Z` | public |
| default | boolean (e.g. True) | This attribute is set to `true` if a fund is the associated organization's default fund, or `false` if it isn't. More information on default funds can be found in our product documentation: https://pcogiving.zendesk.com/hc/en-us/articles/205197070-Funds | public |
| deletable | boolean (e.g. True) | Boolean that tells if you if the fund can be deleted or not. Read more in our product documentation: https://pcogiving.zendesk.com/hc/en-us/articles/205197070-Managing-Funds#DeleteaFund | public |
| description | string (e.g. string) | A short description that describes how the money given to the fund will be used. 255 characters maximum. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a fund. | public |
| ledger_code | string (e.g. string) | If an organization's general ledger software tracks funds by code, this attribute can be used to store the fund's code for reference. | public |
| name | string (e.g. string) | Required. The name for a fund. Must be unique within the associated organization. | public |
| slug | string (e.g. string) | A URL-friendly identifier for a fund, derived from the fund name. | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a fund was last updated. Example: `2000-01-01T12:00:00Z` | public |
| visibility | string (e.g. value) | Required. Controls how a fund is visible on Church Center. `everywhere` will allow anyone to donate to the fund on Church Center. `admin_only` will hide the fund on Church Center, allowing only permitted Giving Users to designate donations to it. `nowhere` will prevent donations from being designated to the fund altogether, while still displaying fund data in historical reports. `hidden` will hide the fund from the list of funds in the default Church Center donation form, but allow donors to give to it via direct link, or through Text-to-Give.  Possible values: `everywhere`, `admin_only`, `nowhere`, or `hidden` | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fund-designation-fund | fund | - |
| fund-inkinddonation-fund | fund | - |
| fund-organization-funds | funds | - |
| fund-pledgecampaign-fund | fund | - |
| fund-recurringdonationdesignation-fund | fund | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | default | Query on a specific default |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
|  | visibility | Query on a specific visibility  Possible values: `everywhere`, `admin_only`, `nowhere`, or `hidden` |
