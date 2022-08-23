import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Canvas = ({ draw, height, width, save, erase, upload, uploadText }) => {
    const canvas = React.useRef();

    // const [flag, setFlag] = useState(false);
    // const [prevX, setPrevX] = useState(0);
    // const [currX, setCurrX] = useState(0);
    // const [prevY, setPrevY] = useState(0);
    // const [currY, setCurrY] = useState(0);
    const [x, setX] = useState('black')
    const [y, setY] = useState(2)

    let flag = false, dot_flag = false
    let prevX = 0, prevY = 0
    let currX = 0, currY = 0

    const handleKeyDown = (event) => {
        console.log('A key was pressed', event.keyCode);
    };
    const drawHere = () => {
        const ctx = canvas.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    }

    // function dataURItoBlob(dataURI) {
    //     var binary = atob(dataURI.split(',')[1]);
    //     var array = [];
    //     for (var i = 0; i < binary.length; i++) {
    //         array.push(binary.charCodeAt(i));
    //     }
    //     return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    // }

    // function dataURItoBlob(dataURI) {
    //     // convert base64/URLEncoded data component to raw binary data held in a string
    //     var byteString;
    //     if (dataURI.split(',')[0].indexOf('base64') >= 0)
    //         byteString = atob(dataURI.split(',')[1]);
    //     else
    //         byteString = unescape(dataURI.split(',')[1]);

    //     // separate out the mime component
    //     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    //     // write the bytes of the string to a typed array
    //     var ia = new Uint8Array(byteString.length);
    //     for (var i = 0; i < byteString.length; i++) {
    //         ia[i] = byteString.charCodeAt(i);
    //     }

    //     return new Blob([ia], { type: mimeString });
    // }



    const findxy = (res, e) => {
        const cv = canvas.current
        const ctx = cv.getContext('2d')
        const rect = cv.getBoundingClientRect()
        const offsetX = rect.left
        const offsetY = rect.top

        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - cv.offsetLeft;
            currY = e.clientY - offsetY;//cv.offsetTop;

            flag = true;
            dot_flag = true;
            if (dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = x;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - cv.offsetLeft;
                currY = e.clientY - offsetY;//cv.offsetTop;
                drawHere();
            }
        }
    }

    React.useEffect(() => {
        // const context = canvas.current.getContext('2d');
        draw(canvas.current);

        window.addEventListener('keydown', handleKeyDown);

        let cv = canvas.current;
        const mouseMove = (e) => {
            findxy('move', e)
        }
        cv.addEventListener("mousemove", mouseMove, false);
        const mouseDown = (e) => {
            findxy('down', e)
        }
        cv.addEventListener("mousedown", mouseDown, false);
        const mouseUp = (e) => {
            findxy('up', e)
        }
        cv.addEventListener("mouseup", mouseUp, false);
        // const mouseOut = (e) => {
        //     findxy('out', e)
        // }
        // cv.addEventListener("mouseout", mouseOut, false);

        // cleanup this component
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            cv.removeEventListener('mousemove', mouseMove);
            cv.removeEventListener('mousedown', mouseDown);
            cv.removeEventListener('mouseup', mouseUp);
            // cv.removeEventListener('mouseout', mouseOut);
        };
    });
    return (
        <div>
            <canvas ref={canvas} height={height} width={width} style={{ border: '1px solid black' }} />
            {/* <img ref="image" src={cheese} className="hidden" /> */}
            {/* <Button variant="primary" onClick={() => save(canvas.current)}>Save</Button> */}
            &nbsp;
            <Button variant="primary" onClick={() => erase(canvas.current)}>Clear</Button>
            &nbsp;
            <Button variant="primary" onClick={() => upload(canvas.current)}>{uploadText}</Button>
        </div>
    );
};
Canvas.propTypes = {
    draw: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    save: PropTypes.func.isRequired,
    erase: PropTypes.func.isRequired,
    upload: PropTypes.func.isRequired,
};

export default Canvas;