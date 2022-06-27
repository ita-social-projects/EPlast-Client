import { Button, Form, Input } from "antd";
import React, { useRef, useState } from "react"
import { boolean } from "yup";
import TabList, { TabRenderMode } from "./TabList";

interface TabInputListProps {
    items: {
        tabTitle: string
        formItem: React.ComponentProps<typeof Form.Item>
        input: React.ComponentProps<typeof Input>
    }[]
}

const errorClass = "ant-form-item-has-error"

const TabInputList: React.FC<TabInputListProps> = ({ items }) => {

    const [indexError, setIndexError] = useState<number | null>(null);

    const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
        setTimeout(() => {
            const elements = document.querySelectorAll(".for-checking-error");
            const currElement = elements[index];
            const errorClassContain = currElement.classList.contains(errorClass);
            if (errorClassContain) {
                setIndexError(index);
            } else {
                setIndexError(null);
            }
        }, 5)
    }

    return (
        <>
            {
                <TabList renderMode={TabRenderMode.Default}
                    pairs={
                        items.map((item, index) => ({
                            title: item.tabTitle,
                            content: (
                                <Form.Item className="for-checking-error" {...item.formItem}>
                                    <Input
                                        onInput={(e) => handleInput(e, index)}
                                        {...item.input}
                                    />
                                </Form.Item>
                            ),
                            disabled: indexError !== index && indexError !== null
                        }))
                    }
                />

            }

        </>
    );
}

export default TabInputList;