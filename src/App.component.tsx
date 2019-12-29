import * as React from 'react';
import {apiRequests, SearchResonse} from './api';
import {
    Button,
    GridList,
    GridListTile,
    TextField,
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Image } from './components';
import './App.component.css';

const searchFieldName = 'search';

interface AppComponentState {
    searchText: string | null,
    items: SearchResonse['data'] | null;
    isLoading: boolean;
    error: null | string;
    offset: number;
}

const gifsLimitPerRequest = 10;

class AppComponent extends React.PureComponent<unknown, AppComponentState> {
    constructor(props: unknown) {
        super(props);

        this.state = {
            searchText: null,
            error: null,
            items: null,
            isLoading: false,
            offset: 0,
        }
    }

    submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const searchText = formData.get(searchFieldName);

        if (typeof searchText === 'string') {
            this.setState({
                searchText: searchText,
                items: null,
                offset: 0,
            }, this.loadMore);
        }
    };

    loadMore = () => {
        const state = this.state;

        if (!!state.searchText) {
            this.setState({
                isLoading: true,
                error: null,
            });

            apiRequests
                .search(state.searchText, state.offset * gifsLimitPerRequest, gifsLimitPerRequest)
                .then<SearchResonse>(response => response.json())
                .then(response => 
                    this.setState({
                        items: [...(state.items || []), ...response.data],
                        isLoading: false,
                        offset: state.offset + 1,
                    })
                )
                .catch(() => {
                    this.setState({
                        error: 'Error while downloading data',
                        isLoading: false,
                    });
                })
        }
    }

    renderLoadindContainer = () => {
        return (
            <Container fixed className="loading__container">
                <CircularProgress />
            </Container>
        );
    };

    renderError = (error: string) => {
        return (
            <div className="error__container">
                <div className="error__text">{error}</div>
                <Button type="submit" onClick={this.loadMore}>Retry</Button>
            </div>
        );
    };

    renderDataList = (dataList: SearchResonse['data']) => {
        return (
            <>
                <GridList cellHeight={200} cols={5} className="search-results__container">
                    {dataList.map(tile => (
                        <GridListTile key={tile.id} cols={1}>
                            <Image src={tile.images.fixed_width.url} height={200} />
                        </GridListTile>
                    ))}
                </GridList>
                <Fab className="load-more" color="primary" onClick={this.loadMore}>
                    <AddIcon />
                </Fab>
            </>
        )
    }

    render() {
        const state = this.state;

        return (
            <div className="search__form-container">
                <form className="search__form" onSubmit={this.submitSearch}>
                    <TextField
                        className="text__filed"
                        type="text"
                        placeholder="Serach"
                        name={searchFieldName}
                        />
                    <Button type="submit">search</Button>
                </form>
                <div style={{height: 40}} />

                {state.isLoading && this.renderLoadindContainer()}
                {state.items && this.renderDataList(state.items)}
                {state.error && this.renderError(state.error)}
            </div>
            )
    }
}

export {
    AppComponent
}
