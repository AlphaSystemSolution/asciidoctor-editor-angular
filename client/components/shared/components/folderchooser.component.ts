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
        <p-overlayPanel #op [dismissable]="true" [showCloseIcon]="true">
            <p-tree [value]="folders" selectionMode="single" [(selection)]="selectedFolder" [style]="{'max-height':'200px','overflow':'auto'}" 
                (onNodeSelect)="nodeSelect($event)" (onNodeExpand)="loadNode($event)" [contextMenu]="cm"></p-tree>
        </p-overlayPanel>
        <p-contextMenu #cm [model]="items"></p-contextMenu>
        `
})
export class FolderChooserComponent implements OnInit, AfterViewInit {

    folders: TreeNode[];
    selectedFolder: TreeNode;
    items: MenuItem[];
    private parentPath: string;
    private rootFolder: Folder;

    @ViewChild("op")
    overlayPanel: OverlayPanel;

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
            { label: 'Create Folder', icon: 'fa-plus', command: (event) => console.log(this.selectedFolder.data) },
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
        console.log("Current Folder: " + this.currentFolder);
        this.overlayPanel.toggle(event);
    }

    createNewFolder(event) {
        let folder: Folder = undefined;
        if (this.selectedFolder) {
            folder = <Folder>this.selectedFolder.data;
        }
        if (!folder) {
            folder = this.rootFolder;
        }
        console.log("Create New: %s", folder.path);
    }
}