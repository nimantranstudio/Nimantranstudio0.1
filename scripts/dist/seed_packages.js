"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("../src/generated/client");
var prisma = new client_1.PrismaClient();
var packages = [
    {
        name: 'WhatsApp',
        price: 999,
        level: 1,
        allowedItems: JSON.stringify([
            'Save the date',
            'Wedding Invitation',
            'Haldi Invitation',
            'Sangeet Invitation',
            'Mehendi Invitation',
            'Video',
            'RSVP',
            'Thank you'
        ]),
        isActive: true
    },
    {
        name: 'WhatsApp+ Printables',
        price: 1999,
        level: 2,
        allowedItems: JSON.stringify([
            'Save the date',
            'Wedding Invitation',
            'Haldi Invitation',
            'Sangeet Invitation',
            'Mehendi Invitation',
            'Video',
            'RSVP',
            'Reception',
            'Welcome wedding poster',
            'Welcome haldi poster',
            'Thank you'
        ]),
        isActive: true
    },
    {
        name: 'Complete suite',
        price: 3999,
        level: 3,
        allowedItems: JSON.stringify([
            'Save the date',
            'Wedding Invitation',
            'Haldi Invitation',
            'Sangeet Invitation',
            'Mehendi Invitation',
            'Video',
            'RSVP',
            'Reception',
            'Welcome wedding poster',
            'Welcome haldi poster',
            'Welcome mehendi poster',
            'Initials logo',
            'Wedding contract',
            'Do not disturb',
            'Ladke wale tag',
            'Ladki wale tag',
            'Thank you'
        ]),
        isActive: true
    }
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, packages_1, pkg, upsertedPackage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Seeding packages...');
                    _i = 0, packages_1 = packages;
                    _a.label = 1;
                case 1:
                    if (!(_i < packages_1.length)) return [3 /*break*/, 4];
                    pkg = packages_1[_i];
                    return [4 /*yield*/, prisma.package.upsert({
                            where: { id: pkg.name }, // Using name as a pseudo-unique if we had one, but we don't, so we'll just create or find another way
                            // Actually, since there's no unique constraint on name in the schema yet, let's just use create or find by name manually.
                            update: pkg,
                            create: pkg,
                        })];
                case 2:
                    upsertedPackage = _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Rewriting main to handle lack of unique constraint safely
function seedPackages() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, packages_2, pkgData, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting package seeding...');
                    _i = 0, packages_2 = packages;
                    _a.label = 1;
                case 1:
                    if (!(_i < packages_2.length)) return [3 /*break*/, 7];
                    pkgData = packages_2[_i];
                    return [4 /*yield*/, prisma.package.findFirst({
                            where: { name: pkgData.name }
                        })];
                case 2:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.package.update({
                            where: { id: existing.id },
                            data: pkgData
                        })];
                case 3:
                    _a.sent();
                    console.log("Updated package: ".concat(pkgData.name));
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, prisma.package.create({
                        data: pkgData
                    })];
                case 5:
                    _a.sent();
                    console.log("Created package: ".concat(pkgData.name));
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log('Package seeding completed.');
                    return [2 /*return*/];
            }
        });
    });
}
seedPackages()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
