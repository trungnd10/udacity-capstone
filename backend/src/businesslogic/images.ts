import { ImagesAccess } from '../datalayer/imagesAcess'
import { ImageItem } from '../models/ImageItem'
import { CreateImageRequest } from '../requests/CreateImageRequest'
import { UpdateImageRequest } from '../requests/UpdateImageRequest'
// import * as uuid from 'uuid'
import { getSignedUrl } from '../utils/s3'

// Implement businessLogic

const bucketName = process.env.ATTACHMENT_S3_BUCKET

const image = new ImagesAccess()

export async function getAllImages(userId: string): Promise<ImageItem[]> {
  return await image.getAllImages(userId)
}

// function dateToYMD(date: Date) {
//   var d = date.getDate();
//   var m = date.getMonth() + 1; //Month from 0 to 11
//   var y = date.getFullYear();
//   return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
// }

export async function createImage(
  userId: string,
  payload: CreateImageRequest
): Promise<ImageItem> {
  // const imageId = uuid.v4()

  var date = new Date();
  var createdAt =
    date.getFullYear() + "/" +
    ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
    ("00" + date.getDate()).slice(-2) + " " +
    ("00" + date.getHours()).slice(-2) + ":" +
    ("00" + date.getMinutes()).slice(-2) + ":" +
    ("00" + date.getSeconds()).slice(-2);
  console.log(createdAt);

  // const createdAt = dateToYMD(new Date())
  const data = {
    createdAt,
    userId,
    ...payload
  }

  return await image.createImage(data as ImageItem)
}


export async function updateImage(imageId: string, userId: string, payload: UpdateImageRequest): Promise<void> {
  return await image.updateImage(imageId, userId, payload)
}

export async function deleteImage(imageId: string, userId: string): Promise<void> {
  await image.deleteImage(imageId, userId)
}

export async function imageExists(imageId: string, userId: string) {
  const item = await image.getImage(imageId, userId)
  console.log('Image item: ', item)
  return !!item
}

export async function getSignedUploadUrl(imageId: string, userId: string) {
  console.log('userId:', userId)
  const signedUrl = getSignedUrl(imageId)
  if (signedUrl) {
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
    console.log('attachmentUrl:', attachmentUrl)
    // await todo.updateTodoAttachment(todoId, userId, attachmentUrl)
    return signedUrl
  }
}