// import * as React from 'react'
// import Button from 'react-bootstrap/Button'
// import Form from 'react-bootstrap/Form'
// // import Auth from '../auth/Auth'
// import { getUploadUrl, uploadFile } from '../api/todos-api'

// const Upload = () => {
//     // const [file] = useState()
//     const [uploadState, setUploadState] = useState()

//     handleFileChange = (event) => {
//         const files = event.target.files
//         if (!files) return

//         this.setState({
//             file: files[0]
//         })
//     }

//     handleSubmit = async (event) => {
//         event.preventDefault()

//         try {
//             if (!this.state.file) {
//                 alert('File should be selected')
//                 return
//             }

//             setUploadState()
//             this.setUploadState(UploadState.FetchingPresignedUrl)
//             const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId)

//             this.setUploadState(UploadState.UploadingFile)
//             await uploadFile(uploadUrl, this.state.file)

//             alert('File was uploaded!')
//         } catch (e) {
//             alert('Could not upload a file: ' + e.message)
//         } finally {
//             this.setUploadState(UploadState.NoUpload)
//         }
//     }

//     return (
//         <div>
//             <h1>Upload new image</h1>

//             <Form onSubmit={this.handleSubmit}>
//                 <Form.Field>
//                     <label>File</label>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         placeholder="Image to upload"
//                         onChange={this.handleFileChange}
//                     />
//                 </Form.Field>

//                 <div>
//                     {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
//                     {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
//                     <Button
//                         loading={this.state.uploadState !== UploadState.NoUpload}
//                         type="submit"
//                     >
//                         Upload
//                     </Button>
//                 </div>
//             </Form>
//         </div>
//     )
// }

// export default Upload
