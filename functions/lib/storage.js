"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const Storage = require("@google-cloud/storage");
const gcs = Storage();
const os_1 = require("os");
const path_1 = require("path");
const sharp = require("sharp");
exports.resizeAvatar = functions.storage
    .object()
    .onFinalize((object) => __awaiter(this, void 0, void 0, function* () {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const tmpFilePath = path_1.join(os_1.tmpdir(), object.name);
    const avatarFileName = 'avatar_' + fileName;
    const tmpAvatarPath = path_1.join(os_1.tmpdir(), avatarFileName);
    if (fileName.includes('avatar_')) {
        console.log('exiting function');
        return false;
    }
    yield bucket.file(filePath).download({
        destination: tmpFilePath
    });
    yield sharp(tmpFilePath)
        .resize(100, 100)
        .toFile(tmpAvatarPath);
    return bucket.upload(tmpAvatarPath, {
        destination: path_1.join(path_1.dirname(filePath), avatarFileName)
    });
}));
//# sourceMappingURL=storage.js.map