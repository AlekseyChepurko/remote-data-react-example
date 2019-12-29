import * as React from 'react';
import { Button } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import './Image.component.css';

interface ImageProps {
    src: string;
    height: number;
    className?: string;
}

interface ImageState {
    isLoading: boolean;
    error?: string;
    imageSrc?: string;
}

class ImageComponent extends React.PureComponent<ImageProps, ImageState> {
    constructor(props: ImageProps) {
        super(props);

        this.state = {
            isLoading: false,
        }
    }

    loadImage = (src: string) => {
        const props = this.props;

        this.setState({
            isLoading: true,
        });

        const image = new Image();

        image.src = props.src;

        image.onload = () => {
            this.setState({
                imageSrc: props.src,
                isLoading: false,
            });
        };

        image.onerror = (e) => {
            this.setState({
                isLoading: false,
                error: typeof e === 'string' ? e : 'Error while loading image',
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

    renderContent = () => {
        const props = this.props;
        const state = this.state;

        if (state.isLoading) {
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
        }

        if (state.imageSrc) {
            return <img className="image image_success" src={state.imageSrc} alt=""/>
        }

        if (state.error) {
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
        return 'wtf';
    }

    render() {
    return <div className="ImageComponent">{this.renderContent()}</div>;
    }
}

export { ImageComponent };