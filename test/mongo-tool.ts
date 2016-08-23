/// <reference path="../typings/index.d.ts" />
import * as monk from "monk";
import * as Promise from "es6-promise";
import {User, NewUser, DisplayableUser, Folder, NewFolder} from '../client/components/shared/model/common';
import {EncryptionUtil} from './encryption-util';

const MONGO_DATABASE_URI: string = "localhost:27017/ASCIIDOC_EDITOR_DB";

export class MongoTool {

    static USER_COLLECTION_NAME: string = "user";
    static FOLDER_COLLECTION_NAME: string = "folder";
    static ROOT_PATH: string = "/";

    public static initializeUserCollection(): void {
        monk(MONGO_DATABASE_URI).then(function (m) {
            console.log("Connected to database: %s", m);
            let userCollection: monk.Collection = m.create(MongoTool.USER_COLLECTION_NAME);
            console.log("Collection created %s", userCollection.name);
            userCollection.insert(new NewUser("dummy", "dummy@dummy.com", "dummy", false))
                .then(function (user) {
                    console.log("User created: %s", JSON.stringify(user));
                    userCollection.ensureIndex({ "userName": 1 }, { unique: true }).then(function () {
                        console.log("Index \"userName\" is created.");
                        userCollection.ensureIndex({ "email": 1 }, { unique: true }).then(function () {
                            console.log("Index \"email\" is created.");
                            m.close();
                        });
                    });
                });
        }).catch(function (err) {
            console.log("Unable to connect to database: %s", err);
        });
    }

    public static initializeFolderCollection(): void {
        monk(MONGO_DATABASE_URI).then(function (m) {
            console.log("Connected to database: %s", m);
            let folderCollection: monk.Collection = m.create(MongoTool.FOLDER_COLLECTION_NAME);
            console.log("Collection created %s", folderCollection.name);
            folderCollection.insert({ "name": "/", "parentPath": "", "path": "/" })
                .then(function (folder) {
                    console.log("Folder created: %s", JSON.stringify(folder));
                    folderCollection.ensureIndex({ "name": 1 }).then(function () {
                        console.log("Index \"name\" is created.");
                        folderCollection.ensureIndex({ "parentPath": 1 }).then(function () {
                            console.log("Index \"parentPath\" is created.");
                        }).then(function () {
                            folderCollection.ensureIndex({ "path": 1 }, { unique: true }).then(function () {
                                console.log("Index \"path\" is created.");
                                m.close();
                            });
                        });
                    });
                });
        }).catch(function (err) {
            console.log("Unable to connect to database: %s", err);
        });
    }

    /**
     * Creates new user, if applicacble. If a user with the given 'name' or 'email' is alreday exists this method will rejects the create request.
     * If user is successfully gets created then user root folder will also be gets created.
     * 
     * @param user - user to be created
     * @return - Promise
     */
    public static createUser(user: User): Promise<Object> {
        let manager: monk.Manager = monk(MONGO_DATABASE_URI);
        let userCollection: monk.Collection = manager.get(MongoTool.USER_COLLECTION_NAME);

        // check for if user is already exists
        return MongoTool.findUser(user)
            .then(function (existingUser) {
                // user exists, should reject
                manager.close();
                return Promise.Promise.reject({ "code": "USER_ALREADY_EXISTS", "description": "User already exists" });
            })
            .catch(function (err) {
                if (err.code && err.code === "USER_ALREADY_EXISTS") {
                    // if we are here that means we have found the user but since we are catching we need to re-reject the result
                    return Promise.Promise.reject(err);
                } else {
                    // user not found
                    console.log("No result, continuing creating user: %s", JSON.stringify(err));
                    return MongoTool.createUserInternal(manager, userCollection, user);
                }
            });
    }

    /**
     * Finds user with given criteria.
     * 
     * @param user - user to be created
     * @return - Promise
     */
    public static findUser(user: User): Promise<Object> {
        if (!user) {
            return Promise.Promise.reject({ "code": "USER_NULL", "description": "Supplied user is null" });
        }
        let query = null;
        let id: any = user._id;
        let userName: string = user.userName;
        let email: string = user.email;
        if (id) {
            query = { _id: id };
        } else if (userName && email) {
            query = { $or: [{ "userName": userName }, { "email": email }] };
        } else if (userName) {
            query = { "userName": userName };
        } else if (email) {
            query = { "email": email };
        } else {
            return Promise.Promise.reject({ "code": "UNKNOWN_CRITERIA", "description": "Criteria provided is not valid" });
        }

        let manager: monk.Manager = monk(MONGO_DATABASE_URI);
        let userCollection: monk.Collection = manager.get(MongoTool.USER_COLLECTION_NAME);
        return userCollection.findOne(query)
            .then(function (result) {
                console.log("Query for find: %s", JSON.stringify(query));
                let returnValue: Promise<Object> = null;
                if (result) {
                    console.log("User Found: %s " + JSON.stringify(result));
                    // we got some result
                    returnValue = Promise.Promise.resolve(<User>result);
                } else {
                    console.log("No result found: %s", JSON.stringify(user));
                    // no result found
                    returnValue = Promise.Promise.reject({ "code": "USER_NOT_FOUND", "description": "No user record found based on citeria" });
                }
                manager.close();
                return returnValue;
            });
    }

    /**
     * Creates folder with given name. If "folderName" is not supplied then "userName" will be used as folder name, "if parentPath"
     * is not supplied then "ROOT_PATH" will be used as parent path.
     * 
     * @param user - current user
     * @param folderName (optional) - name of the folder
     * @param parentPath (optional) - path of parent folder
     */
    public static createFolder(user: User, folderName?: string, parentPath?: string): Promise<Object> {
        if (!user || (user && !user.userName)) {
            return Promise.Promise.reject({ "code": "USER_NULL", "description": "Supplied user is null" });
        }
        let path: string = null;
        if (!folderName) {
            folderName = user.userName;
        }
        if (parentPath) {
            // make sure path parent folder belongs to current user
            // if path belongs to surrent user then it must starts with "/<user_name>/"
            let p: string = MongoTool.ROOT_PATH + user.userName + MongoTool.ROOT_PATH;
            if (!parentPath.startsWith(p)) {
                return Promise.Promise.reject({ "code": "INVALID_PARENT_PATH", "description": "Supplied parent path does not belong to current user" });
            }
        } else {
            parentPath = MongoTool.ROOT_PATH;
        }
        path = parentPath + folderName + MongoTool.ROOT_PATH;
        let manager: monk.Manager = monk(MONGO_DATABASE_URI);
        let folderCollection: monk.Collection = manager.get(MongoTool.FOLDER_COLLECTION_NAME);
        return folderCollection.insert(new NewFolder(folderName, path, parentPath))
            .then(function (newFolder) {
                let returnValue: Promise<Object> = Promise.Promise.resolve(newFolder);
                manager.close();
                return returnValue;
            })
            .catch(function (err) {
                let returnValue: Promise<Object> = Promise.Promise.reject(err);
                manager.close();
                return returnValue;
            });
    }

    public static findChildFolders(parentPath: string): Promise<Object[]> {
        let manager: monk.Manager = monk(MONGO_DATABASE_URI);
        let folderCollection: monk.Collection = manager.get(MongoTool.FOLDER_COLLECTION_NAME);
        let query: any = { "parentPath": parentPath };
        return folderCollection.find(query)
            .then(function(results){
                manager.close();
                return results;
            });
    }

    private static createUserInternal(manager: monk.Manager, collection: monk.Collection, user: User): Promise<Object> {
        // encrypt password
        user.password = EncryptionUtil.encryptText(user.password);
        return collection.insert(user)
            .then(function (result) {
                let newUser: User = <User>result;
                console.log("User created: %s", JSON.stringify(newUser));
                return MongoTool.createFolder(newUser)
                    .then(function (folderResult) {
                        let newFolder: Folder = <Folder>folderResult;
                        let returnValue: Promise<Object> = Promise.Promise.resolve(newFolder);
                        manager.close();
                        return returnValue;
                    })
                    .catch(function (err) {
                        let returnValue: Promise<Object> = Promise.Promise.reject(err);
                        manager.close();
                        return returnValue;
                    });
            })
            .catch(function (err) {
                console.log("Error while creating user: %s", JSON.stringify(err));
                let returnValue: Promise<Object> = Promise.Promise.reject(err);
                manager.close();
                return returnValue;
            });
    }

}