import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { BACKEND_URL, EMITTER_DELETE_IMG, EMITTER_UPDATE_IMG, IMG_LIST_H, S3_URL, UDACITY_TOKEN, UDACITY_USER_ID, UDACITY_USER_SUB } from '../../const';
import { Buffer } from 'buffer'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const ListImage = ({updateImage, deleteImage}) => {
    const [imageList, setImageList] = useState([])

    const loadImageList = async (canvas) => {
        const token = localStorage.getItem(UDACITY_TOKEN)
        console.log('token:', token)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        const imageUrl = `${BACKEND_URL}/images`
        Axios.get(imageUrl, {
            headers: headers
        }).then((result) => {
            console.log('imageListResult:', result)
            const newData = result.data.items
            // TODO not stringify here
            // TODO not stringify here
            // TODO not stringify here
            if (JSON.stringify(newData) != JSON.stringify(imageList)) {
                setImageList(newData)
            }
            // TODO not stringify here
            // TODO not stringify here
            // TODO not stringify here
        })
    }

    // const editImage = (image) => {
    //     // this.$root.$emit(EMITTER_UPDATE_IMG, image)
    //     // defineEmits(EMITTER_UPDATE_IMG, image)
    //     // console.log('update emiter:', image)
    //     editImage(image)
    // }

    useEffect(() => {
        loadImageList()
    })

    return (
        <div>
            <h3>Image List:</h3>
            {imageList.map(image => {
                return (
                    <div key={image.imageId}>
                        <img height={IMG_LIST_H} src={S3_URL + image.imageName} />
                        <div>
                            {image.createdAt}
                            {/* {image.userId} */}
                            {/* <hr /> */}
                            &nbsp;
                            <Button size="sm" variant="primary" onClick={() => updateImage(image)}>Edit</Button>
                            &nbsp;
                            <Button size="sm" variant="primary" onClick={() => deleteImage(image)}>Delete</Button>
                        </div>
                    </div>
                );
            })}
            {/* <br />
            {JSON.stringify(imageList)} */}
        </div>
    );
};

ListImage.propTypes = {
    updateImage: PropTypes.func.isRequired,
    deleteImage: PropTypes.func.isRequired,
};

export default ListImage;