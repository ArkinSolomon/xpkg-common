type VersionRange = {
    min: Big;
    max: Big;
    minVersion: Version;
    maxVersion: Version;
};
import { Big } from 'big.js';
import Version from './version.js';
export default class VersionSelection {
    private _isValid;
    private _ranges;
    get isValid(): boolean;
    get ranges(): VersionRange[];
    constructor(selectionStr: string);
    containsVersion(version: Version): boolean;
    toString(): string;
}
export {};
//# sourceMappingURL=versionSelection.d.ts.map