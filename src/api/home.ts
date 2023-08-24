import req, {Response} from "../utils/request";
import {ArticleDisplayData} from "../types/api/home";

export const getArticleDisplayData = (
    params: {page: number, size: number} = {page: 1, size: 10}
) => {
    return req<Response<ArticleDisplayData>>({
        url: "/api/getArticleDisplay",
        method: "GET",
        params
    });
};