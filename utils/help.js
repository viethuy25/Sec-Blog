module.exports.encode = function encode(data){
    let buf = data;
    let base64 = buf.toString('base64');
    return base64
}