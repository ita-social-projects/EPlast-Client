import React, { useState } from "react";

import { Tabs } from "antd";
const { TabPane } = Tabs;

export enum TabRenderMode {
    Default,
    UnmountOther,
}

interface TabInputsProps {
    renderMode: TabRenderMode
    pairs: {
        title: string
        content: JSX.Element
        disabled?: boolean
    }[]
}

const TabList: React.FC<TabInputsProps> = ({ pairs, renderMode }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (key: number) => {
        setActiveTab(key)
    }

    return (
        <Tabs onChange={e => handleChange(Number(e))} defaultActiveKey={activeTab.toString()}>
            {pairs.map((p, i) =>
                <TabPane disabled={p.disabled} tab={p.title} key={i}>
                    {renderMode === TabRenderMode.UnmountOther &&
                        activeTab !== i ? <></> : p.content}
                </TabPane>
            )}
        </Tabs>
    );
}

export default TabList;