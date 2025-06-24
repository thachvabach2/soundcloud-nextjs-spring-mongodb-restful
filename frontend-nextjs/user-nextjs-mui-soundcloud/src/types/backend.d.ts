export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        statusCode: number | string;
        message: string;
        error?: string | string[];
        data?: T;
    }

    interface ITrackTop {
        _id: string,
        title: string,
        description: string,
        category: string,
        imgUrl: string,
        trackUrl: string,
        countLike: number,
        countPlay: number,
        uploader: string,
        isDeleted: boolean,
        createdAt: string,
        updatedAt: string
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }
}
