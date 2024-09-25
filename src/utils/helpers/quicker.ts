import os from 'os';
import { ServerConfig } from '../../config';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getTimezonesForCountry } from 'countries-and-timezones';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { randomInt } from 'crypto';
import jwt from 'jsonwebtoken';

export class Quicker {
    public static getSystemHealth() {
        return {
            cpuUsage: os.loadavg(),
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
        };
    }

    public static getApplicationHealth() {
        return {
            environment: ServerConfig.ENV,
            uptime: `${process.uptime().toFixed(2)} seconds`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            },
        };
    }

    public static parsePhoneNumber(phoneNumber: string) {
        const parsedContactNumber = parsePhoneNumber(phoneNumber);

        if (parsedContactNumber) {
            return {
                countryCode: parsedContactNumber.countryCallingCode,
                isoCode: parsedContactNumber.country || null,
                internationalNumber: parsedContactNumber.formatInternational(),
            };
        }

        return {
            countryCode: null,
            isoCode: null,
            internationalNumber: null,
        };
    }

    public static getCountryTimeZone(isoCode: string) {
        return getTimezonesForCountry(isoCode);
    }

    public static async hashPassword(password: string) {
        return await bcrypt.hash(password, ServerConfig.SALT_ROUNDS);
    }

    public static async comparePassword(attemptedPassword: string, hashedPassword: string) {
        return await bcrypt.compare(attemptedPassword, hashedPassword);
    }

    public static generateRandomId() {
        return uuid();
    }

    public static generateOtp(length: number) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, 6) - 1;

        return randomInt(min, max).toString();
    }

    public static generateToken(payload: object, secret: string, expiry: number) {
        return jwt.sign(payload, secret, {
            expiresIn: expiry,
        });
    }

    public static verifyToken(token: string, secret: string) {
        return jwt.verify(token, secret);
    }
}
