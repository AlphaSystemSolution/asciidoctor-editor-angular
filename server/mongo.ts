/// <reference path="../typings/index.d.ts" />
import monk = require('monk');
import {Manager, Collection} from 'monk';
import crypto = require('crypto');
import {Request, Response, NextFunction} from 'express';
import {ParsedAsJson} from 'body-parser';

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

        public authenticate(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
            let body: any = req.body;
            let userName: string = body.userName;
            let password: string = body.password;

            if (!userName || !password) {
                // TODO:
            }

            let manager: Manager = monk(MONGO_DATABASE_URI);
            let collection: Collection = manager.get(USER_COLLECTION_NAME);

            password = encryptText(password);
            let query: any = { "userName": userName, "password": password };
            collection.findOne(query)
                .then(result => extractUser(manager, res, result))
                .catch(function (err) {
                    res.sendStatus(500).send(err);
                });
        }

        public findChildFolders(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
            let parentPath: string = req.body.parentPath;

            if (!parentPath) {
                // TODO:
            }

            let manager: Manager = monk(MONGO_DATABASE_URI);
            let collection: Collection = manager.get(FOLDER_COLLECTION_NAME);

            let query: any = { "parentPath": parentPath };
            collection.find(query)
                .then(results => extractFolders(manager, res, results));
        }

        public createFolder(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
            let body: any = req.body;
            let userName: string = body.userName;
            let folderName: string = body.folderName;
            let parentPath: string = body.parentPath;

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
            let manager: Manager = monk(MONGO_DATABASE_URI);
            let collection: Collection = manager.get(FOLDER_COLLECTION_NAME);
            collection.insert(new NewFolder(folderName, path, parentPath))
                .then(result => res.json(result))
                .catch(err => res.sendStatus(400).json({ "code": "FOLDER_ALREADY_EXISTS", "description": "Folder with the given name is already exists." }));
        }

        public removeFolder(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
            let body: any = req.body;
            let userName: string = body.userName
            let path: string = body.path;
            if (!userName || !path) {
                // TODO:
            }
            if (!checkPath(userName, path)) {
                res.sendStatus(401).json({ "code": "INVALID_PATH", "description": "Supplied parent path does not belong to current user" });
                return;
            }
            let manager: Manager = monk(MONGO_DATABASE_URI);
            let collection: Collection = manager.get(FOLDER_COLLECTION_NAME);
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

function extractFolders(manager: Manager, res: Response, results: Object[]) {
    let entries: IterableIterator<Object> = results.entries();
    let folders: Folder[] = [];
    results.forEach(function (entry) {
        folders.push(<Folder>entry);
    });
    manager.close();
    res.json(folders);
}

function extractUser(manager: Manager, res: Response, result: Object) {
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