export class NipService {
    /***
     * Check valid nip format
     * @param nip {string} - nip string
     * @return return true when correct
     */
    static isValid(nip: string): boolean {
        if(typeof nip !== 'string')
            return false;

        nip = nip.replace(/[\ \-]/gi, '');

        const weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        let sum = 0;
        // tslint:disable-next-line:radix
        const controlNumber = parseInt(nip.substring(9, 10));
        const weightCount = weight.length;
        for (let i = 0; i < weightCount; i++) {
            // tslint:disable-next-line:radix
            sum += (parseInt(nip.substr(i, 1)) * weight[i]);
        }

        return sum % 11 === controlNumber;
    }

    /***
     * Check invalid nip format
     * @param nip {string} - nip string
     * @return return true when incorrect
     */
    static isInvalid(nip: string): boolean {
        return !NipService.isValid(nip);
    }
}
