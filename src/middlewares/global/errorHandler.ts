import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(err: any, request: any, res: any, next: (err: any) => any) {
        const statusCode = err.httpCode || 500;
        res.status(statusCode).send({
            error: {
                message: err.message || "Internal server error",
                statusCode,
                errors: err.errors
            }
        });
    }

}
