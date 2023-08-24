export interface ArticleDisplayData {
    count: number;
    list?: ArticleDisplayList[];
}

export interface ArticleDisplayList {
    content?: string;
    createTime?: string;
    title?: string;
}
