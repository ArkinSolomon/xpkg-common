import Version from './version.js';
import VersionSelection from './versionSelection.js';
import profaneWords from './profaneWords.js';
export function isProfane(text) {
    const parts = text.split(/[\s._]/);
    for (const part of parts) {
        if (profaneWords.includes(part.toLowerCase())) {
            return true;
        }
    }
    return false;
}
export function validateId(packageId) {
    if (typeof packageId !== 'string')
        return false;
    let pId = packageId;
    if (packageId.includes('/')) {
        const parts = packageId.split('/');
        const [repo] = parts;
        pId = parts[1];
        if (!/^[a-z]{3,8}$/i.test(repo))
            return false;
    }
    if (pId.length > 32 || pId.length < 6)
        return false;
    return /^([a-z][a-z0-9_-]*\.)*[a-z][a-z0-9_-]*$/i.test(pId);
}
export function isValidEmail(chain) {
    return chain
        .trim()
        .notEmpty().bail().withMessage('invalid_or_empty_str')
        .isEmail().bail().withMessage('bad_email')
        .isLength({
        min: 5,
        max: 64
    }).bail().withMessage('bad_len')
        .toLowerCase();
}
export function isValidName(chain) {
    return chain
        .trim()
        .notEmpty().bail().withMessage('invalid_or_empty_str')
        .custom(value => !isProfane(value)).bail().withMessage('profane_name')
        .custom(value => /^[a-z][a-z0-9\x20-.]+[a-z0-9]$/i.test(value)).withMessage('invalid_name');
}
export function isValidPassword(chain) {
    return chain
        .notEmpty().withMessage('invalid_or_empty_str')
        .isLength({
        min: 8,
        max: 64
    }).bail().withMessage('bad_len')
        .custom(value => value.toLowerCase() !== 'password').withMessage('is_password');
}
export function asPartialXpkgPackageId(chain) {
    return chain
        .trim()
        .notEmpty().bail().withMessage('invalid_or_empty_str')
        .custom(value => validateId(value) && !value.startsWith('xpkg/')).bail().withMessage('invalid_id_or_repo')
        .customSanitizer(value => value.replace('xpkg/', ''));
}
export function isPartialPackageId(chain) {
    return chain
        .trim()
        .notEmpty().bail().withMessage('invalid_or_empty_str')
        .custom(value => validateId(value) && !value.includes('/')).withMessage('full_id_or_invalid');
}
export function isValidDescription(chain) {
    return chain
        .trim()
        .notEmpty().bail().withMessage('invalid_or_empty_str')
        .isLength({
        min: 10,
        max: 8192
    }).bail().withMessage('bad_desc_len')
        .custom(value => !isProfane(value)).withMessage('profane_desc');
}
export function asVersion(chain) {
    return chain
        .notEmpty().bail().withMessage('invalid_or_empty_str')
        .isLength({
        min: 1,
        max: 15
    }).bail().withMessage('bad_version_len')
        .custom(value => {
        const version = Version.fromString(value);
        if (!version)
            return false;
        chain.__xpkgVersionCache = version;
        return true;
    })
        .bail().withMessage('invalid_version')
        .customSanitizer(() => {
        return chain.__xpkgVersionCache;
    });
}
export function asVersionSelection(chain) {
    return chain
        .notEmpty().bail().withMessage('invalid_or_empty_str')
        .isLength({
        min: 1,
        max: 256
    }).bail().withMessage('bad_sel_len')
        .custom(value => {
        const selection = new VersionSelection(value);
        if (!selection.isValid)
            return false;
        chain.__xpkgSelectionCache = selection;
        return true;
    })
        .bail().withMessage('invalid_selection')
        .customSanitizer(() => chain.__xpkgSelectionCache);
}
//# sourceMappingURL=validators.js.map