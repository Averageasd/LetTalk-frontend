export function parseData(data) {
    const jsonData = {};
    const formElements = Array.from(data);
    for (const element of formElements) {
        if (element['name']) {
            jsonData[element['name']] = element.value;
        }
    }
    return jsonData;
}