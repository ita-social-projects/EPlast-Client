import { Tooltip } from "antd";
import React from "react";

export const parameterMaxLength = 21;
function addTooltip (number: number, text: string) {
   return (text?.length > number) ?
        <Tooltip title={text}>
            <span>{text.slice(0, number - 1) + "..."}</span>
        </Tooltip>
    : text  
}
  
export default addTooltip;