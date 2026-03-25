import React from 'react';
import './App.scss';
import { Link } from 'react-router-dom';

const App = ({ app }) => {

    if (app.progress !== 'Planned'){
        return (
            <div className="app-box">        
                <Link to={`/apps/${app.link}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <img className="project-image" src={app.image} alt={app.name} />
                    <div className="app-details">
                        <h3>{app.name}</h3>
                        <p className="app-description">{app.description}</p>
                        <p className="app-progress">{app.progress}</p>
                    </div>
                </Link>
            </div>
        );
    } else {
        return (

            <div className="app-box">        
                <img className="project-image" src={app.image} alt={app.name} />
                <div className="app-details">
                    <h3>{app.name}</h3>
                    <p className="app-description">{app.description}</p>
                    <p className="app-progress">{app.progress}</p>
                </div>
            </div>
        );
    }
};

export default App;
