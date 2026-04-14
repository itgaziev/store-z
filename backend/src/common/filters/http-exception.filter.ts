import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: any, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = null;

        if (typeof exception === 'object' && exception !== null) {
            if ('status' in exception) {
                status = (exception as any).status;
            }

            if ('message' in exception) {
                message = (exception as any).message;
            }

            if ('response' in exception) {
                const resp = (exception as any).response;
                if (typeof resp === 'object' && resp !== null) {
                    errors = resp;
                }
            }
        }
        
        const responseBody: Record<string, any> = {
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        if (errors) {
            responseBody.errors = errors;
        }

        httpAdapter.reply(response, responseBody, status);
    }
}