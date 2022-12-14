import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateImageRequest } from '../../requests/CreateImageRequest'
import { getUserId } from '../utils';
import { createImage } from '../../businesslogic/images'
import { createLogger } from '../../utils/logger'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    createLogger(`Event: ${event}`);

    const newImage: CreateImageRequest = JSON.parse(event.body)
    const userId = getUserId(event);
    const item = await createImage(userId, newImage)
    const result = {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    };

    return result;
  }
)

handler.use(
  cors({
    credentials: true
  })
)
