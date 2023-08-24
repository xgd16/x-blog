import {JSX, useEffect, useState} from "react";
import './articleDisplay.scss'
import '../../scss/markdown.css'
import {ArticleDisplayData} from "../../types/props";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {Link} from "react-router-dom";
import {SwapLeftOutlined} from "@ant-design/icons";

interface ArticleDisplayProps {
    data: ArticleDisplayData
}


export default function ArticleDisplay(props: ArticleDisplayProps):JSX.Element {
    const [linkData, setLinkData] = useState(props.data)

    useEffect(() => {
        linkData.viewBackButton = true
        setLinkData(linkData)
    }, [linkData])

    return (
        <div className={"article-item"}>
            {backButton(props.data.viewBackButton ?? false)}
            <Link to={'/blog'} state={linkData} style={{cursor: "pointer"}}>
                <div className={"article-item-title"}>
                    {props.data.title}
                </div>
            </Link>
            <div className={"article-item-content markdown-body"}>
                <ReactMarkdown
                    children={props.data.content}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            if (! (!inline && match)) className += ' one-code'
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    showLineNumbers={true}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                />
            </div>
            <div className={"article-item-footer"}>{props.data.createTime}</div>
        </div>
    )
}

const backButton = (isView: boolean):JSX.Element => {
    if (!isView) return <></>

    return (
        <Link to={'/'} ><div className={"article-item-back"}><SwapLeftOutlined /></div></Link>
    )
}