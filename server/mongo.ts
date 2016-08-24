/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as monk from "monk";
import * as crypto from 'crypto';

import {User, NewUser, DisplayableUser, Folder, NewFolder} from '../client/components/shared/model/common';

const ALGORITHM: string = "AES256";
const KEY: string = "PRIVATE_ASCIIDOC_EDITOR_KEY";
const INPUT_ENCODING: any = "utf8";
const OUTPUT_ENCODING: any = "base64";

const MONGO_DATABASE_URI: string = "localhost:27017/ASCIIDOC_EDITOR_DB";
const USER_COLLECTION_NAME: string = "user";
const FOLDER_COLLECTION_NAME: string = "folder";

module DataRoute {

    export class Route {

        public authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
            let userName: string = req.body.userName;
            let password: string = req.body.password;

            if (!userName || !password) {
                // TODO:
            }

            let manager: monk.Manager = monk(MONGO_DATABASE_URI);
            let collection: monk.Collection = manager.get(USER_COLLECTION_NAME);

            password = encryptText(password);
            let query: any = { "userName": userName, "password": password };
            collection.findOne(query)
                .then(result => extractUser(manager, res, result))
                .catch(function (err) {
                    res.sendStatus(500).send(err);
                });
        }

        public findChildFolders(req: express.Request, res: express.Response, next: express.NextFunction) {
            let parentPath: string = req.body.parentPath;

            if (!parentPath) {
                // TODO:
            }

            let manager: monk.Manager = monk(MONGO_DATABASE_URI);
            let collection: monk.Collection = manager.get(FOLDER_COLLECTION_NAME);

            let query: any = { "parentPath": parentPath };
            collection.find(query)
                .then(results => extractFolders(manager, res, results));
        }

        public createFolder(req: express.Request, res: express.Response, next: express.NextFunction) {
            let userName: string = req.body.userName;
            let folderName: string = req.body.folderName;
            let parentPath: string = req.body.parentPath;

            if (!userName) {
                // TODO:
            }

            if (parentPath) {
                if (!checkPath(userName, parentPath)) {
                    res.sendStatus(401).json({ "code": "INVALID_PATH", "description": "Supplied parent path does not belong to current user" });
                    return;
                }
                if (!folderName) {
                    // if parentPath provided then folderName is required
                }
            } else {
                parentPath = "/";
                folderName = userName;
            }
            let path: string = parentPath + folderName + "/";
            let manager: monk.Manager = monk(MONGO_DATABASE_URI);
            let collection: monk.Collection = manager.get(FOLDER_COLLECTION_NAME);
            collection.insert(new NewFolder(folderName, path, parentPath))
                .then(result => res.json(result))
                .catch(err => res.sendStatus(400).json({ "code": "FOLDER_ALREADY_EXISTS", "description": "Folder with the given name is already exists." }));
        }

        public removeFolder(req: express.Request, res: express.Response, next: express.NextFunction) {
            let userName: string = req.body.userName
            let path: string = req.body.path;
            if (!userName || !path) {
                // TODO:
            }
            if (!checkPath(userName, path)) {
                res.sendStatus(401).json({ "code": "INVALID_PATH", "description": "Supplied parent path does not belong to current user" });
                return;
            }
            let manager: monk.Manager = monk(MONGO_DATABASE_URI);
            let collection: monk.Collection = manager.get(FOLDER_COLLECTION_NAME);
            let regex: string = "^" + path;
            let query: any = { $or: [{ "path": path }, { "parentPath": { $regex: regex } }] };
            collection.remove(query)
                .then(result => res.json(result));
        }

    }
};

function checkPath(userName: string, path: string): boolean {
    if (path) {
        // make sure path parent folder belongs to current user
        // if path belongs to surrent user then it must starts with "/<user_name>/"
        let p: string = "/" + userName + "/";
        if (path.startsWith(p)) {
            return true;
        }
    }
    return false;
}

function encryptText(clearText: string): string {
    let encryptedText: string = null;

    let cipher: crypto.Cipher = crypto.createCipher(ALGORITHM, KEY);
    encryptedText = cipher.update(clearText, INPUT_ENCODING, OUTPUT_ENCODING);
    encryptedText += cipher.final(OUTPUT_ENCODING);

    return encryptedText;
}

function decyptText(encryptedText: string): string {
    let clearText: string = null;

    let decipher: crypto.Decipher = crypto.createDecipher(ALGORITHM, KEY);

    clearText = decipher.update(encryptedText, OUTPUT_ENCODING, INPUT_ENCODING);
    clearText += decipher.final(INPUT_ENCODING);

    return clearText;
}

function extractFolders(manager: monk.Manager, res: express.Response, results) {
    let entries: IterableIterator<Object> = results.entries();
    let folders: Folder[] = [];
    results.forEach(function (entry) {
        folders.push(<Folder>entry);
    });
    manager.close();
    res.json(folders);
}

function extractUser(manager: monk.Manager, res: express.Response, result) {
    let body = {};
    if (result) {
        let user: User = <User>result;
        user.password = null;
        body = user;
    } else {
        body = { "code": "USER_NOT_FOU;ND", "description": "No user record found based on citeria" }
        res.sendStatus(404);
    }
    manager.close();
    res.json(body);
}

export = DataRoute;