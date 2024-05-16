import {parseData} from "../helper/parseFormData.js";


function getFetchInfo(data, url, method) {
    const tempFetchInfo = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors',
    };
    let curUrl = url;
    tempFetchInfo['method'] = method;
    if (data['formData']) {
        const parsedData = parseData(data['formData']);
        tempFetchInfo['body'] = JSON.stringify(parsedData);
    } else if (data['param']) {
        curUrl += '/' + data['param'];
    }

    return {fetchInfo: tempFetchInfo, finalUrl: curUrl};
}

export async function post(data, url) {
    const {fetchInfo, finalUrl} = getFetchInfo(data, url, 'POST');
    const res = await fetch(`${finalUrl}`, fetchInfo);
    return await res.json();
}

export async function get(data, url) {
    const {fetchInfo, finalUrl} = getFetchInfo(data, url, 'GET');
    const res = await fetch(`${finalUrl}`, fetchInfo);
    return await res.json();
}