/**
 * Created by sali on 8/21/2016.
 */
import * as crypto from 'crypto';

const ALGORITHM: string = "AES256";
const KEY: string = "PRIVATE_ASCIIDOC_EDITOR_KEY";
const INPUT_ENCODING: any = "utf8";
const OUTPUT_ENCODING: any = "base64";

export class EncryptionUtil {

    public static encryptText(clearText: string): string {
        let encryptedText: string = null;

        let cipher: crypto.Cipher = crypto.createCipher(ALGORITHM, KEY);
        encryptedText = cipher.update(clearText, INPUT_ENCODING, OUTPUT_ENCODING);
        encryptedText += cipher.final(OUTPUT_ENCODING);

        console.log("Encrypted value: %s", encryptedText);
        return encryptedText;
    }

    public static decyptText(encryptedText: string): string {
        let clearText: string = null;

        let decipher: crypto.Decipher = crypto.createDecipher(ALGORITHM, KEY);

        clearText = decipher.update(encryptedText, OUTPUT_ENCODING, INPUT_ENCODING);
        clearText += decipher.final(INPUT_ENCODING);

        console.log(clearText);
        return clearText;
    }

}