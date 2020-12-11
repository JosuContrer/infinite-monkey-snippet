
export const sanitizeText = function(text) {
    const backspace = String.fromCharCode(8);
    const formfeed = String.fromCharCode(12);
    const newline = String.fromCharCode(10);
    const carriage = String.fromCharCode(13);
    const tab = String.fromCharCode(9);
    const quote = String.fromCharCode(34);
    const backslash = String.fromCharCode(92);

    let cursedArray = [backslash, backspace, formfeed, newline, carriage, tab, quote];
    let blessedArray = ['\\', '\\b', '\\f', '\\n', '\\r', '\\t', '\\"']

    let snipText = text.replace(/[\x5c\x08\x0c\x0a\x0d\x09\x22]/g, function(x) {
        let i = cursedArray.indexOf(x);

        return blessedArray[i];
    });

    return snipText;
}

export const callLambda = function(extThis, url, type, data=null) {
    console.log("Request " + type + " @ " + url);

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);

        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status < 300){
                //console.log("XHR: " + xhr.responseText);

                resolve(JSON.parse(xhr.responseText));
            }
            else {
                console.log("    Request Failed: " + xhr.status);

                reject(xhr.statusText);
            }
        };

        xhr.onerror = () => reject(xhr.statusText);

        if (data !== null) {
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(data));
        }
        else {
            xhr.send();
        }
    });
}