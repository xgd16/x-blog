import ArticleDisplay from "../components/articleDisplay/articleDisplay";
import {useEffect, useState} from "react";
import {Col, Pagination, Row} from "antd";
import {ArticleDisplayData} from "../types/props";
import {getArticleDisplayData} from "../api/home";
import QueueAnim from "rc-queue-anim"
// 内容盒子的大小
type contentBoxSizeType = {
    width: number
    height: number
}

type colSizeInfo = {
    span: number
    yCount: number
}

export default function Home() {
    // 内容盒子大小
    const [contentBoxSize, setContentBoxSize] = useState<contentBoxSizeType>(calcArticleDisplaySize())
    // 渲染展示信息列表
    const [articleList, setArticleList] = useState<ArticleDisplayData[]>([])
    // 定义分页数据
    const [paginationTotal, setPaginationTotal] = useState(1)
    // row 高度
    const [rowHeight, setRowHeight] = useState("100%")
    // col 参数计算
    const [colSizeInfo, setColSizeInfo] = useState<colSizeInfo>(calcColSizeInfo(0))

    const ArticleDisplayDataHandler = (page: number = 1, size: number = 9) => {
        getArticleDisplayData({
            page: page,
            size: size
        }).then((res) => {
            let homeArticleData: ArticleDisplayData[] = []
            homeArticleData = res.data.list
            setArticleList(homeArticleData)
            // 计算最适合的展示方式
            setColSizeInfo(calcColSizeInfo(homeArticleData.length))
            let dataTotal = res.data.count
            // 分页数据
            setPaginationTotal(dataTotal)
            // 是否使用分页位置
            setRowHeight(dataTotal <= 9 ? '100%' : 'calc(100% - 60px)')
        })
    }

    useEffect(() => {
        // 处理右侧展示框动态大小
        setContentBoxSize(calcArticleDisplaySize())
        window.addEventListener("resize", () => {
            setContentBoxSize(calcArticleDisplaySize())
        })
        // 获取展示模块数据
        ArticleDisplayDataHandler()

    }, []);

    const pageChange = (page: number, pageSize: number) => {
        const homeArticleData:ArticleDisplayData[] =[]
        setArticleList(homeArticleData)
        // 计算最适合的展示方式
        setColSizeInfo(calcColSizeInfo(homeArticleData.length))
        setTimeout(() => {
            ArticleDisplayDataHandler(page, pageSize)
        }, 310)
    }
    // 渲染页面
    return (
        <>
            <QueueAnim
                className={'ant-row'}
                style={{height: rowHeight, width: '100%', display: 'flex', flexFlow: 'row wrap', minWidth: 0}}
                // leaveReverse={true}
                type={'bottom'}
                forcedReplay={true}
                duration={250}
                interval={5}
            >
                {
                    articleList.map((item, k) => {
                        return <Col span={colSizeInfo.span} key={`${item.title}_${k}`} style={{width: contentBoxSize.width,padding: '10px',height: `calc(100% / ${colSizeInfo.yCount})`}} ><ArticleDisplay data={item} /></Col>
                    })
                }
            </QueueAnim>
            <Pagination
                style={{margin: "0 auto"}}
                total={paginationTotal}
                hideOnSinglePage={true}
                showTotal={(total, range) => `${range[0]}-${range[1]}条 总${total}条`}
                defaultPageSize={9}
                defaultCurrent={1}
                onChange={pageChange}
                showSizeChanger={false}
            />
        </>
    )
}

const calcColSizeInfo = (totalCount: number):colSizeInfo  => {
    let span: number = 8, yCount: number = 3
    if (totalCount <= 0) return {span: span, yCount: yCount}

    if (totalCount === 1) {
        span = 24
        yCount = 1
    } else if (totalCount === 2) {
        span = 12
        yCount = 1
    } else if (totalCount >= 3 && totalCount <= 4) {
        span = 12
        yCount = 2
    } else if (totalCount >= 5 && totalCount <= 6) {
        span = 8
        yCount = 2
    }

    return {
        span: span,
        yCount: yCount
    }
}

const calcArticleDisplaySize = (): contentBoxSizeType => {
    const size = getSize()
    return {
        width: size.width / 3,
        height: size.height / 3
    }
}

// 获取当前屏幕大小
const getSize = (): contentBoxSizeType => {
    const contentBox = document.getElementById("content-box-id")
    if (!contentBox) {
        return {width: 0, height: 0}
    }
    return {
        width: contentBox.offsetWidth,
        height: contentBox.offsetHeight
    }
}