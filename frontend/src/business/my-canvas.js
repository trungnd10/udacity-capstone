import React, { useState, useEffect } from 'react'
import Canvas from "./canvas-mouse";
import Axios from 'axios'
import { BACKEND_URL, S3_URL, UDACITY_TOKEN, UDACITY_USER_ID, UDACITY_USER_SUB } from '../const';
import ListImage from './list/list-image';
import { Buffer } from 'buffer'

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const MyCanvas = () => {
    const id = uuidv4()

    const [uploadText, setUploadText] = useState('Save')
    const [image, setImage] = useState({ blank: true, imageId: id, imageName: id + '.jpg' })

    const w = screen.width - 2 - 170
    const h = screen.height * 0.6

    const reset = () => {
        const id = uuidv4()
        setImage({ blank: true, imageId: id, imageName: id + '.jpg' })
    }

    const erase = (canvas) => {
        var m = confirm("Want to clear and create new");
        if (m) {
            // let cv = canvas
            // const ctx = cv.getContext('2d')

            // const w = cv.width;
            // const h = cv.height;

            // ctx.clearRect(0, 0, w, h);
            // // document.getElementById("canvasimg").style.display = "none";

            reset()
        }
    }

    const save = async (canvas) => {
        setUploadText('Saving...')
        const imageType = 'image/jpeg'
        var dataUrl = canvas.toDataURL(imageType);

        var blobBin = atob(dataUrl.split(',')[1]);
        var array = [];
        for (var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        var file = new Blob([new Uint8Array(array)], { type: imageType });

        var formdata = new FormData();
        formdata.append("myNewFileName", file);
        console.log('formdata:', formdata)

        const userSub = localStorage.getItem(UDACITY_USER_SUB)
        console.log('sub:', userSub)

        const token = localStorage.getItem(UDACITY_TOKEN)
        console.log('token:', token)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

        // create image first
        const createImageUrl = `${BACKEND_URL}/images`
        const addImageResult = await Axios.post(createImageUrl, {
            "userId": `${userSub}`,
            "imageId": `${image.imageId}`,
            "imageName": `${image.imageName}`
        }, {
            headers: headers
        })
        console.log('addImageResult:', addImageResult)

        const url = `${BACKEND_URL}/upload/image/${image.imageName}`
        const result = await Axios.post(url, {}, {
            headers: headers
        })
        console.log('result:', result)
        const uploadUrl = result.data.uploadUrl
        console.log('uploadUrl:', result.data.uploadUrl)

        const r = await Axios.put(uploadUrl, file)
        console.log('r:', r)
        // alert('Save success! ' + image.imageName)
        setUploadText('Upload')
        if (window.confirm('Uploaded to S3 success!. Click ok to download: ' + image.imageName)) {
            window.open(S3_URL + image.imageName, '_blank');
        }
    }

    function getBase64(url) {
        return Axios
            .get(url, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'responseType': 'arraybuffer'
            })
            .then(response => Buffer.from(response.data, 'binary').toString('base64'))
    }

    const draw = canvas => {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        // console.log('random:', randomColor)
        if (image.blank) {
            console.log('blank')
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ctx.fillStyle = randomColor;
            // ctx.fillRect(20, 200, 150, 100);
        } else {
            console.log('not blank')
            const url = `${S3_URL + image.imageName}`
            // // OPTION 1
            // const img = new Image()
            // img.crossorigin = "anonymous"
            // console.log(url)
            // img.src = url
            // ctx.drawImage(img, 0, 0)

            // ctx.fillStyle = randomColor;
            // ctx.fillRect(20, 200, 150, 100);

            // img.addEventListener("load", (image) => { console.log('loaded', image) }, false);
            // img.onload = () => {
            //     console.log('loaded', image)
            // };

            // // OPTION 2
            getBase64(url).then(data => {
                const img = new Image()
                img.crossorigin = "anonymous"
                img.src = 'data:image/jpeg;base64,' + data
                img.onload = () => {
                    // erase
                    // const w = canvas.width;
                    // const h = canvas.height;
                    // context.clearRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                };
            })
        }
    }

    const updateImage = (event) => {
        console.log('event update image:', event)
        event.blank = false
        setImage(event)
    }

    const deleteImage = (event) => {
        console.log('event:', event)
        const token = localStorage.getItem(UDACITY_TOKEN)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        const url = `${BACKEND_URL + '/images/' + event.imageId}`
        Axios.delete(url, {
            headers: headers
        }).then(result => {
            console.log('result delete:', result)
            reset()
        }).catch(e => { console.log('e:', e) })
    }

    useEffect(() => {
        // const userId = localStorage.getItem(UDACITY_USER_ID)
        // const imageName = `${userId}.jpg`
        // const url = `${S3_URL + imageName}`
        // const token = localStorage.getItem(UDACITY_TOKEN)
        // Axios.get(url).then(result => {
        //     console.log('result:', result)
        // }).catch(e => { console.log('e:', e) })
    })

    return (
        <div>
            <h3>Please draw something and then click save to upload: </h3>
            <Canvas draw={draw} width={w} height={h} erase={erase} save={save} uploadText={uploadText} />
            Image ID: {image.imageId}<br />
            Image Name: {image.imageName}
            <h3>Here are your saved pictures:</h3>
            <ListImage updateImage={updateImage} deleteImage={deleteImage} />
        </div>
    );
};

export default MyCanvas;