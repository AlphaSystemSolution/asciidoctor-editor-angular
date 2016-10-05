/**
 * Created by sali on 8/21/2016.
 */
import { Component, OnInit, ViewChild, AfterViewInit, Renderer, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { Dialog, MenuItem, OverlayPanel, TreeNode } from 'primeng/primeng';
import 'rxjs/add/operator/map';
import { DataService } from '../data.service';
import { Folder, NewFolder } from '../model/common';

@Component({
    selector: 'folder-chooser',
    templateUrl: './client/components/shared/components/folderchooser.html'
})
export class FolderChooserComponent implements OnInit, AfterViewInit {

    folders: TreeNode[];
    selectedFolder: TreeNode;
    items: MenuItem[];
    private rootFolder: Folder;
    private rootNode: TreeNode;

    newFolderName: string;

    @ViewChild("treeOp")
    treeOverlayPanel: OverlayPanel;

    @ViewChild("createFolderDialog")
    createFolderDialog: Dialog;

    @ViewChild("removeFolderDialog")
    removeFolderDialog: Dialog

    @Input()
    currentFolder: string;

    @Output()
    onSelect: EventEmitter<Folder> = new EventEmitter<Folder>();

    constructor(private dataService: DataService, private renderer: Renderer) {
    }

    ngOnInit() {
        this.folders = [];
        let userName: string = sessionStorage.getItem("userName");
        if (userName) {
            let parentPath: string = "/" + userName + "/";
            this.rootFolder = new NewFolder(userName, parentPath, "/");
            this.rootNode = { "label": userName, "data": this.rootFolder, children: [], "leaf": false };
            this.selectedFolder = this.rootNode;
            this.folders.push(this.rootNode);
            this.loadChildren(this.rootNode, true);
        }
        this.items = [
            { label: 'Create Folder', icon: 'fa-plus', command: (event) => this.createFolderDialog.visible = true },
            { label: 'Remove Folder', icon: 'fa-minus', command: (event) => this.removeFolderDialog.visible = true }
        ];
    }

    ngAfterViewInit() {
        // expend the tree dirty way
        setTimeout(() => { // a timeout is necessary otherwise won't find the elements

            // get the first "p-tree" tag and find his first "toggler"
            let elements: NodeListOf<Element> = document.getElementsByTagName("p-tree");
            let element: Element;
            if (elements && elements.length > 0) {
                element = elements[0];
                if (element) {
                    elements = element.getElementsByClassName("ui-tree-toggler fa fa-fw fa-caret-right");
                    if (elements && elements.length > 0) {
                        element = elements[0];
                    }
                }
            }

            if (element) {
                //"click" the toggler using the angular2 renderer 
                let event = new MouseEvent('click', { bubbles: true });
                this.renderer.invokeElementMethod(element, 'dispatchEvent', [event]);
            }
        }, 200);
    }

    nodeSelect(event: any) {
        let node: TreeNode = event.node;
        this.onSelect.emit(<Folder>node.data);
    }

    loadNode(event: any) {
        if (event.node) {
            let node: TreeNode = event.node;
            let children: TreeNode[] = node.children;
            if (children.length <= 0) {
                this.loadChildren(node, false);
            }
        }
    }

    private loadChildren(rootNode: TreeNode, clear: boolean) {
        let folder: Folder = <Folder>rootNode.data;
        let parentPath: string = folder.path;
        this.dataService.findChildFolders(parentPath)
            .map(response => response.json())
            .subscribe(
            data => {
                if (data.length <= 0) {
                    rootNode.leaf = true;
                } else {
                    let folders: Folder[] = <Folder[]>data;
                    folders.forEach(element => {
                        let folder: Folder = <Folder>element;
                        let node: TreeNode = { "label": folder.name, "data": folder, children: [], "leaf": false };
                        rootNode.children.push(node);
                    });
                }
            },
            err => {
                console.log("Error: %s", err);
                if (clear) {
                    this.folders = [];
                    this.rootFolder = undefined;
                }
            },
            () => {
                console.log("Done loading: %s", folder.path);
            }
            );
    }

    toggle(event: any) {
        let newFolder: boolean = true;
        if (!this.currentFolder.endsWith("/")) {
            this.currentFolder += "/";
        }

        let node: TreeNode = FolderChooserComponent.findNode(this.currentFolder, this.rootNode);
        if (node && node !== null) {
            this.selectedFolder = node;
            newFolder = false;
        }

        if (newFolder) {
            // TODO: if user has typed some folder in the input text and folder doesn't exists then create it
            console.log("New Folder %s", this.currentFolder);
        }

        this.treeOverlayPanel.toggle(event);
    }

    private static findNode(current: string, root: TreeNode): TreeNode {
        let node: TreeNode = null;
        let data: Folder = <Folder>root.data;
        if (data.path === current) {
            node = root;
            return node;
        }
        let children: TreeNode[] = root.children;
        if (children) {
            for (var i = 0; i < children.length; i++) {
                let child: TreeNode = children[i];
                node = FolderChooserComponent.findNode(current, child);
                if (node) {
                    break;
                }
            }
        }

        return node;
    }

    createNewFolder(event: any) {
        this.createFolderDialog.visible = false;
        if (!this.newFolderName || this.newFolderName.trim().length <= 0) {
            // nothing to create
            return;
        }
        let folder: Folder = <Folder>this.selectedFolder.data;
        if (!folder) {
            folder = this.rootFolder;
        }

        let children: TreeNode[] = this.selectedFolder.children;
        for (var i = 0; i < children.length; i++) {
            let node: TreeNode = children[i];
            let f: Folder = node.data;
            if (f.name === this.newFolderName) {
                console.log("Folder with name %s is already exists under %s", this.newFolderName, folder.path);
                this.selectedFolder = node;
                this.onSelect.emit(f);
                this.newFolderName = undefined;
                return;
            }
        }

        this.dataService.createFolder(sessionStorage.getItem("userName"), this.newFolderName, folder.path)
            .map(response => response.json())
            .subscribe(
            data => {
                folder = <Folder>data;
                this.selectedFolder.leaf = false;
                let node: TreeNode = { "label": folder.name, "data": folder, children: [], "leaf": true };
                this.selectedFolder.children.push(node);
                this.selectedFolder = node;
                this.onSelect.emit(folder);
                this.newFolderName = undefined;
            },
            err => { console.log(err) },
            () => { }
            );
    }

    removeFolder(event: any) {
        this.removeFolderDialog.visible = false;
        let folder: Folder = this.selectedFolder.data;
        let parentPath: string = folder.parentPath;
        let path: string = folder.path;
        this.dataService.removeFolder(sessionStorage.getItem("userName"), path)
            .map(response => response.json())
            .subscribe(
            data => {
                // make parent of this node as selected folder and remove it from children array
                let node: TreeNode = FolderChooserComponent.findNode(parentPath, this.rootNode);
                let children: TreeNode[] = node.children;
                let index: number = -1;
                for (var i = 0; i < children.length; i++) {
                    let child: TreeNode = children[i];
                    let f: Folder = <Folder>child.data;
                    if (f.path === path) {
                        index = i;
                        break;
                    }
                }
                children.splice(index, 1);
                if (node.children.length <= 0) {
                    node.leaf = true;
                }
                this.selectedFolder = node;
                this.onSelect.emit(node.data);
            },
            err => { },
            () => { }
            );
    }
}