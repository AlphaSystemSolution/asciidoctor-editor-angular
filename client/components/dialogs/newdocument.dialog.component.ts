/**
 * Created by sali on 8/19/2016.
 */

import {Component} from '@angular/core';

import {SelectItem} from 'primeng/primeng';

import {BaseDialog} from './basedialog';
import {DocumentType} from '../shared/model/documenttype';
import {AsciiDocInfo} from '../shared/model/asciidocinfo';

@Component({
    selector: 'new-document-dialog',
    templateUrl: './client/components/dialogs/newdocument.dialog.html'
})
export class NewDocumentDialog extends BaseDialog {

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
        this.asciiDocInfo.baseDir = "/usr/default"; // TODO: read this from user profile
    }

    createNewDocument() {

    }

    disable(): boolean {
        let documentName:string = this.asciiDocInfo.documentName;
        let invalidName: boolean = (documentName !== undefined && documentName.trim().length <= 0);
        return this.asciiDocInfo.documentType === null || invalidName;
    }
}