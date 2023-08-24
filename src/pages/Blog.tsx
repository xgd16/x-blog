import ArticleDisplay from "../components/articleDisplay/articleDisplay";
import {useLocation} from "react-router-dom";
import {ArticleDisplayData} from "../types/props";
import {useEffect, useState} from "react";

// interface BlogProps {
//     data: ArticleDisplayData
// }

export default function Blog() {
    // 获取传递过来的数据
    const geLocationData = useLocation()
    // 将数据解析
    const [data, setData] = useState<ArticleDisplayData>(geLocationData.state)
    // 渲染数据
    useEffect(() => {
        // 将按钮显示修改为 true
        data.viewBackButton = true
        setData(data)
    }, [data])

    return (
        <ArticleDisplay data={data} />
    )
}