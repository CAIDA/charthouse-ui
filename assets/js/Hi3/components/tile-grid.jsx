import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

import 'Hi3/css/tile-grid.css';

const TILES_PER_ROW = 3;

class Tile extends React.Component {

    static propTypes = {
        to: PropTypes.string.isRequired,
        thumb: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        disabled: PropTypes.bool // TODO
    };

    static defaultProps = {
        disabled: false
    };

    render () {
        return <Link to={this.props.to}>
            <div className={`tile col-md-${12/TILES_PER_ROW}`}>
                <div className=' panel panel-default'>
                    <div className="thumbnail panel-body">
                        <img src={this.props.thumb}/>
                        <div className="caption text-center">
                            <h4>
                                {this.props.title}
                            </h4>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        </Link>;
    }
}

class TileGrid extends React.Component {

    static propTypes = {
        title: PropTypes.node
    };

    render() {
        let children = this.props.children.slice();
        let rows = [];
        while (children.length) {
            rows.push(children.splice(0, TILES_PER_ROW))
        }
        return <div className='tilegrid'>
            {this.props.title ? <h3>{this.props.title}</h3> : null }
            {rows.map((row, idx) => {
                return <div className="row" key={idx}>
                    {row}
                </div>
            })}
        </div>
    }
}

export {
    TileGrid,
    Tile
};
