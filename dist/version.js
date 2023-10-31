import { Big } from 'big.js';
export default class Version {
    _versionParts;
    static get MIN_VERSION() {
        return new Version(0, 0, 1, 'a', 1);
    }
    static get MAX_VERSION() {
        return new Version(999, 999, 999);
    }
    get major() {
        return this._versionParts[0];
    }
    set major(majorNum) {
        this._versionParts[0] = majorNum;
    }
    get minor() {
        return this._versionParts[1];
    }
    set minor(minorNum) {
        this._versionParts[1] = minorNum;
    }
    get patch() {
        return this._versionParts[2];
    }
    set patch(patchNum) {
        this._versionParts[2] = patchNum;
    }
    get preReleaseType() {
        return this._versionParts[3];
    }
    set preReleaseType(preReleaseType) {
        this._versionParts[3] = preReleaseType;
        if (preReleaseType)
            this._versionParts[4] ||= 1;
    }
    get preReleaseNum() {
        return this._versionParts[4];
    }
    set preReleaseNum(preReleaseNum) {
        if (this._versionParts[3])
            this._versionParts[4] = preReleaseNum;
    }
    get isPreRelease() {
        return !!this._versionParts[3];
    }
    constructor(major, minor = 0, patch = 0, preReleaseType, preRelease) {
        if (typeof preRelease !== 'undefined' && !preReleaseType)
            throw new Error('Pre-release number provided without specifying alpha, beta, or pre-release');
        else if (typeof preRelease === 'undefined' && preReleaseType) {
            let preReleaseHumanReadableType;
            switch (preReleaseType) {
                case 'a':
                    preReleaseHumanReadableType = 'alpha';
                    break;
                case 'b':
                    preReleaseHumanReadableType = 'beta';
                    break;
                case 'r':
                    preReleaseHumanReadableType = 'release candidate';
                    break;
                default:
                    throw new Error('Invalid pre-release type: ' + preReleaseType);
            }
            throw new Error('Pre-release number not provided but version specified as ' + preReleaseHumanReadableType);
        }
        else if (preRelease === 0)
            throw new Error('Pre-release number can not be zero');
        if ((major | minor | patch) === 0)
            throw new Error('Major, minor, and patch are all zero');
        this._versionParts = [major, minor ?? 0, patch ?? 0, preReleaseType, preRelease];
    }
    static fromString(versionStr) {
        if (versionStr !== versionStr.trim().toLowerCase() || versionStr.length < 1 || versionStr.length > 15 || versionStr.endsWith('.'))
            return;
        const versionDecomp = [0, 0, 0, void (0), void (0)];
        const testNumStr = (s) => /^\d{1,3}$/.test(s);
        let semanticPart = versionStr;
        if (versionStr.includes('a') || versionStr.includes('b') || versionStr.includes('r')) {
            const matches = versionStr.match(/([abr])/);
            const preReleaseType = matches?.[1];
            versionDecomp[3] = preReleaseType;
            const parts = versionStr.split(new RegExp(preReleaseType));
            semanticPart = parts[0];
            const preReleasePart = parts[1];
            if (semanticPart.endsWith('.'))
                return;
            if (!testNumStr(preReleasePart))
                return;
            const preReleaseNum = parseInt(preReleasePart, 10);
            if (preReleaseNum <= 0)
                return;
            versionDecomp[4] = preReleaseNum;
        }
        let major, minor, patch;
        const semanticParts = semanticPart.split(/\./g);
        if (semanticParts.length === 3)
            [major, minor, patch] = semanticParts;
        else if (semanticParts.length === 2)
            [major, minor] = semanticParts;
        else if (semanticParts.length === 1)
            [major] = semanticParts;
        else
            return;
        if (!testNumStr(major) || (minor && !testNumStr(minor)) || (patch && !testNumStr(patch)))
            return;
        const majorNum = parseInt(major, 10);
        const minorNum = minor ? parseInt(minor, 10) : 0;
        const patchNum = patch ? parseInt(patch, 10) : 0;
        if (majorNum < 0 || minorNum < 0 || patchNum < 0 || (majorNum | minorNum | patchNum) === 0)
            return;
        versionDecomp[0] = majorNum;
        versionDecomp[1] = minorNum;
        versionDecomp[2] = patchNum;
        return new Version(...versionDecomp);
    }
    toFloat() {
        const floatStr = `${this._versionParts[0]}${toThreeDigits(this._versionParts[1])}${toThreeDigits(this._versionParts[2])}`;
        const semverFloat = new Big(floatStr);
        const preReleaseType = this._versionParts[3];
        if (!preReleaseType)
            return semverFloat;
        const preReleaseNum = 999 - this._versionParts[4];
        let preReleaseFloatStr;
        switch (preReleaseType) {
            case 'a':
                preReleaseFloatStr = `.999999${toThreeDigits(preReleaseNum)}`;
                break;
            case 'b':
                preReleaseFloatStr = `.999${toThreeDigits(preReleaseNum)}999`;
                break;
            case 'r':
                preReleaseFloatStr = `.${toThreeDigits(preReleaseNum)}999999`;
                break;
        }
        const preReleaseFloat = new Big(preReleaseFloatStr);
        return semverFloat.sub(preReleaseFloat);
    }
    toString() {
        let finalStr = this._versionParts.slice(0, 3).join('.');
        if (this._versionParts[3])
            finalStr += this._versionParts.slice(3, 5).join('');
        return finalStr;
    }
    copy() {
        return new Version(this.major, this.minor, this.patch, this.preReleaseType, this.preReleaseNum);
    }
    equals(other) {
        if (!other || !(other instanceof Version))
            return false;
        return this.toFloat().eq(other.toFloat());
    }
    asMaxString() {
        if (this.isPreRelease) {
            const str = this.asMinString();
            if (this.preReleaseType === 'a' && this.preReleaseNum === 1)
                return str + 'a1';
            return str;
        }
        else if (this.patch === 999 && this.minor === 999)
            return this.major.toString();
        else if (this.patch === 999)
            return `${this.major}.${this.minor}`;
        return `${this.major}.${this.minor}.${this.patch}`;
    }
    asMinString() {
        let str = this.major.toString();
        if (this.patch)
            str += `.${this.minor}.${this.patch}`;
        else if (this.minor)
            str += `.${this.minor}`;
        if (this.isPreRelease && !(this.preReleaseType === 'a' && this.preReleaseNum === 1))
            str += this._versionParts[3] + this.preReleaseNum;
        return str;
    }
}
function toThreeDigits(num) {
    if (typeof num === 'number')
        num = num.toString();
    if (num.length === 1)
        return '00' + num;
    else if (num.length === 2)
        return '0' + num;
    else if (num.length === 3)
        return num;
    else
        throw new Error('Number too long');
}
//# sourceMappingURL=version.js.map