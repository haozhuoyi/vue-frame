import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse('1234567890000000') // 16位
const iv = CryptoJS.enc.Utf8.parse('1234567890000000')

export default {
    // aes加密
    encrypt (word) {
        let encrypted = ''
        if (typeof word === 'string') {
            const srcs = CryptoJS.enc.Utf8.parse(word)
            encrypted = CryptoJS.AES.encrypt(srcs, key, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
        } else if (typeof word === 'object') {
            // 对象格式的转成json字符串
            const data = JSON.stringify(word)
            const srcs = CryptoJS.enc.Utf8.parse(data)
            encrypted = CryptoJS.AES.encrypt(srcs, key, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
        }
        return encrypted.ciphertext.toString()
    },
    // aes解密
    decrypt (word) {
        const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
        const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
        const decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
        return decryptedStr.toString()
    }
}

/*
  使用
    调用: import Crypto from "@/utils/crypto";

    具体: Crypto.encrypt("✓ à la mode"); // b915bf40c4795227488da86978f55fce
    具体: Crypto.decrypt(userPwd); // "✓ à la mode"

    具体: Crypto.encrypt("✓ à la mode"); // 6317313288b32bf1909f165ec530d60a
    具体: Crypto.decrypt(userPwd); // "I ♡ Unicode!"

    具体: Crypto.encrypt("我爱中国"); // 1898a34273855f55255437aa22f87504
    具体: Crypto.decrypt(userPwd); // "我爱中国"

    具体: Crypto.encrypt("123456"); // dd7a6c4edc68e683b700a7a2846a2bc6
    具体: Crypto.decrypt(userPwd); // "123456"
*/
