/**
 * Created by sali on 8/19/2016.
 */

export class DocumentType {

    static BOOK: DocumentType = new DocumentType("book", "Book");
    static ARTICLE: DocumentType = new DocumentType("article", "Article");
    static MAN_PAGE: DocumentType = new DocumentType("manpage", "Man Page");
    private static VALUES: DocumentType[] = [DocumentType.BOOK, DocumentType.ARTICLE, DocumentType.MAN_PAGE];

    constructor(private type: string, private description: string) {
    }

    public getType(): string {
        return this.type;
    }

    public getDescription(): string {
        return this.description;
    }

    public static values(): DocumentType[] {
        return DocumentType.VALUES;
    }

    public toString(): string {
        return this.getDescription();
    }
}