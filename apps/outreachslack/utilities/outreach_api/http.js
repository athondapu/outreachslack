const bearerToken = process.env.OUTREACH_BEARER_TOKEN;

const { getDecryptedAccessToken } = require('../utils');
const Get = async (url, slackUserId) => {
    const { accessToken, tokenType } = getDecryptedAccessToken(slackUserId);
    // console.log("accessToken: ", accessToken);
    // console.log("tokenType: ", tokenType);
    const response = await fetch(url, {
        headers: new Headers({
            // Authorization: `${tokenType} ${accessToken}`,
            Authorization: bearerToken,
            'Content-Type': 'application/json'
        })
    });
    // console.log("Response: ", response);
    if (response.status != 200) {
        const body = await response.text();
        const error = `Failed to call my endpoint! (status: ${response.status}, body: ${body})`;
        return { error, data: null };
    }
    return { data: await response.json(), error: null };
};

const Post = async (url, body) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            Authorization: bearerToken,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(body)
    });

    // console.log("response: ", response);

    const { errors, data } = await response.json();
    if (response.status != 200) {
        // const body = await response.text();
        console.log('Response JSON: ', errors);
        const error = `Failed to call my endpoint! (status: ${response.status}, body: ${errors})`;
        // console.log("error: ", error);
        return { errors, data: null };
    }
    return { data, errors: null };
};

const Put = async (url, body) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: new Headers({
            Authorization: bearerToken,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(body)
    });

    if (response.status != 200) {
        const body = await response.text();
        const error = `Failed to call my endpoint! (status: ${response.status}, body: ${body})`;
        return { error };
    }
    return response.json();
};

const Delete = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            Authorization: bearerToken,
            'Content-Type': 'application/json'
        })
    });

    if (response.status != 200) {
        const body = await response.text();
        const error = `Failed to call my endpoint! (status: ${response.status}, body: ${body})`;
        return { error, data: null };
    }
    return { data: response.json(), error: null };
};

const MarkComplete = async (id) => {
    const url = `${process.env.OUTREACH_TASK_STAGING_API_URL}/${id}/actions/markComplete`;
    console.log('url: ', url);
    return await Post(url, {});
};

module.exports = {
    Get,
    Post,
    Put,
    Delete,
    MarkComplete
};
