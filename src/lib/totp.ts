import crypto from 'node:crypto';
const B32='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32Encode(buf:Buffer){ let bits=0,val=0,out=''; for(const b of buf){ val=(val<<8)|b; bits+=8; while(bits>=5){ out+=B32[(val>>>(bits-5))&31]; bits-=5; } } if(bits>0)out+=B32[(val<<(5-bits))&31]; return out; }
export function base32Decode(s:string){ const clean=s.replace(/=+$/,'').toUpperCase(); let bits=0,val=0; const bytes:number[]=[]; for(const ch of clean){ const i=B32.indexOf(ch); if(i<0)continue; val=(val<<5)|i; bits+=5; if(bits>=8){ bytes.push((val>>>(bits-8))&255); bits-=8; } } return Buffer.from(bytes); }
export function generateSecret(){ return base32Encode(crypto.randomBytes(20)); }
export function totp(secret:string,at=Date.now(),stepSec=30,digits=6){ const counter=Math.floor(at/1000/stepSec); const msg=Buffer.alloc(8); msg.writeBigInt64BE(BigInt(counter)); const h=crypto.createHmac('sha1',base32Decode(secret)).update(msg).digest(); const off=h[h.length-1]&0xf; const code=((h[off]&0x7f)<<24)|((h[off+1]&0xff)<<16)|((h[off+2]&0xff)<<8)|(h[off+3]&0xff); return String(code%(10**digits)).padStart(digits,'0'); }
export function verifyTotp(secret:string,code:string,at=Date.now()){ if(!/^\d{6}$/.test(code||''))return false; return [-1,0,1].some(w=>totp(secret,at+w*30000)===code); }
export function otpauthUrl(secret:string,email:string){ return `otpauth://totp/CheminHMS:${encodeURIComponent(email)}?secret=${secret}&issuer=CheminHMS&algorithm=SHA1&digits=6&period=30`; }
