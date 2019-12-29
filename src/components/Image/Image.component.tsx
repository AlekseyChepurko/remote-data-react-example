import * as React from 'react';
import { RemoteData, success, failure, pending, initial, fold } from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { Button } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import './Image.component.css';

interface ImageProps {
    src: string;
    height: number;
    className?: string;
}

interface ImageState {
    image: RemoteData<string, string>;
}

class ImageComponent extends React.PureComponent<ImageProps, ImageState> {
    constructor(props: ImageProps) {
        super(props);

        this.state = {
            image: initial,
        }
    }

    loadImage = (src: string) => {
        const props = this.props;

        this.setState({
            image: pending,
        });

        const image = new Image();

        image.src = props.src;

        image.onload = () => {
            this.setState({
                image: success(props.src),
            });
        };

        image.onerror = (e) => {
            this.setState({
                image: failure(typeof e === 'string' ? e : 'Error while loading image'),
            });
        }
    }

    tryAgain = (src: string) => () => {
        this.loadImage(src);
    };

    componentDidMount() {
        const props = this.props;
        this.loadImage(props.src);
    }

    renderPending = () => {
        const props = this.props;

        return (
            <Skeleton
                className="ImageComponent__Skeleton"
                width={props.height}
                height={props.height}
                variant="rect"
            >
                <img className="image" src="slowpoke.png" alt=""/>
            </Skeleton>
        );
    };

    renderError = () => {
        const props = this.props;

        return (
            <Skeleton
                className="ImageComponent__Skeleton"
                width={props.height}
                height={props.height}
                variant="rect"
                disableAnimate
            >
                <Button variant="contained" color="primary" onClick={this.tryAgain(props.src)}>Try again</Button>
            </Skeleton>
        );
    }

    renderImage = (src: string) => {
        return <img className="image image_success" src={src} alt=""/>
    };

    renderContent = () => {
        const state = this.state;

        return pipe(
            state.image,
            fold(
                () => null,
                this.renderPending,
                this.renderError,
                this.renderImage,
            )
        );
    }

    render() {
    return <div className="ImageComponent">{this.renderContent()}</div>;
    }
}

export { ImageComponent };