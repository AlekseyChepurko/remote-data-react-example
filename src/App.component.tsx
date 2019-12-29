import * as React from 'react';
import { RemoteData, success, failure, pending, initial, fold } from '@devexperts/remote-data-ts';
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
    rdItems: RemoteData<string, SearchResonse['data']>;
    offset: number;
}

const gifsLimitPerRequest = 10;

class AppComponent extends React.PureComponent<unknown, AppComponentState> {
    constructor(props: unknown) {
        super(props);

        this.state = {
            searchText: null,
            rdItems: initial,
            offset: 0,
        }
    }

    loadedResults: SearchResonse['data'] = [];

    submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const searchText = formData.get(searchFieldName);

        if (typeof searchText === 'string') {
            this.loadedResults = [];

            this.setState({
                rdItems: initial,
                searchText,
            }, this.loadMore);
        }
    };

    loadMore = () => {
        const state = this.state;

        if (!!state.searchText) {
            this.setState({
                rdItems: pending,
            });

            apiRequests
                .search(state.searchText, state.offset * gifsLimitPerRequest, gifsLimitPerRequest)
                .then<SearchResonse>(response => response.json())
                .then(response => {
                    this.setState({
                        rdItems: success(response.data),
                        offset: state.offset + 1,
                    })
                })
                .catch(() => {
                    this.setState({
                        rdItems: failure('Error while downloading data'),
                    });
                })
        }
    }

    renderPending = () => {
        return (
            <Container className="loading__container">
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
            dataList.map(tile => (
                <GridListTile key={tile.id} cols={1}>
                    <Image src={tile.images.fixed_width.url} height={200} />
                </GridListTile>
            ))   
        );
    }

    renderRemoteData = () => {
        const state = this.state;

        return fold<string, SearchResonse['data'], React.ReactNode>(
            () => null,
            this.renderPending,
            this.renderError,
            items => {
                this.loadedResults = [
                    ...this.loadedResults,
                    ...items
                ];

            return this.renderDataList(items);
            },
        )(state.rdItems);
    }

    render() {
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

                <GridList cellHeight={200} cols={5} className="search-results__container">
                    {this.renderDataList(this.loadedResults)}
                    {this.renderRemoteData()}
                </GridList>

                {this.loadedResults.length !== 0 && (
                    <Fab className="load-more" color="primary" onClick={this.loadMore}>
                        <AddIcon />
                    </Fab>
                )}
            </div>
            )
    }
}

export {
    AppComponent
}
