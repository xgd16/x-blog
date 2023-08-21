import ArticleDisplay from "../components/articleDisplay/articleDisplay";
import {useEffect, useState} from "react";
import {Col, Pagination, Row} from "antd";
import {ArticleDisplayData} from "../types/props";

const testMardown = "# 关于GF接入到服务发现和使用 (演示 Etcd 实现)\n" +
    "\n" +
    "### 1. 服务注册\n" +
    "\n" +
    "```go\n" +
    "package main\n" +
    "\n" +
    "import (\n" +
    "\t\"github.com/gogf/gf/contrib/registry/etcd/v2\"\n" +
    "\t\"github.com/gogf/gf/v2/frame/g\"\n" +
    "\t\"github.com/gogf/gf/v2/net/ghttp\"\n" +
    "\t\"github.com/gogf/gf/v2/net/gsvc\"\n" +
    ")\n" +
    "\n" +
    "func main() {\n" +
    "  // etcd.New(`127.0.0.1:2379`) 注册 Etcd 到GF服务上 同时连接到 Etcd\n" +
    "\tgsvc.SetRegistry(etcd.New(`127.0.0.1:2379`))\n" +
    "\t// g.Server(`hello.svc`) 注册的服务名字叫 hello.svc\n" +
    "\ts := g.Server(`hello.svc`)\n" +
    "\ts.BindHandler(\"/\", func(r *ghttp.Request) {\n" +
    "\t\tg.Log().Info(r.Context(), `request received`)\n" +
    "\t\tr.Response.Write(`Hello world`)\n" +
    "\t})\n" +
    "\ts.Run()\n" +
    "}\n" +
    "```\n" +
    "\n" +
    "### 2. 调用端 通过 Etcd 进行访问\n" +
    "\n" +
    "```go\n" +
    "package main\n" +
    "\n" +
    "import (\n" +
    "\t\"github.com/gogf/gf/contrib/registry/etcd/v2\"\n" +
    "\t\"github.com/gogf/gf/v2/frame/g\"\n" +
    "\t\"github.com/gogf/gf/v2/net/gsel\"\n" +
    "\t\"github.com/gogf/gf/v2/net/gsvc\"\n" +
    "\t\"github.com/gogf/gf/v2/os/gctx\"\n" +
    ")\n" +
    "\n" +
    "func main() {\n" +
    "  // etcd.New(`127.0.0.1:2379`) 注册 Etcd 到GF服务上 同时连接到 Etcd\n" +
    "\tgsvc.SetRegistry(etcd.New(`127.0.0.1:2379`))\n" +
    "  // 调用服务时 统一负载方式\n" +
    "\tgsel.SetBuilder(gsel.NewBuilderRoundRobin())\n" +
    "\n" +
    "\tfor i := 0; i < 10; i++ {\n" +
    "\t\tctx := gctx.New()\n" +
    "\t\tres := g.Client().GetContent(ctx, `http://hello.svc/`)\n" +
    "\t\tg.Log().Info(ctx, res) // 输出 Hello world\n" +
    "\t}\n" +
    "}\n" +
    "```\n" +
    "\n" +
    "负载策略\n" +
    "\n" +
    "- `LeastConnection` 最小连接数 - 优先访问当前连接最少的服务\n" +
    "- `Random` 随机访问 - 随机一个服务进行访问\n" +
    "- `RoundRobin` 轮训访问 - 发现的服务进行轮换访问\n" +
    "- `Weight` 权重访问 - 根据设置的权重进行访问 服务注册时需要设置`Weight`参数。"


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
    // 动态处理内容函数
    useEffect(() => {
        // 处理右侧展示框动态大小
        setContentBoxSize(calcArticleDisplaySize())
        window.addEventListener("resize", () => {
            setContentBoxSize(calcArticleDisplaySize())
        })
        // 获取展示模块数据
        let testData:ArticleDisplayData[] = []
        for (let i = 0; i < 9; i++) {
            testData.push({
                title: `test_${i}`,
                content: testMardown,
                createTime: "2023-08-19 12:00:00"
            })
        }
        setArticleList(testData)
        let dataTotal = 10
        // 计算最适合的展示方式
        setColSizeInfo(calcColSizeInfo(testData.length))
        // 分页数据
        setPaginationTotal(dataTotal)
        // 是否使用分页位置
        setRowHeight(dataTotal <= 9 ? '100%' : 'calc(100% - 60px)')
    }, []);
    // 渲染页面
    return (
        <>
            <Row style={{height: rowHeight, width: '100%'}}>
                {
                    articleList.map((item, k) => {
                        return <Col span={colSizeInfo.span} key={`${item.title}_${k}`} style={{width: contentBoxSize.width,padding: '10px',height: `calc(100% / ${colSizeInfo.yCount})`}}><ArticleDisplay data={item} /></Col>
                    })
                }
            </Row>
            <Pagination
                style={{margin: "0 auto"}}
                total={paginationTotal}
                hideOnSinglePage={true}
                showTotal={(total, range) => `${range[0]}-${range[1]}条 总${total}条`}
                defaultPageSize={9}
                defaultCurrent={1}
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