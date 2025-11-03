import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        tenantId: string;
        email: string;
        roles: string[];
    };
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<any>;
export declare const authorize: (...allowedRoles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => any;
//# sourceMappingURL=auth.d.ts.map