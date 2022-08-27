import React, { useState, useEffect } from 'react'
import Canvas from "./canvas-mouse";
import Axios from 'axios'
import { BACKEND_URL, EMITTER_DELETE_IMG, EMITTER_UPDATE_IMG, S3_URL, UDACITY_TOKEN, UDACITY_USER_ID, UDACITY_USER_SUB } from '../const';
import { Buffer } from 'buffer'
import ListImage from './list/list-image';

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const MyCanvas = () => {
    const id = uuidv4()

    const [uploadText, setUploadText] = useState('Save')
    const [image, setImage] = useState({ imageId: id, imageName: id + '.jpg' })

    const w = screen.width - 2 - 170
    const h = screen.height * 0.6

    const reset = () => {
        const id = uuidv4()
        setImage({ imageId: id, imageName: id + '.jpg' })
    }

    const erase = (canvas) => {
        var m = confirm("Want to clear");
        if (m) {
            let cv = canvas
            const ctx = cv.getContext('2d')

            const w = cv.width;
            const h = cv.height;

            ctx.clearRect(0, 0, w, h);
            // document.getElementById("canvasimg").style.display = "none";

            reset()
        }
    }

    const createNew = (canvas) => {

    }

    const save = async (canvas) => {
        setUploadText('Saving...')
        const imageType = 'image/jpeg'
        var dataUrl = canvas.toDataURL(imageType);

        // // erase
        // const ctx = canvas.getContext('2d')
        // const w = canvas.width;
        // const h = canvas.height;
        // ctx.clearRect(0, 0, w, h);

        console.log('dataUrl:', dataUrl)
        var blobBin = atob(dataUrl.split(',')[1]);
        console.log('blobBin:', blobBin)
        var array = [];
        for (var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        console.log('array:', array)
        var file = new Blob([new Uint8Array(array)], { type: imageType });
        console.log('file:', file)

        var formdata = new FormData();
        formdata.append("myNewFileName", file);
        console.log('formdata:', formdata)

        const userId = localStorage.getItem(UDACITY_USER_ID)
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
                responseType: 'arraybuffer'
            })
            .then(response => Buffer.from(response.data, 'binary').toString('base64'))
    }

    const draw = canvas => {
        // Insert your canvas API code to draw an image

        // const context = canvas.getContext('2d')
        // context.fillStyle = "#FFFFFF";
        // context.fillRect(0, 0, w, h);

        // const userId = localStorage.getItem(UDACITY_USER_ID)
        // const imageName = `${userId}.jpg`
        // const url = `${S3_URL + imageName}`

        // console.log('here, draw:', image)
        // const image = new Image()
        // image.src = url
        // context.drawImage(image, 0, 0, w, h);

        if (image) {
            const img = new Image()
            const url = `${S3_URL + image.imageName}`
            img.src = url
            const context = canvas.getContext('2d')
            context.drawImage(img, 0, 0)
        }

        // const image = new Image();
        // image.src = url;
        // getBase64(url).then(data => {
        //     console.log('data:', data)
        //     const image = new Image()
        //     image.src = 'data:image/jpeg;base64,' + data
        //     image.onload = () => {
        //         // erase
        //         // const w = canvas.width;
        //         // const h = canvas.height;
        //         // context.clearRect(0, 0, w, h);

        //         context.drawImage(image, 0, 0, w, h);
        //     };
        // })

        // const img = this.refs.image
        // img.onload = () => {
        //     ctx.drawImage(img, 0, 0)
        //     ctx.font = "40px Courier"
        //     ctx.fillText(this.props.text, 210, 75)
        // }

        // const dataURL = canvas.toDataURL()
    };

    const updateImage = (event) => {
        console.log('event update image:', event)
        setImage(event)
    }

    const deleteImage = (event) => {
        console.log('event:', event)
        const token = localStorage.getItem(UDACITY_TOKEN)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        const url = `${BACKEND_URL + '/images/' + image.imageId}`
        Axios.delete(url, {
            headers: headers
        }).then(result => {
            console.log('result delete:', result)
            reset()
        }).catch(e => { console.log('e:', e) })
    }

    useEffect(() => {
        const userId = localStorage.getItem(UDACITY_USER_ID)
        const imageName = `${userId}.jpg`
        const url = `${S3_URL + imageName}`
        const token = localStorage.getItem(UDACITY_TOKEN)
        Axios.get(url).then(result => {
            console.log('result:', result)
        }).catch(e => { console.log('e:', e) })

        // // event listener
        // console.log(`the component is now mounted.`)
        // this.$root.$on(EMITTER_UPDATE_IMG, (image) => {
        //     console.log('update image:', image)
        // })
        // this.$root.$on(EMITTER_DELETE_IMG, (image) => {
        //     console.log('delete image:', image)
        // })
    })

    return (
        <div>
            <h3>Please draw something and then click upload: </h3>
            <Canvas draw={draw} width={w} height={h} erase={erase} save={save} uploadText={uploadText} createNew={createNew} />
            <h3>Here are your saved pictures:</h3>
            Image ID: {image.imageId}<br />
            Image Name: {image.imageName}
            <ListImage updateImage={updateImage} deleteImage={deleteImage} />
        </div>
    );
};

export default MyCanvas;