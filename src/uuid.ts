
//
// UUID
//
class UUID
{
	static nullUUID: string = "00000000-0000-0000-0000-000000000000";
	static verifyUUID(uuid: string): any
	{
		// retv: normalized UUID or false.
		if(!uuid || uuid.length != (32 + 4)){
			return false;
		}
		return uuid.toLowerCase();
	}
	static convertFromHexString(hex: string): any
	{
		if(hex.length != 32){
			return false;
		}
		return this.verifyUUID(
			hex.substr( 0, 8) + "-" + 
			hex.substr( 8, 4) + "-" + 
			hex.substr(12, 4) + "-" + 
			hex.substr(16, 4) + "-" + 
			hex.substr(20, 12)
		);
	}
	static generateVersion4(): string
	{
		var g = this.generate16bitHexStrFromNumber;
		var f = this.generateRandom16bitHexStr;
		var n = this.generateRandom16bitHex;
		return f() + f() + "-" + f() + "-" + g(0x4000 | (n() & 0x0fff)) + "-" + g(0x8000 | (n() & 0x3fff)) + "-" + f() + f() + f();
	}
	private static generateRandom16bitHexStr(): string
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).toLowerCase().substring(1);
	}
	private static generateRandom16bitHex(): number
	{
		return ((Math.random() * 0x10000) | 0);
	}
	private static generate16bitHexStrFromNumber(num: number): string
	{
		return (num + 0x10000).toString(16).toLowerCase().substring(1);
	}
	static getBase64EncodedUUID(uuid: string): string
	{
		uuid = this.verifyUUID(uuid);
		if(!uuid){
			return null;
		}
		uuid = uuid.replaceAll("-", "") + "0000";
		var retv = "";
		var f = function(n: number){
			if(0 <= n && n < 26){
				return String.fromCharCode(0x41 + n);
			} else if(26 <= n && n < 52){
				return String.fromCharCode(0x61 + (n - 26));
			} else if(52 <= n && n < 62){
				return String.fromCharCode(0x30 + (n - 52));
			} else if(62 <= n && n < 64){
				return (n == 62) ? "+" : "/";
			}
		};
		for(var i = 0; i < 6; i++){
			var chunk = parseInt(uuid.substr(i * 6, 6), 16);
			retv += f(0x3f & (chunk >> 18));
			retv += f(0x3f & (chunk >> 12));
			retv += f(0x3f & (chunk >> 6));
			retv += f(0x3f & chunk);
		}
		retv = retv.substr(0, 22) + "==";
		return retv;
	}
}
