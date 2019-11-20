import React, {Fragment} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import data from "./data";

export const App: React.FC = props => {
    return (
        <div className="container">
            <Fragment>
                <Typeahead
                    labelKey="name"
                    options={data}
                    multiple={true}
                    placeholder="Choose a state..."
                />
            </Fragment>
        </div>
    )
};
export default App;