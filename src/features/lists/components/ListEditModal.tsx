import React, {useEffect, useState} from 'react';
import {Avatar, Button, Empty, Input as AntInput, List, message, Modal, Spin, Tabs} from 'antd';
import {DeleteOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Movie, useMovies} from '@/features/movies';
import {List as MovieList, UpdateListRequest} from '../types';
import {IMAGE_BASE_URL, POSTER_SIZES} from '@/config';

const { TabPane } = Tabs;
const { Search } = AntInput;

interface ListEditModalProps {
    visible: boolean;
    list: MovieList | null;
    form: any;
    loading: boolean;
    onClose: () => void;
    onUpdate: (values: UpdateListRequest) => void;
    onAddMovie: (listId: number, movieId: number) => void;
    onRemoveMovie: (listId: number, movieId: number) => void;
}

export const ListEditModal: React.FC<ListEditModalProps> = ({
                                                                visible,
                                                                list,
                                                                onClose,
                                                                onAddMovie,
                                                                onRemoveMovie
                                                            }) => {
    const [activeTab] = useState('movies');
    const [searchTerm, setSearchTerm] = useState('');
    const { search, searchForMovies, clearSearchResults } = useMovies();
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (!visible) {
            clearSearchResults();
            setSearchTerm('');
        }
    }, [visible, clearSearchResults]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.trim()) {
            setSearchLoading(true);
            searchForMovies(value).finally(() => {
                setSearchLoading(false);
            });
        } else {
            clearSearchResults();
        }
    };

    const handleAddMovie = (movieId: number) => {
        if (list) {
            onAddMovie(list.id, movieId);
            message.success(`Movie added to "${list.name}"`);
        }
    };

    const handleRemoveMovie = (movieId: number) => {
        if (list) {
            onRemoveMovie(list.id, movieId);
            message.success(`Movie removed from "${list.name}"`);
        }
    };

    return (
        <Modal
            title={`Edit List: ${list?.name}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Tabs
                activeKey={activeTab}
                style={{ marginBottom: 16 }}
            >

                <TabPane tab="Manage Movies" key="movies" disabled={!list}>
                    {list && (
                        <div>
                            <div className="movie-management-container">
                                <div className="current-movies" style={{ marginBottom: 24 }}>
                                    <h3>Current Movies ({list.items?.length || 0})</h3>
                                    {list.items && list.items.length > 0 ? (
                                        <List
                                            dataSource={list.items}
                                            renderItem={(movie: Movie) => (
                                                <List.Item
                                                    actions={[
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleRemoveMovie(movie.id)}
                                                            key="remove"
                                                        >
                                                            Remove
                                                        </Button>
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                src={
                                                                    movie.poster_path
                                                                        ? `${IMAGE_BASE_URL}/${POSTER_SIZES.small}${movie.poster_path}`
                                                                        : null
                                                                }
                                                                size={64}
                                                                shape="square"
                                                            />
                                                        }
                                                        title={movie.title}
                                                        description={
                                                            <span>
                                {movie.release_date && new Date(movie.release_date).getFullYear()}
                                                                {movie.vote_average > 0 && ` • Rating: ${movie.vote_average.toFixed(1)}/10`}
                              </span>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <Empty description="No movies in this list yet" />
                                    )}
                                </div>

                                <div className="add-movies">
                                    <h3>Add Movies</h3>
                                    <Search
                                        placeholder="Search for movies to add"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onSearch={handleSearch}
                                        enterButton={<SearchOutlined />}
                                        loading={searchLoading}
                                        style={{ marginBottom: 16 }}
                                    />

                                    {search?.results && search.results.length > 0 ? (
                                        <List
                                            dataSource={search.results}
                                            renderItem={(movie: Movie) => {
                                                const isInList = list?.items?.some(item => item.id === movie.id);

                                                return (
                                                    <List.Item
                                                        actions={[
                                                            isInList ? (
                                                                <Button type="text" disabled>
                                                                    Already in list
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    type="primary"
                                                                    icon={<PlusOutlined />}
                                                                    onClick={() => handleAddMovie(movie.id)}
                                                                >
                                                                    Add
                                                                </Button>
                                                            )
                                                        ]}
                                                    >
                                                        <List.Item.Meta
                                                            avatar={
                                                                <Avatar
                                                                    src={
                                                                        movie.poster_path
                                                                            ? `${IMAGE_BASE_URL}/${POSTER_SIZES.small}${movie.poster_path}`
                                                                            : null
                                                                    }
                                                                    size={64}
                                                                    shape="square"
                                                                />
                                                            }
                                                            title={movie.title}
                                                            description={
                                                                <span>
                                  {movie.release_date && new Date(movie.release_date).getFullYear()}
                                                                    {movie.vote_average > 0 && ` • Rating: ${movie.vote_average.toFixed(1)}/10`}
                                </span>
                                                            }
                                                        />
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    ) : searchTerm ? (
                                        search.loading ? (
                                            <div style={{ textAlign: 'center', padding: 24 }}>
                                                <Spin tip="Searching for movies..." />
                                            </div>
                                        ) : (
                                            <Empty description="No movies found. Try another search term." />
                                        )
                                    ) : (
                                        <Empty description="Search for movies to add to your list" />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </TabPane>
            </Tabs>
        </Modal>
    );
};