/**
 * Created by sali on 8/19/2016.
 */

import {Component, ViewChild} from '@angular/core';

import {OverlayPanel, SelectItem} from 'primeng/primeng';

import {BaseDialog} from './basedialog';
import {FolderChooserComponent} from '../shared/components/folderchooser.component';
import {DocumentType} from '../shared/model/documenttype';
import {AsciiDocInfo} from '../shared/model/asciidocinfo';
import {Folder} from '../shared/model/common';

@Component({
    selector: 'new-document-dialog',
    templateUrl: './client/components/dialogs/newdocument.dialog.html'
})
export class NewDocumentDialog extends BaseDialog {

    @ViewChild("folderChooser")
    folderChooser: FolderChooserComponent;

    documentTypes: SelectItem[];

    asciiDocInfo: AsciiDocInfo;

    constructor() {
        super();
        this.documentTypes = [];
        DocumentType.values().forEach(documentType => {
            this.documentTypes.push({ label: documentType.getDescription(), value: documentType });
        });
        this.asciiDocInfo = new AsciiDocInfo();
        this.asciiDocInfo.documentType = DocumentType.ARTICLE;
        this.asciiDocInfo.documentName = "";
        this.asciiDocInfo.baseDir = "/" + sessionStorage.getItem("userName") + "/";
    }

    createNewDocument() {

    }

    disable(): boolean {
        let baseDir: string = this.asciiDocInfo.baseDir;
        let invalidBaseDir = !baseDir || (baseDir && baseDir.trim().length <= 0);
        let documentName: string = this.asciiDocInfo.documentName;
        let invalidName: boolean = (documentName !== undefined && documentName.trim().length <= 0);
        return (this.asciiDocInfo.documentType === null) || invalidBaseDir || invalidName;
    }

    updateBaseDir(folder: Folder) {
        this.asciiDocInfo.baseDir = folder.path;
    }

    toggleOverlay(event) {
        this.folderChooser.toggle(event);
    }
}