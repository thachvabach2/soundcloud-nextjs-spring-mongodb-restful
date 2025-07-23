import { Dispatch, RefObject, SetStateAction } from "react";
import H5AudioPlayer from "react-h5-audio-player";

export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: Record<string, any>;
        useCredentials?: boolean;
        headers?: Record<string, string>;
        nextOption?: Omit<RequestInit, 'method' | 'body' | 'queryParams' | 'useCredentials' | 'headers'>
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
        artist: string,
        description: string,
        category: string,
        imgUrl: string,
        trackUrl: string,
        countLike: number,
        countPlay: number,
        uploader: {
            _id: string;
            email: string;
            name: string;
            role: string;
            type: string;
        },
        isDeleted: boolean,
        createdAt: string,
        updatedAt: string
    }

    interface IModelPaginate<T> {
        meta: {
            pageNumber: number;
            pageSize: number;
            totalElement: number;
            totalPage: number;
        },
        result: T[]
    }

    interface IShareTrack extends ITrackTop {
        isPlaying: boolean;
    }

    interface ITrackContext {
        currentTrack: IShareTrack
        setCurrentTrack: Dispatch<SetStateAction<IShareTrack>>
    }

    export interface ITrackComment {
        _id: string;
        content: string;
        moment: number;
        user: {
            _id: string;
            email: string;
            name: string;
            role: string;
            type: string;
        };
        track: {
            _id: string;
            title: string;
            description: string;
            trackUrl: string;
        };
        isDeleted: boolean;
        createdAt: string;
        createdBy: string;
        updatedAt: string;
        updatedBy: string;
    }

    export interface ITrackLike {
        _id: string;
        title: string;
        artist: string;
        description: string;
        category: string;
        imgUrl: string;
        trackUrl: string;
        countLike: number;
        countPlay: number;
    }

    interface IUpload {
        fileName: string;
        uploadedAt: string;
    }
}
