/**
 * Created by sali on 8/15/2016.
 */
import {Component, ViewChild, OnInit} from '@angular/core';

import {MenuItem} from "primeng/primeng";

import {ApplicationController} from '../shared/applicationcontroller';
import {NewDocumentDialog} from '../dialogs/newdocument.dialog.component';

@Component({
    selector: 'menu-bar',
    template:
    `
        <div>
            <p-menubar [model]="items"></p-menubar>
        </div>
        <new-document-dialog #newDocumentDialog></new-document-dialog>
    `
})
export class MenubarComponent implements OnInit {

    private items: MenuItem[];

    @ViewChild("newDocumentDialog")
    newDocumentDialog: NewDocumentDialog;

    constructor(private applicationController: ApplicationController) {
    }

    ngOnInit() {
        this.items = [
            {
                label: "File",
                items: [
                    {
                        label: "New",
                        icon: "fa-file-o",
                        command: (event) => {
                            this.newFile(event);
                        }
                    },
                    {
                        label: "Open",
                        icon: "fa-folder-open-o",
                        command: (event) => {
                            this.openFile(event);
                        }
                    }
                ]
            }
        ];
    }


    private newFile(event: any) {
        this.newDocumentDialog.display = true;
    }

    private openFile(eventa: any) {
        console.log("Open file called.")
    }

}