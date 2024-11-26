import 'dotenv/config';
import * as path from 'path';
import md5 from "md5";
import { ConnectionConfig, ConnectionOptions } from "mysql2";

export const port: number = parseInt(process.env.PORT ?? "6969");
export const env: string = process.env.env || process.argv[2] || "pro"
 
// export const serverLogFilePath = path.join(__dirname, "log", process.env.LOG_FILE || "server.log");
// export const infoLogFilePath = path.join(__dirname, "log", process.env.LOG_FILE || "info.log");
// export const logInConsole = process.env.CONSOLE_LOG || true
// export const logInFile = process.env.FILE_LOG || true

export const secret = "are@lk%4$*/{[rel)_tr=_+jtg!~kyr;.x#"

export const dbConfig: ConnectionConfig = {
    user: 'alumnidbuser',
    host: 'localhost',
    password: 'Gcet@123',
    database: 'alumni',
    multipleStatements: true,
    mergeFlags: function (defaultFlags: string[], userFlags: string[] | string): number {
        throw new Error('Function not implemented.');
    },
    getDefaultFlags: function (options?: ConnectionOptions): string[] {
        throw new Error('Function not implemented.');
    },
    getCharsetNumber: function (charset: string): number {
        throw new Error('Function not implemented.');
    },
    getSSLProfile: function (name: string): { ca: string[]; } {
        throw new Error('Function not implemented.');
    },
    parseUrl: function (url: string): { host: string; port: number; database: string; user: string; password: string;[key: string]: any; } {
        throw new Error('Function not implemented.');
    }
}