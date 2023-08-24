import req, {Response} from "../utils/request";
import {ArticleDisplayData} from "../types/props";

export const getArticleDisplayData = (
    params: {page: number, size: number} = {page: 1, size: 10}
) => {
    return req<Response<{count: number, list: ArticleDisplayData[]}>>({
        url: "/api/getArticleDisplay",
        method: "GET",
        params
    });
};