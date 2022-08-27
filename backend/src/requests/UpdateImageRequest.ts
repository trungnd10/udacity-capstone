/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateImageRequest {
  userId: string
  imageId: string
  imageName: string
}