const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const path = require('path');

var recordFile;
var records = [];


const populateRecords = () => {
  if (fs.existsSync(recordFile)) {
    var text = fs.readFileSync(recordFile).toString();
    records = text.split("\r\n")
    records = records.filter(function (el) {
      return el != null && el != '';
    });
  }
}

const addRecord = (name) => {
  fs.appendFile(recordFile, name + "\r\n", (err) => {
    if (err) throw err;
    records.push(name);
  });
}

const findNewVideos = (videos) => {
  var result = videos.filter(function(element) {
    return records.indexOf(element) === -1;
  });
  return result
}

/**
 * @function  [streamable]
 * @returns {list} streamable ids
 */
const streamable = (username, password, input) => {

  const videos = gatherVideos(input ? input : ".");

  if (videos.length == 0) {
    return console.log("No new videos found...");
  }

  console.log("Uploading " + videos.length + " video(s)...");

  videos.forEach(video => {
    upload2Streamable(username, password, video, () => {});
  });

};


/**
 * @function  [streamableLoopInit]
 * @returns {list} streamable ids
 */
const streamableLoopInit = (username, password, folder, secs) => {

  folder = folder ? folder : ".";
  recordFile = folder + path.sep + "streamableRecordFile.txt";
  populateRecords()
  console.log("Identified Records: " + records);
  var millisecs = 10000;
  if (secs && secs > 10) {
    millisecs = secs * 1000;
  }
  console.log(millisecs);

  streamableLoop(username, password, folder, millisecs)
};

/**
 * @function  [streamableLoop]
 * @returns {list} streamable ids
 */
async function streamableLoop (username, password, folder, millisecs) {

  const videos = gatherVideos(folder);
  const newVideos = findNewVideos(videos);

  console.log(newVideos);

  if (newVideos.length == 0) {
    console.log("No new videos found...");
    setTimeout(function(){ streamableLoop (username, password, folder, millisecs); }, millisecs);
  } else {
    console.log("Uploading " + newVideos.length + " new video(s)...");
    await processUploadParallel(username, password, newVideos)
      .then(_ => setTimeout(function(){ streamableLoop (username, password, folder, millisecs); }, millisecs));
  }
}

async function processUploadParallel(username, password, videos) {
    const promises = videos.map( video => {
      upload2Streamable(username, password, video, addRecord);
    });
    Promise.all(promises);
    console.log('1')
}

/**
 * @function  [upload2Streamable]
 * @returns rp Promise
 */
function upload2Streamable(username, password, video, cb) {
  var videoStream = fs.createReadStream(video)
 // return new Promise(resolve => setTimeout(resolve, 3000));
// return console.log(video)
return new Promise(resolve =>
    rp({
      method: 'POST',
      url: `https://api.streamable.com/upload`,
      formData: { videoStream },
      json: true,
      auth: { username, password }
    }, (err, res, body) => {
      if (err) {
        reject(err)
      }
      const { shortcode } = body
      console.log("Uploaded " + video + " with shortcode [" + shortcode + "]");
      return cb(video);
    })
  );
}

/**
 * @function  [gatherVideos]
 * @returns List of Video paths
 */
function gatherVideos(input) {
  var files = [];
  var videos = [];

  var stats = fs.lstatSync(input);
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
      videos.push(file);
    }
  });
  return videos;
}

// Export all methods
module.exports = { streamable, streamableLoopInit};
