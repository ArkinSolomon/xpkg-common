import { Big } from 'big.js';
import Version from './version.js';
export default class VersionSelection {
    _isValid = true;
    _ranges = [];
    get isValid() {
        return this._isValid;
    }
    get ranges() {
        return this._ranges.slice();
    }
    constructor(selectionStr) {
        const selectionSections = selectionStr.split(',');
        for (let selection of selectionSections) {
            const allRanges = {
                min: new Big('0.000002'),
                max: new Big('999999999'),
                minVersion: new Version(0, 0, 1, 'a', 1),
                maxVersion: new Version(999, 999, 999)
            };
            selection = selection.trim();
            const versionParts = selection.split('-');
            if (versionParts.length === 1) {
                if (selection === '*') {
                    this._ranges = [allRanges];
                    break;
                }
                const version = versionParts[0].trim();
                const minVersion = Version.fromString(version);
                if (!minVersion) {
                    this._isValid = false;
                    break;
                }
                const maxVersion = minVersion.copy();
                if (!minVersion.isPreRelease) {
                    const singleVersionParts = version.split('.');
                    if (singleVersionParts.length === 1)
                        maxVersion.minor = 999;
                    if (singleVersionParts.length <= 2)
                        maxVersion.patch = 999;
                    if (singleVersionParts.length <= 3)
                        minVersion.preReleaseType = 'a';
                }
                this._ranges.push({
                    max: maxVersion.toFloat(),
                    min: minVersion.toFloat(),
                    maxVersion,
                    minVersion
                });
                continue;
            }
            else if (versionParts.length !== 2) {
                this._isValid = false;
                break;
            }
            let [lowerVersionStr, upperVersionStr] = versionParts;
            lowerVersionStr = lowerVersionStr.trim();
            upperVersionStr = upperVersionStr.trim();
            let lowerVersion = Version.fromString(lowerVersionStr);
            const upperVersion = Version.fromString(upperVersionStr);
            const hasLower = lowerVersionStr !== '';
            const hasUpper = upperVersionStr !== '';
            if ((!lowerVersion && hasLower) || (!upperVersion && hasUpper) || (!hasLower && !hasUpper)) {
                this._isValid = false;
                break;
            }
            const range = allRanges;
            if (hasLower && lowerVersion) {
                if (!lowerVersion.isPreRelease)
                    lowerVersion = Version.fromString(lowerVersionStr + 'a1');
                range.min = lowerVersion.toFloat();
                range.minVersion = lowerVersion;
            }
            if (hasUpper && upperVersion) {
                const partLen = upperVersionStr.split('.').length;
                const hasPre = upperVersionStr.includes('a') || upperVersionStr.includes('b') || upperVersionStr.includes('r');
                if (!hasPre) {
                    if (partLen < 2)
                        upperVersion.minor = 999;
                    if (partLen < 3)
                        upperVersion.patch = 999;
                }
                range.max = upperVersion.toFloat();
                range.maxVersion = upperVersion;
            }
            if (range.min.gt(range.max)) {
                this._isValid = false;
                break;
            }
            this._ranges.push(range);
        }
        if (!this._isValid)
            return;
        this._ranges.sort(compareRanges);
        let curr = 0;
        while (this._ranges.length > 1 && curr < this._ranges.length - 1) {
            const r = tryMerge(this._ranges[curr], this._ranges[curr + 1]);
            if (!r)
                ++curr;
            else {
                this._ranges[curr] = r;
                this._ranges.splice(curr + 1, 1);
            }
        }
    }
    containsVersion(version) {
        for (const range of this._ranges) {
            const versionFloat = version.toFloat();
            if (versionFloat.gte(range.min) && versionFloat.lte(range.max))
                return true;
        }
        return false;
    }
    toString() {
        let rangeStrings = [];
        if (!this._ranges.length)
            return '<empty version select>';
        for (const range of this._ranges) {
            if (range.minVersion.equals(range.maxVersion))
                rangeStrings.push(range.minVersion.asMinString());
            else if (range.minVersion.equals(Version.MIN_VERSION) && range.maxVersion.equals(Version.MAX_VERSION))
                return '*';
            else if (range.minVersion.equals(Version.MIN_VERSION))
                rangeStrings = ['-' + range.maxVersion.asMaxString()];
            else if (range.maxVersion.equals(Version.MAX_VERSION)) {
                rangeStrings.push(range.minVersion.asMinString() + '-');
                break;
            }
            else
                rangeStrings.push(`${range.minVersion.asMinString()}-${range.maxVersion.asMaxString()}`);
        }
        return rangeStrings.join(',');
    }
}
function tryMerge(r1, r2) {
    if (compareRanges(r1, r2) > 0)
        throw new Error('Invalid ordering of ranges');
    if (r1.max.lt(r2.min))
        return;
    if (r1.max.lt(r2.max)) {
        const newRange = {
            min: r1.min,
            minVersion: r1.minVersion,
            max: r2.max,
            maxVersion: r2.maxVersion
        };
        return newRange;
    }
    return r1;
}
function compareRanges(r1, r2) {
    const minComp = r1.min.cmp(r2.min);
    if (minComp === 0)
        return r1.max.cmp(r2.max);
    return minComp;
}
//# sourceMappingURL=versionSelection.js.map