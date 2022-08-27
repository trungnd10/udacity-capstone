import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getSignedUploadUrl, imageExists } from '../../businesslogic/images'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const log = createLogger(`Event: ${event}`);
    console.log(log)

    const imageName = event.pathParameters.imageName
    if (imageName.length <= 4) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'ImageName is not valid'
        })
      }
    }
    const imageId = imageName.slice(0, -4)
    console.log(`imageId: ${imageId}`)

    const userId = getUserId(event)
    const validImage = await imageExists(imageId, userId)
    console.log(validImage)

    if (!validImage) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Image does not exist'
        })
      }
    }

    const url = await getSignedUploadUrl(imageName, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
