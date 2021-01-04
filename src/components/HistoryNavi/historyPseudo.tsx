import React from "react";

class PsevdonimCreator {
    static pseudonimLocation: { userId: string, psevdonim: string }[] = sessionStorage.getItem("pseudonimLocation") !== null ? JSON.parse(sessionStorage['pseudonimLocation']) : [];

    static setPseudonimLocation = (adressPsevdo: string, userId: string) => {
        if (PsevdonimCreator.pseudonimLocation.find((x: { userId: string; }) => x.userId === userId) == undefined) {
            let ps = {
                userId: `${userId}`,
                psevdonim: `${adressPsevdo}`,
            };
            PsevdonimCreator.pseudonimLocation.push(ps);
        }
        sessionStorage.setItem("pseudonimLocation", JSON.stringify(PsevdonimCreator.pseudonimLocation));
    }
}
export default PsevdonimCreator;