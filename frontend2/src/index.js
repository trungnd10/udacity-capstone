import React from 'react' // nạp thư viện react
import ReactDOM from 'react-dom' // nạp thư viện react-dom
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Example } from './app';

// Tạo component App
function App() {
    return (
        <div>
            <h1>Hello</h1>
            <Button variant="primary">Primary</Button>{' '}
            <Example></Example>
        </div>
    )
}

// Render component App vào #root element
ReactDOM.render(<App />, document.getElementById('root'))