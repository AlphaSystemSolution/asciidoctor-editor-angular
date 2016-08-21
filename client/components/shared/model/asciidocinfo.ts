/**
 * Created by sali on 8/20/2016.
 */

import {DocumentType} from './documentType';

export class AsciiDocInfo {

    private _baseDir: string;
    private _documentType: DocumentType = DocumentType.ARTICLE;
    private _documentName: string;
    private _documentTitle: string;

    get baseDir(): string {
        return this._baseDir;
    }

    get documentType(): DocumentType {
        return (this._documentType === null) ? DocumentType.ARTICLE : this._documentType;
    }

    get documentName(): string {
        return this._documentName;
    }

    get documenTitle(): string {
        return this._documentTitle;
    }

    set baseDir(_baseDir: string) {
        this._baseDir = _baseDir;
    }

    set documentType(_documentType: DocumentType) {
        this._documentType = (_documentType === null) ? DocumentType.ARTICLE : _documentType;
    }

    set documentName(_documentName: string) {
        this._documentName = _documentName;
    }

    set documentTitle(_documentTitle: string) {
        this._documentTitle = _documentTitle;
    }
}