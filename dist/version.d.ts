import { Big } from 'big.js';
export default class Version {
    private _versionParts;
    static get MIN_VERSION(): Version;
    static get MAX_VERSION(): Version;
    get major(): number;
    set major(majorNum: number);
    get minor(): number;
    set minor(minorNum: number);
    get patch(): number;
    set patch(patchNum: number);
    get preReleaseType(): 'a' | 'b' | 'r' | undefined;
    set preReleaseType(preReleaseType: 'a' | 'b' | 'r' | undefined);
    get preReleaseNum(): number | undefined;
    set preReleaseNum(preReleaseNum: number | undefined);
    get isPreRelease(): boolean;
    constructor(major: number, minor?: number, patch?: number, preReleaseType?: ('a' | 'b' | 'r'), preRelease?: number);
    static fromString(versionStr: string): Version | undefined;
    toFloat(): Big;
    toString(): string;
    copy(): Version;
    equals(other: Version): boolean;
    asMaxString(): string;
    asMinString(): string;
}
//# sourceMappingURL=version.d.ts.map