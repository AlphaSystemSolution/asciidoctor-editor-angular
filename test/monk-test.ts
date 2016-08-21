/// <reference path="../typings/index.d.ts" />
import * as monk from "monk";
import * as Promise from "es6-promise";
import {MongoTool} from '../server/mongo-tool';
import {User, NewUser, Folder, NewFolder} from '../client/components/shared/model/common';

// MongoTool.initializeUserCollection();
// MongoTool.initializeFolderCollection();

MongoTool.createUser(new NewUser("dummy", "dummy1@dummy.com", "dummy", false))
    .then(function (result) {
        console.log("This should not happen");
    })
    .catch(function (err) {
        console.log("Error occured while creating user: %s", JSON.stringify(err));
    });

MongoTool.createUser(new NewUser("dummy1", "dummy@dummy.com", "dummy", false))
    .then(function (result) {
        console.log("This should not happen");
    })
    .catch(function (err) {
        console.log("Error occured while creating user: %s", JSON.stringify(err));
    });

MongoTool.createUser(new NewUser("sali", "f.syed.ali@gmail.com", "changeit", true))
    .then(function (result) {
        console.log("This should not happen");
    })
    .catch(function (err) {
        console.log("Error occured while creating user: %s", JSON.stringify(err));
    });


createFolders();

MongoTool.findChildFolders("/sali/")
    .then(function (results) {
        let entries: IterableIterator<Object> = results.entries();
        
        let folders:Folder[] = [];
        results.forEach(function (entry) {
            folders.push(<Folder>entry);
        });
        console.log("Folders: %s", JSON.stringify(folders));
    });

function createFolders() {
    MongoTool.findUser(new NewUser("sali"))
        .then(function (result) {
            let user: User = <User>result;
            let parentPath: string = MongoTool.ROOT_PATH + user.userName + MongoTool.ROOT_PATH;
            MongoTool.createFolder(user, "test1", parentPath)
                .then(function (folderResult) {
                    let folder: Folder = <Folder>folderResult;
                    console.log("Folder created: %s", folder.path);
                })
                .catch(function (err) {
                    console.log("Error creating folder 'test1': %s", JSON.stringify(err));
                });
            MongoTool.createFolder(user, "test2", parentPath)
                .then(function (folderResult) {
                    let folder: Folder = <Folder>folderResult;
                    console.log("Folder created: %s", folder.path);
                })
                .catch(function (err) {
                    console.log("Error creating folder 'test2': %s", JSON.stringify(err));
                });
            MongoTool.createFolder(user, "test3", parentPath)
                .then(function (folderResult) {
                    let folder: Folder = <Folder>folderResult;
                    console.log("Folder created: %s", folder.path);
                })
                .catch(function (err) {
                    console.log("Error creating folder 'test3': %s", JSON.stringify(err));
                });
        });
}