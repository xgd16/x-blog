import "./leftView.scss"
import React from "react";
import {GithubOutlined,InfoCircleOutlined} from "@ant-design/icons";
import {goToUrl} from "../../utils/common";

type IconListType = {
    iconName: string
    href: string
}

interface leftViewProps {
    image: string
    username: string
    iconList: IconListType[]
}

export default function LeftView(props: leftViewProps) {
    return (
        <div className={"left-view"}>
            <div className={"left-view-image-box"} style={{
                backgroundImage: `url(${props.image})`
            }}></div>
            <p className={"left-view-username"}>{props.username}</p>
            <div className={"left-view-icon-list"}>
                {
                    props.iconList.map((item, i) => {
                        switch (item.iconName) {
                            case 'github':
                                return <GithubOutlined key={`${item.iconName}_${i}`} onClick={() => {goToUrl(item.href)}}/>
                            default:
                                return <InfoCircleOutlined key={`${item.iconName}_${i}`} onClick={() => {goToUrl(item.href)}} />
                        }
                    })
                }
            </div>
        </div>
    )
}