<<<<<<< HEAD
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
=======
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
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
}