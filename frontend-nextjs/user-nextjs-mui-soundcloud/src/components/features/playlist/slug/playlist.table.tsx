'use client'

import { Stack, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Image from 'next/image';
import { Key, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useTrackContext } from '@/hooks/use.track.context';


interface ColumnSharedType {
    title?: React.ReactNode;
    key?: Key;
    className?: string;
    hidden?: boolean;
    align?: AlignType;
}

export type AlignType = 'inherit' | 'left' | 'center' | 'right' | 'justify';
interface ColumnType<RecordType> extends ColumnSharedType {
    dataIndex: 'stt' | 'title' | 'createdAt' | 'duration' | 'artist'
    render?: (value: any, record: RecordType, index: number) => React.ReactNode
    width?: number;
    minWidth?: number;
}


interface IProps {
    playlist: IPlaylist;
}


const PlaylistTable = (props: IProps) => {
    const { playlist } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext();

    const tracks = playlist?.tracks;
    const [listTrack, setListTrack] = useState(tracks);

    const handlePlay = (record: IPlaylistTrack) => {
        setCurrentTrack({
            ...record,
            isPlaying: true,
        })
        console.log('>>>> check onclick track: ', record)
    }

    const handlePause = (record: IPlaylistTrack) => {
        setCurrentTrack({
            ...record,
            isPlaying: false,
        })
        console.log('>>>> check onclick track: ', record)
    }

    const columns: ColumnType<IPlaylistTrack>[] = [
        {
            dataIndex: 'stt',
            title: '#',
            width: 1,
            render: (value, record, index) => (
                <div className='relative inline-flex h-[18px] w-[18px] min-h-[18px] min-w-[18px] justify-center items-center'>
                    <span className='absolute group-hover:hidden duration-0'>
                        {index + 1}
                    </span>
                    <button
                        className='absolute opacity-0 group-hover:opacity-100 flex justify-center items-center h-full transition-opacity duration-0'
                    >
                        {
                            currentTrack._id === record._id && currentTrack.isPlaying
                            &&
                            <span onClick={() => handlePause(record)}>
                                <PauseIcon sx={{ fontSize: 18 }} />
                            </span>
                        }
                        {
                            (currentTrack._id !== record._id || currentTrack.isPlaying === false && currentTrack._id === record._id)
                            &&
                            <span onClick={() => handlePlay(record)}>
                                <PlayArrowIcon sx={{ fontSize: 18 }} />
                            </span>
                        }
                    </button>
                </div>
            )
        },
        {
            dataIndex: 'title',
            title: 'Title',
            render: (value, record, index) => (
                <div className='line-clamp-1 break-all text-ellipsis whitespace-normal min-w-[54px]'>
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        <div className="relative min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] bg-linear-[135deg,#70929c,#e6846e] rounded-[4px]">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${record.imgUrl}`}
                                alt="track image"
                                fill
                                sizes="100vw"
                                style={{
                                    objectFit: 'cover', // cover, contain, none
                                    borderRadius: '4px',
                                    objectPosition: 'center center',
                                }}
                            />
                        </div>
                        <Stack direction={'column'} className='min-w-[42px]'>
                            <div className='text-[16px] cursor-pointer hover:underline line-clamp-1 break-all text-ellipsis whitespace-normal'
                                style={{
                                    color: `${currentTrack._id === record._id ? '#1ed760' : ''} `,
                                }}
                            >
                                {record.title} - {record.artist}
                            </div>
                            <div className='line-clamp-1 break-all text-ellipsis whitespace-normal'>
                                <span className='track-uploader cursor-pointer text-[#9b9a9a] hover:underline hover:text-[#121212]'>
                                    {record.uploader.name}
                                </span>
                            </div>
                        </Stack>
                    </Stack>

                </div>
            )
        },
        {
            dataIndex: 'createdAt',
            title: 'Date added',
            align: 'left',
            render: (value, record, index) => {
                return (
                    <span style={{ whiteSpace: 'nowrap' }}>
                        Jun 5, 2024
                    </span>
                )
            }
        },
        {
            dataIndex: 'duration',
            title: <AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />,
            align: 'right',
            render: (value, record, index) => {
                return (
                    <>
                        3:40
                    </>
                )
            }
        },
    ];

    return (
        <>
            <div className="table-track px-[24px]">
                <Table
                    stickyHeader
                    aria-label="sticky table"
                    sx={{
                        [`& .${tableCellClasses.body}`]: {
                            borderBottom: 'none',
                        }
                    }}>
                    <TableHead>
                        <TableRow>
                            {columns?.map((column) => (
                                <TableCell
                                    key={column.dataIndex}
                                    align={column.align}
                                    style={{
                                        width: column.width,
                                        minWidth: column.minWidth,
                                    }}
                                >
                                    {column.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listTrack?.map((record, index) => {
                            return (
                                <TableRow
                                    hover role="checkbox" tabIndex={index + 1} key={record._id}
                                    className='group'
                                    sx={{
                                        '&:hover': {
                                            ".track-uploader": {
                                                color: '#121212',
                                            }
                                        }
                                    }}
                                >
                                    {columns.map((column) => {
                                        const value = (column.dataIndex in record) ? (record as any)[`${column.dataIndex}`] : '';
                                        return (
                                            <TableCell key={column.dataIndex} align={column.align}>
                                                {column.render ? column.render(value, record, index) : (
                                                    <span>
                                                        {value}
                                                    </span>
                                                )}

                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default PlaylistTable;