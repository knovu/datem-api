import { Injectable, NestMiddleware } from '@nestjs/common';
import { IPInfo } from '@src/@types';
import { Request, Response, NextFunction } from 'express';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class DeviceInfoMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Get the User-Agent header
        const userAgent = req.headers['user-agent'] || '';
        const ua = UAParser(userAgent);
        const clientIp = req.ip || ''; // Primary IP
        const allIps = req.ips; // Array of forwarded IPs (if behind a proxy)

        const ipInfo: IPInfo = {
            primary: clientIp,
            all: allIps,
            ipv4: allIps.find((ip) => this.isIPv4(ip)) || clientIp,
            ipv6: allIps.find((ip) => this.isIPv6(ip)) || null,
        };

        // Attach the parsed device information to the request object
        req.deviceInfo = { ...ua, ip: ipInfo };

        // Proceed to the next middleware or route handler
        next();
    }

    private isIPv4(ip: string): boolean {
        return ip.includes('.');
    }

    private isIPv6(ip: string): boolean {
        return ip.includes(':');
    }
}
