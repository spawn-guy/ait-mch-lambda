# ait-mch-lambda
an AWS Lambda function to Proxy calls to MailChimp APIv3 Subscription without exposing the "all mighty" API-Keys

The function expects `application/json` `body` payload as you would send it to MailChimp APIv3 directly. 
Even though the API-Gateway is configured to accept ANY HTTP methods - it is _easier_ to attach `application/json` body to `POST`, `PUT`, `PATCH` methods 


# Installation
  - Install dependencies with `yarn install`
  - ZIP `index.js`, `node_modules`
  - Deploy AWS Lambda function with "upoad zip"
  - Configure Environment variables as shown in `.env.example`
```
MAILCHIMP_KEY=YOUR-API-KEY
MAILCHIMP_LISTID=YOUR-MAILCHIMP-LIST-ID
```
  - Configure triggers `API Gateway`: `API: Create a new API`, `Security: Open with API Key`
  - use Resulting API Endpoint with `x-api-key` header.
  
  
