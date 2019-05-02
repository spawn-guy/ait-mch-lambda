'use strict';

console.log('Loading parameters');

const mailChimpKey = process.env.MAILCHIMP_KEY;
const mailChimpListId = process.env.MAILCHIMP_LISTID;

const Constants = {
    STATUS: {
        PENDING: 'pending',
        SUBSCRIBED: 'subscribed',
    }
};

console.log('Loading function');

const Mailchimp = require('mailchimp-api-v3');
const mailchimpClient = new Mailchimp(mailChimpKey);

const CryptoJSMD5 = require('crypto-js/md5');

exports.handler = async function (event, context, callback) {
    console.log('Received event');

    const jsonBody = JSON.parse(event.body);

    // Sanity check
    if (!jsonBody) {
        console.error("no body provided");
        exports.respondError(callback, "there must be a payload", 422);
        return;
    }

    if (jsonBody.email_address === undefined) {
        console.error("no email_address provided");
        exports.respondError(callback, "'email_address' must be in the payload", 422);
        return;
    }

    const status_if_new = jsonBody.status ? jsonBody.status : (jsonBody.status_if_new ? jsonBody.status_if_new : Constants.STATUS.PENDING);

    const payloadBody = {
        email_address: jsonBody.email_address,
        status_if_new: status_if_new,
        merge_fields: jsonBody.merge_fields ? jsonBody.merge_fields : {},
    };

    const requestMailchimp = {
        method: 'put',
        path: `/lists/${mailChimpListId}/members/${CryptoJSMD5(jsonBody.email_address.toLowerCase())}`,
        body: payloadBody,
    };

    // Add or update a list member
    // PUT /lists/{list_id}/members/{subscriber_hash}
    try {
        const mailchimpResult = await mailchimpClient.request(requestMailchimp);
        exports.respondOkay(callback, mailchimpResult);
    } catch (e) {
        console.log(e, e.stack);
        exports.respondError(callback, "mailchimpClient list.subscribe failed", 503);
    }
};

exports.respondError = function (callback, message, responseStatusCode) {
    const responseBody = {
        "error": message
    };
    const response = {
        statusCode: responseStatusCode,
        body: JSON.stringify(responseBody)
    };
    callback(null, response);
};

exports.respondOkay = function (callback, message = 'ok', responseStatusCode = 200) {
    const responseBody = {
        "result": message
    };
    const response = {
        statusCode: responseStatusCode,
        body: JSON.stringify(responseBody)
    };
    callback(null, response);
};