'use client'

import { Stack, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow } from "@mui/material";
import { ColumnType } from "../playlist/slug/playlist.table";
import Image from "next/image";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useTrackContext } from "@/hooks/use.track.context";
import Link from "next/link";
import { convertSlugUrl } from "@/lib/utils/api";

interface IProps {
    dataSearch: ITrackTop[]
    query: string
}

const SearchTrack = (props: IProps) => {
    const { dataSearch, query } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext();

    // console.log('>>> check data Search: ', dataSearch)
    const handlePlay = (record: ITrackTop) => {
        setCurrentTrack({
            ...record,
            isPlaying: true,
        })
        console.log('>>>> check onclick track: ', record)
    }

    const handlePause = (record: ITrackTop) => {
        setCurrentTrack({
            ...record,
            isPlaying: false,
        })
        console.log('>>>> check onclick track: ', record)
    }

    const columns: ColumnType<ITrackTop>[] = [
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
                                <Link href={`/track/${convertSlugUrl(record.title)}-${record._id}.html?audio=${record.trackUrl}`}>
                                    {record.title} - {record.artist}
                                </Link>
                            </div>
                            <div className='line-clamp-1 break-all text-ellipsis whitespace-normal'>
                                <Link href={`/profile/${record.uploader?._id}`}>
                                    <span className='track-uploader cursor-pointer text-[#9b9a9a] hover:underline hover:text-[#121212]'>
                                        {record?.uploader?.name ?? 'uploader'}
                                    </span>
                                </Link>
                            </div>
                        </Stack>
                    </Stack>

                </div>
            )
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
            <div className="text-2xl font-bold px-[24px] pb-6">
                {
                    dataSearch.length > 0 ?
                        `Search results for “${query}”`
                        :
                        `Sorry we didn't find any results for “${query}”.`
                }
            </div>
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
                        {dataSearch?.map((record, index) => {
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

export default SearchTrack;