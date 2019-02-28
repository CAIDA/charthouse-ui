import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

class Tile extends React.Component {

    static propTypes = {
        to: PropTypes.string.isRequired,
        thumb: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.node.isRequired,
        disabled: PropTypes.bool // TODO
    };

    static defaultProps = {
        disabled: false
    };

    render () {
        return <Link to={this.props.to}>
            <div className="col-md-4">
                <div className="thumbnail">
                    <img src={this.props.thumb}/>
                    <div className="caption text-center">
                        <h4>
                            {this.props.title}
                        </h4>
                        {this.props.description}
                    </div>
                </div>
            </div>
        </Link>;
    }
}

class TileGrid extends React.Component {

    static propTypes = {
        title: PropTypes.node,
        children: PropTypes.arrayOf(PropTypes.objectOf(Tile)).isRequired
    };

    render() {
        return <div>
            {this.props.title ? <h3>{this.props.title}</h3> : null }
            <div className="row row-thumbs">
                {this.props.tiles}
            </div>
        </div>
    }
}

export {
    TileGrid,
    Tile
};
