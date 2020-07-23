export const getBase64 = (img:any, callback:any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}


export const getBase64FromUrl = (url:string) => {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
        xhr.addEventListener("load", () => {
            const reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.addEventListener("loadend", () => {
                resolve(reader.result);
            });
        });
    })
}