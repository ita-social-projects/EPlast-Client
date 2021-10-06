import { Tooltip } from "antd";
import React from "react";

function extendedTitleTooltip(number: number, text: string) {
    return (text?.length > number) ?
        <Tooltip title={text}>
            <span>{text.slice(0, number - 1) + "..."}</span>
        </Tooltip>
        : text
}
export const parameterMaxLength = 20;
export default extendedTitleTooltip;