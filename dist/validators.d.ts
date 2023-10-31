import { ValidationChain } from 'express-validator';
export declare function isProfane(text: string): boolean;
export declare function validateId(packageId: unknown): boolean;
export declare function isValidEmail(chain: ValidationChain): ValidationChain;
export declare function isValidName(chain: ValidationChain): ValidationChain;
export declare function isValidPassword(chain: ValidationChain): ValidationChain;
export declare function asPartialXpkgPackageId(chain: ValidationChain): ValidationChain;
export declare function isPartialPackageId(chain: ValidationChain): ValidationChain;
export declare function isValidDescription(chain: ValidationChain): ValidationChain;
export declare function asVersion(chain: ValidationChain): ValidationChain;
export declare function asVersionSelection(chain: ValidationChain): ValidationChain;
//# sourceMappingURL=validators.d.ts.map