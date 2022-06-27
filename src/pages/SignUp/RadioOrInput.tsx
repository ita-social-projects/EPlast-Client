import { Form, Input, Radio, Space } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import styles from "./SignUp.module.css";

interface RadioOrInputProps {
    radioList: string[]
    inputLabel: string
    setField: (value: string) => void
}

const RadioOrInput: React.FC<RadioOrInputProps> = ({ inputLabel, radioList, setField }) => {
    const [value, setValue] = useState<string>();
    const [visibleInput, setVisibleInput] = useState(false);

    const radioInputRef = useRef<Input>(null);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as any;
        setField(target.value);
    };

    const handleRadioChange = (e: RadioChangeEvent, value: string) => {
        setValue(e.target.value);
        setVisibleInput(false);
        setField(value);
    };

    const handleRadioInputChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
        setVisibleInput(e.target.checked);
        setField(radioInputRef.current?.state.value);
    };

    return (

        <Radio.Group value={value}>
            <Space direction="vertical">
                {radioList.map((r, i) =>
                    <Radio onChange={(e) => handleRadioChange(e, r)}
                        key={r}
                        value={i}
                    >{r}</Radio>
                )}
                <Radio
                    onChange={handleRadioInputChange}
                    value={radioList.length}
                >
                    <span>
                        {inputLabel}
                    </span>
                    {visibleInput &&
                        <Input ref={radioInputRef} className={styles.RadioInput} onInput={handleInput} />
                    }
                </Radio>
            </Space>
        </Radio.Group>
    );
}

export default RadioOrInput;