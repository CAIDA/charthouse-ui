import React from 'react';
import 'Hi3/css/pages/feeds/hijacks.css';
import EventTagsTable from "../../../../Hijacks/components/event-tags-table";

const HORIZONTAL_OFFSET = 480;

class EventTags extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            frameWidth: window.innerWidth - HORIZONTAL_OFFSET
        };

    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    render() {

        return <div id='hijacks' className='container-fluid'>
            <EventTagsTable/>
        </div>;
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };
}

export default EventTags;
