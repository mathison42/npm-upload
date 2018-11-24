const fs = require('fs');
const rp = require('request-promise');
const path = require('path');

var recordFile;
var records = [];
var looping = false;


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
  console.log("Seconds: " + millisecs/1000);

  streamableLoop(username, password, folder, millisecs)
};

/**
 * @function  [streamableLoop]
 * @returns {list} streamable ids
 */
async function streamableLoop (username, password, folder, millisecs) {

  const videos = gatherVideos(folder);
  const newVideos = findNewVideos(videos);

  if (newVideos.length == 0) {
    console.log(getTime() + " No new videos found...");
    setTimeout(function(){ streamableLoop (username, password, folder, millisecs); }, millisecs);
  } else {
    console.log(getTime() + " Uploading " + newVideos.length + " new video(s)...");
    console.log(newVideos);
    for (const video of newVideos) {
      await upload2Streamable(username, password, video, addRecord);
    }
    looping = true;
    // Note: After last upload, addRecord doesn't await. So if timeout isn't used, last video will upload twice.
    setTimeout(function(){ streamableLoop (username, password, folder, millisecs); }, millisecs);
  }
}

/**
 * @function  [upload2Streamable]
 * @returns rp Promise
 */
function upload2Streamable(username, password, video, cb) {
  var videoStream = fs.createReadStream(video)
  return rp({
    method: 'POST',
    url: `https://api.streamable.com/upload`,
    formData: { videoStream },
    json: true,
    auth: { username, password }
  }, (err, res, body) => {
    if (err) {
      reject(err)
    }
    if (body) {
        const { shortcode } = body
        console.log(getTime() + " Uploaded " + video + " with shortcode [" + shortcode + "]");
        return cb(video);
    } else {
        console.log(getTime() + " Failed to upload " + video + ".");
    }
  }).catch((error) => {
    if (error.statusCode != 429) {
      reject(err)
    }
    console.log(getTime() + " [Info] Reached Streamable upload limit. Please try again later.")
  });
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
    if (!looping)
      console.log("Found file: " + input);
    files.push(input);
  } else if (stats.isDirectory()){
    if (!looping)
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

/**
 * @function  [getTime]
 * @returns Returns current time. [HH:MM:MMM]
 */
function getTime() {
    var date = new Date();
    return "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]"
}

// Export all methods
module.exports = { streamable, streamableLoopInit};
