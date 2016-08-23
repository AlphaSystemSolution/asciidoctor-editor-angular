/**
 * Created by sali on 8/21/2016.
 */
import {Component, OnInit, ViewChild, AfterViewInit, Renderer, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';

import {MenuItem, OverlayPanel, TreeNode} from 'primeng/primeng';

import {DataService} from '../data.service';
import {Folder, NewFolder} from '../model/common';

@Component({
    selector: 'folder-chooser',
    template: `
        <p-overlayPanel #treeOp [dismissable]="true" [showCloseIcon]="true">
            <p-tree [value]="folders" selectionMode="single" [(selection)]="selectedFolder" [style]="{'max-height':'200px','overflow':'auto'}" 
                (onNodeSelect)="nodeSelect($event)" (onNodeExpand)="loadNode($event)" [contextMenu]="cm"></p-tree>
        </p-overlayPanel>
        <p-contextMenu #cm [model]="items"></p-contextMenu>
        <p-overlayPanel #newFolderOp [dismissable]="true" (onAfterHide)="createNewFolder($event)">
            <input type="text" size="20" class="form-control" pInputText [(ngModel)]="newFolderName"/>
        </p-overlayPanel>
        `
})
export class FolderChooserComponent implements OnInit, AfterViewInit {

    folders: TreeNode[];
    selectedFolder: TreeNode;
    items: MenuItem[];
    private parentPath: string;
    private rootFolder: Folder;

    newFolderName: string;

    @ViewChild("treeOp")
    treeOverlayPanel: OverlayPanel;

    @ViewChild("newFolderOp")
    newFolderOverlayPanel: OverlayPanel;

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
            this.parentPath = "/" + userName + "/";
            this.rootFolder = new NewFolder(userName, this.parentPath, "/");
            let rootNode: TreeNode = { "label": userName, "data": this.rootFolder, children: [], "leaf": false };
            this.selectedFolder = rootNode;
            this.loadChildren(rootNode, true, true);
        }
        this.items = [
            { label: 'Create Folder', icon: 'fa-plus', command: (event) => this.newFolderOverlayPanel.toggle(event) },
            { label: 'Remove Folder', icon: 'fa-minus', command: (event) => console.log(this.selectedFolder.data) }
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

    nodeSelect(event) {
        let node: TreeNode = event.node;
        this.onSelect.emit(<Folder>node.data);
    }

    loadNode(event) {
        if (event.node) {
            let node: TreeNode = event.node;
            let children: TreeNode[] = node.children;
            if (children.length <= 0) {
                this.loadChildren(node, false, false);
            }
        }
    }

    private loadChildren(rootNode: TreeNode, addRoot: boolean, clear: boolean) {
        let folder: Folder = <Folder>rootNode.data;
        let parentPath: string = folder.path;
        this.dataService.findChildFolders(parentPath)
            .map(response => response.json())
            .subscribe(
            data => {
                if (addRoot) {
                    this.folders.push(rootNode);
                }
                if (data.length <= 0) {
                    rootNode.leaf = true;
                } else {
                    data.forEach(element => {
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
                    this.parentPath = undefined;
                    this.rootFolder = undefined;
                }
            },
            () => {
                console.log("Done loading: %s", folder.path);
            }
            );
    }

    toggle(event) {
        let newFolder: boolean = true;
        if (!this.currentFolder.endsWith("/")) {
            this.currentFolder += "/";
        }
        for (var i = 0; i < this.folders.length; i++) {
            let item: TreeNode = this.folders[i];
            let node: TreeNode = FolderChooserComponent.findNode(this.currentFolder, item);
            if (node && node !== null) {
                this.selectedFolder = node;
                newFolder = false;
                break;
            }
        }

        if (newFolder) {
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
        let chidren: TreeNode[] = root.children;
        if (!chidren || chidren.length <= 0) {
            return node;
        }
        for (var i = 0; i < chidren.length; i++) {
            let child: TreeNode = chidren[i];
            return FolderChooserComponent.findNode(current, child);
        }
        return node;
    }

    createNewFolder(event) {
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
}