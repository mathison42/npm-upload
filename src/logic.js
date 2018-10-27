const fs = require('fs');
const request = require('request');
const path = require('path');

/**
 * @function  [streamable]
 * @returns {list} streamable ids
 */
const streamable = (username, password, input) => {
  if (!input) {
    input = ".";
  }

  var files = [];
  var videos = [];

  const stats = fs.lstatSync(input);
  if (stats.isFile()) {
    console.log("Found file: " + input);
    files.push(input);
  } else if (stats.isDirectory()){
    console.log("Found directory: " + input);
    var temp = fs.readdirSync(input);
    temp.forEach( t => {
      files.push(input + path.sep + t);
    });
  } else {
    return console.log("[Error] You should not be here."); //Handle error
  }

  files.forEach(file => {
    if (file.endsWith(".mp4")) {
      console.log(file);
      videos.push(fs.createReadStream(file));
    }
  });

  if (videos.length == 0) {
    return console.log("No videos found.");
  }
  console.log("Uploading " + videos.length + " video(s)...");

  videos.forEach(video => {
    upload2Streamable(username, password, video, console.log);
  });

};

function upload2Streamable(username, password, video, cb) {
  const req = request({
    method: 'POST',
    url: `https://api.streamable.com/upload`,
    formData: { video },
    json: true,
    auth: { username, password }
  }, (err, res, body) => {
    if (err) {
      return console.log(err)
    }
    const { shortcode } = body
    this.shortcode = shortcode
    return cb("Uploaded " + video.path + " with shortcode [" + shortcode + "]")
  })

  return req
}

// Export all methods
module.exports = { streamable };
